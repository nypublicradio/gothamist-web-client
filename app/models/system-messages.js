import DS from 'ember-data';
import {
  fragmentArray,
} from 'ember-data-model-fragments/attributes';

export default DS.Model.extend({
  productBanners: fragmentArray('product-banner')
});
