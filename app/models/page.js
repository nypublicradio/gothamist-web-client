import moment from 'moment';

import DS from 'ember-data';

import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

import { extractPath } from '../utils/wagtail-api';

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

  // computeds
  slug: reads('meta.slug'),

  path: computed('meta.html_url', function() {
    if (this.meta) {
      return extractPath(this.meta.html_url);
    }
  }),

  publishedMoment: computed('meta.first_published_at', 'publicationDate', function() {
    if (this.publicationDate && this.publicationDate.isValid()) {
      return this.publicationDate;
    } else {
      return moment.tz(this.meta.first_published_at, moment.defaultZone.name);
    }
  }),

  updatedMoment: computed('updated_date', 'updateDate', function() {
    if (this.updateDate && this.updateDate.isValid()) {
      return this.updateDate;
    } else {
      return moment.tz(this.updated_date, moment.defaultZone.name);
    }
  }),

  uuid: DS.attr('string'),

});
