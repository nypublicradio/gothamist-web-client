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


  get parsedLegacyContent() {
    let text = this.text;
    let parsed = {};

    if (typeof FastBoot === 'undefined') {
      // in a browser environment, use the native DOM parser to generate concrete nodes
      const range = document.createRange();
      parsed.nodes = range.createContextualFragment(text);

      // do some minor processing

      // look for a caption
      // the fist element will contain this MT tag if there's an image
      if (parsed.nodes.firstElementChild && parsed.nodes.firstElementChild.querySelector('.mt-enclosure-image')) {
        // due to broken MT output, this is where the image ends up
        let actualImageWrapper = parsed.nodes.firstElementChild.nextElementSibling;
        // this image will be the same as `thumbnail640`, which is displayed as the lead image
        // remove it from this node collection so it isn't rendered twice
        actualImageWrapper.remove()

        // caption is the text in the `<i/>` tag
        let caption = actualImageWrapper.querySelector('i');


        // parse HTML string for caption and credit
        let match = caption.innerHTML.match(/^([^(]+)\(([^)]+)\)$/);
        if (match) {
          parsed.caption = match[1];
          parsed.credit = match[2];
        }
      }
    } else {
      parsed.nodes = text;
    }
    return parsed;
  },

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.match(/^@/));
  }),

  leadImageCaption: reads('parsedLegacyContent.caption'),
  leadImageCredit: reads('parsedLegacyContent.credit'),
});
