import DS from 'ember-data';
import MF from 'ember-data-model-fragments';
import config from '../config/environment';
import { computed } from '@ember/object';
const { attr } = DS;

export default MF.Fragment.extend({
  guid: attr('string'),
  title: attr('string'),
  description: attr('string'),
  buttonText: attr('string'),
  buttonLink: attr('string'),
  frequency: attr('number'),
  location: attr('string'),
  cookieId: computed('guid', function() {
    return `${config.productBannerCookiePrefix}${this.guid}`;
  })
});
