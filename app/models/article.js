import moment from 'moment';

import DS from 'ember-data';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';

import { makeHttps } from '../helpers/make-https';
import DomFixer from '../utils/dom-fixer';

export default DS.Model.extend({
  allowComments: DS.attr('boolean'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  authorNickname: DS.attr('string'), // display name
  authoredOn: DS.attr('string'),
  authoredOnUtc: DS.attr('string'),
  blogId: DS.attr('number'),
  categories: DS.attr(),
  commentCount: DS.attr('number'),
  entrytopics: DS.attr(),
  excerpt: DS.attr('string'),
  excerptFull: DS.attr('string'),
  excerptPretty: DS.attr('string'),
  excerptSponsor: DS.attr('string'),
  modifiedOn: DS.attr('string'),
  modifiedOnUtc: DS.attr('string'),
  permalink: DS.attr('string'),
  platypusId: DS.attr('string'),
  socialtopics: DS.attr(),
  tags: DS.attr(),
  text: DS.attr('string'),
  textMore: DS.attr('string'),
  thumbnail60: DS.attr('string'),
  thumbnail105: DS.attr('string'),
  thumbnail300: DS.attr('string'),
  thumbnail640: DS.attr('string'),
  title: DS.attr('string', {defaultValue:  ''}),

  // gallery attrs
  gallery: DS.attr(),

  hasGallery: DS.attr('boolean'),
  galleryDropbox: DS.attr('boolean'),
  galleryFull: DS.attr(),
  galleryArray: DS.attr(),
  galleryCaptions: DS.attr(),
  galleryCredit: DS.attr(),

  async loadGallery() {
    if (!this.hasGallery) {
      return this;
    }

    if (this.galleryDropbox) {
      let gallery = await this.store.findRecord('gallery', this.entrytopics[0])
      this.set('gallery', gallery);
    } else {
      let slides = [];
      for (let i = 0; i < this.galleryFull.length; i++) {
        slides.push({
          full: makeHttps([this.galleryFull[i]]),
          thumb: makeHttps([this.galleryArray[i]]),
          caption: this.galleryCaptions[i],
          credit: this.galleryCredit[i],
        });
      }
      this.set('gallery', {slides});
    }

    return this;
  },


  // computed
  publishedMoment: computed('authoredOnUtc', function() {
    return moment.utc(this.authoredOnUtc, 'YYYYMMDDHHmmss');
  }),
  modifiedMoment: computed('modifiedOnUtc', function() {
    return moment.utc(this.modifiedOnUtc, 'YYYYMMDDHHmmss');
  }),
  section: computed('categories', function() {
    // HACK: basename for arts & entertainment is wrong
    let section = this.categories[0] || {};
    if (section.basename === 'arts') {
      section.basename = 'arts & entertainment';
    }
    return section;
  }),
  hasMain: computed('tags', function() {
    return this.tags.includes('@main');
  }),
  moveableTypeId: reads('id'),

  breadcrumb: computed('section', function() {
    let breadcrumb = [{
      route: ['sections', this.section.basename],
      label: this.section.label
    }];
    if (this.isSponsored) {
      breadcrumb.push({label: 'Sponsored'});
    }
    if (this.isOpinion) {
      breadcrumb.push({label: 'Opinion'});
    }
    if (this.isAnalysis) {
      breadcrumb.push({label: 'Analysis'});
    }

    // HACK
    if (this.tags.includes('we the commuters')) {
      breadcrumb.push({label: 'We the Commuters'});
    }
    return breadcrumb;
  }),

  authors: computed('authorNickname', function() {
    return [{
      name: this.authorNickname,
      route: ['staff.detail', this.authorNickname],
    }]
  }),

  isSponsored: computed('tags', function() {
    let tags = this.tags || [];
    return tags.includes('@sponsored') || tags.includes('@sponsor');
  }),
  isOpinion: computed('tags', function() {
    let tags = this.tags || [];
    return tags.includes('@opinion');
  }),
  isAnalysis: computed('tags', function() {
    let tags = this.tags || [];
    return tags.includes('@analysis');
  }),

  hasLead:          or('leadImage', 'hasGallery'),

  leadImage:        reads('_parsedLegacyContent.leadImage'),
  leadImageCaption: reads('_parsedLegacyContent.caption'),
  leadImageCredit:  reads('_parsedLegacyContent.credit'),

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.match(/^@/));
  }),
  internalTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags
      .filter(tag => tag.match(/^@/))
      .map(tag => tag.replace(/^@/,''));
  }),
  adBindings: computed(function() {
    return ['internalTags:tags','section.basename:Category'];
  }),

  get body() {
    if (typeof FastBoot !== 'undefined') {
      return this.text;
    }
    return cloneNodes(this._parsedLegacyContent.nodes);
  },

  _parsedLegacyContent: computed('text', function() {
    if (typeof FastBoot !== 'undefined') {
      return;
    }

    const parsed = {};

    // in a browser environment, use the native DOM parser to turn text into concrete nodes
    const domFixer = new DomFixer(this.text);

    // do some minor processing

    // get rid of the empty nodes
    domFixer.removeEmptyNodes();

    // links to other domains open in a new window
    domFixer.externalizeAnchors();

    // make sure iframes are https
    domFixer.secureSrc('iframe');

    // make sure images are https
    domFixer.secureSrc('img');

    // fix up the body text too
    // wrap raw text nodes in a paragraph
    domFixer.rescueOrphans();
    // split any paragraphs that contain double line breaks
    domFixer.unbreakParagraphs();

    // make sure blockquotes aren't wrapping raw text
    domFixer.rescueOrphans('blockquote');

    // remove duplicate lead image
    // mutates passed in nodes
    let leadImage = this._extractLeadImage(domFixer.nodes);

    // extract caption and credit
    if (leadImage) {
      let img = leadImage.querySelector('img');
      parsed.leadImage = img ? img.src : '';

      let [, caption, credit] = this._getImageMeta(leadImage);
      parsed.caption = caption ? caption.trim() : 'Image from Gothamist';
      parsed.credit = credit ? credit.trim() : '';
    }

    parsed.nodes = domFixer.nodes;
    return parsed;
  }),

  _extractLeadImage(nodes) {
    if (!nodes.firstElementChild) {
      return;
    }
    // the fist element will contain this MT tag if there's an image
    let imageWrapper = nodes.firstElementChild.querySelector('.mt-enclosure-image');
    if (imageWrapper) {
      if (!imageWrapper.querySelector('img')) {
        // due to broken MT output, this is where the image sometimes ends up
        imageWrapper = nodes.firstElementChild.nextElementSibling;
      }

      // this image will be the same as `thumbnail640`, which is displayed as the lead image
      // remove it from this node collection so it isn't rendered twice
      return imageWrapper.parentNode.removeChild(imageWrapper);
    }
  },

  _getImageMeta(imageWrapper) {
      // caption is the text in the `<i/>` tag
      let text = imageWrapper.querySelector('i');

      if (!text) {
        // no caption or credit
        return [];
      }

      // parse HTML string for caption and credit
      let match = text.innerHTML.match(/^([^(]+)(?:\(([^)]+)\))?/);
      return match || [];
  },

});

function cloneNodes(nodes) {
  const DEEP_COPY = true;
  return nodes.cloneNode(DEEP_COPY);
}
