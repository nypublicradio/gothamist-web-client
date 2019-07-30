import DS from 'ember-data';
import { filterBy, reads } from '@ember/object/computed';

export default DS.Model.extend({
  productBanners: DS.hasMany('product-banner'),
  topProductBanners: filterBy('productBanners', 'location', 'TOP'),
  topProductBanner: reads('topProductBanners.firstObject'),
});
