import DS from 'ember-data';
import moment from 'moment';
import { inject as service } from '@ember/service';
import { filterBy, reads } from '@ember/object/computed';

export default DS.Model.extend({
  cookies: service(),
  productBanners: DS.hasMany('product-banner'),
  topProductBanners: filterBy('productBanners', 'location', 'TOP'),
  topProductBanner: reads('topProductBanners.firstObject'),
  hideBanner(banner) {
    let expires = moment().add(banner.frequency, 'hours').toDate();
    this.cookies.write(banner.cookieId, 1, {expires, path: '/'});
    banner.set('isDismissed', true);
  }
});
