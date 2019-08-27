import DS from 'ember-data';
import config from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
const { attr } = DS;

export default DS.Model.extend({
  cookies: service(),
  title: attr('string'),
  description: attr('string'),
  buttonText: attr('string'),
  buttonLink: attr('string'),
  frequency: attr('number'),
  location: attr('string'),
  cookieId: computed('id', function() {
    return `${config.productBannerCookiePrefix}${this.id}`;
  }),
});
