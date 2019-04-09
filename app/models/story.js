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

  parsed: computed('text', function() {
    if (typeof FastBoot === 'undefined') {
      let parsed = {};
      let text = this.text;
      let nodes =  document.createRange().createContextualFragment(text);

      let caption = nodes.querySelector('.image-none i');
      if (caption) {
        let match = caption.textContent.match(/^([^(]+)\(([^)]+)\)$/);
        if (match) {
          parsed.caption = match[1];
          parsed.credit = match[2];
        }
      }

      return parsed;
    }
  }),

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.match(/^@/));
  }),

  leadImageCaption: reads('parsed.caption'),
  leadImageCredit: reads('parsed.credit'),
});
