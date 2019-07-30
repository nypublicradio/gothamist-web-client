import moment from 'moment';

import DS from 'ember-data';

import { computed } from '@ember/object';

export default DS.Model.extend({
  meta: DS.attr(),

  listingImage:   DS.attr(),
  listingSummary: DS.attr('string'),
  listingTitle:   DS.attr('string'),

  socialImage: DS.attr(),
  socialText:  DS.attr('string'),
  socialTitle: DS.attr('string'),

  showOnIndexListing: DS.attr('boolean'),

  title: DS.attr('string', {defaultValue: ''}),

  // computed
  path: computed('meta.html_url', function() {
    if (typeof this.meta.html_url === 'string') {
      return this.meta.html_url.replace(/https?:\/\/[^/]+\//, '');
    }
  }),

  publishedMoment: computed('meta.first_published_at', 'publicationDate', function() {
    if (this.publicationDate && this.publicationDate.isValid()) {
      return this.publicationDate;
    } else {
      return moment.tz(this.meta.first_published_at, moment.defaultZone.name);
    }
  }),

});
