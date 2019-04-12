import DS from 'ember-data';
import { computed } from '@ember/object';
import { dasherize } from '@ember/string';
import { reads } from '@ember/object/computed';

export default DS.Model.extend({
  allowComments: DS.attr('boolean'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  authorNickname: DS.attr('string'), // display name
  authoredOn: DS.attr('string'),
  authoredOnUtc: DS.attr('string'),
  blodId: DS.attr('number'),
  categories: DS.attr(),
  commentCount: DS.attr('number'),
  entrytopics: DS.attr(),
  excerpt: DS.attr('string'),
  excerptFull: DS.attr('string'),
  excerptPretty: DS.attr('string'),
  excerptSponsor: DS.attr('string'),
  hasGallery: DS.attr('boolean'),
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
  title: DS.attr('string'),

  // computed
  moveableTypeId: reads('id'),

  breadcrumb: computed('categories', function() {
    let categories = this.categories || [];
    return categories.map(c => ({
      label: c.label,
      url: `tags/${c.basename}`,
    }));
  }),

  authors: computed('authorNickname', function() {
    return [{
      name: this.authorNickname,
      url: `/staff/${dasherize(this.authorNickname)}`,
    }]
  }),

  isSponsored: computed('tags', function() {
    let tags = this.tags || [];
    return tags.includes('@sponsored');
  }),

  leadImageCaption: reads('_parsedLegacyContent.caption'),
  leadImageCredit: reads('_parsedLegacyContent.credit'),

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.match(/^@/));
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
    const range = document.createRange();
    parsed.nodes = range.createContextualFragment(this.text);

    // do some minor processing

    // make sure images are https
    parsed.nodes = this._makeImagesSecure(parsed.nodes);

    // remove duplicate lead image
    // mutates parsed.nodes
    let leadImage = this._extractLeadImage(parsed.nodes);

    // extract caption and credit
    if (leadImage) {
      let [, caption, credit] = this._getImageMeta(leadImage);
      parsed.caption = caption
      parsed.credit = credit;
    }

    return parsed;
  }),

  _extractLeadImage(nodes) {
    // the fist element will contain this MT tag if there's an image
    if (nodes.firstElementChild && nodes.firstElementChild.querySelector('.mt-enclosure-image')) {
      // due to broken MT output, this is where the image ends up
      let actualImageWrapper = nodes.firstElementChild.nextElementSibling;

      // this image will be the same as `thumbnail640`, which is displayed as the lead image
      // remove it from this node collection so it isn't rendered twice
      return actualImageWrapper.parentNode.removeChild(actualImageWrapper);
    }
  },

  _getImageMeta(imageWrapper) {
      // caption is the text in the `<i/>` tag
      let text = imageWrapper.querySelector('i');

      // parse HTML string for caption and credit
      let match = text.innerHTML.match(/^([^(]+)\(([^)]+)\)$/);
      return match || [];
  },

  _makeImagesSecure(nodes) {
    nodes.querySelectorAll('img').forEach(img => {
      img.src = img.src.replace(/^https?:/, '');
    });
    return nodes;
  },

});

function cloneNodes(nodes) {
  const DEEP_COPY = true;
  return nodes.cloneNode(DEEP_COPY);
}
