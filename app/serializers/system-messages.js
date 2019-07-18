import DS from 'ember-data';
import { camelize, underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: () => 'system-messages',
  keyForAttribute(attr) {
    return underscore(attr);
  },
  normalizeFindRecordResponse(store, galleryClass, payload, id) {
    let banners = payload.product_banners.map(original => {
      let banner = {
        guid: original.id
      }
      Object.keys(original.value).forEach(key => {
        banner[camelize(key)] = original.value[key];
      });
      return banner;
    });
    let data = {
      id,
      type: 'system_messages',
      attributes: {
        productBanners: banners
      }
    }
    return {data};
  },
});
