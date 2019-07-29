import DS from 'ember-data';
import config from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { or }  from '@ember/object/computed';
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
  isCookieSet: computed('cookieId', function() {
    return this.cookies.exists(this.cookieId);
  }),
  isDismissed: attr('boolean'),
  isHidden: or('isCookieSet', 'isDismissed'),
});
