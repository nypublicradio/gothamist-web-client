import ApplicationSerializer from './application';
import DS from 'ember-data';
import { blockToJSONAPI } from '../utils/wagtail-api';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    productBanners: { embedded: 'always' }
  },
  modelNameFromPayloadKey: () => 'system-messages',
  normalizeFindRecordResponse(store, primaryModelClass, payload, id) {
  payload.product_banners = payload.product_banners || [];
  return {
      data: {
        id,
        type: 'system-messages',
        relationships: {
          productBanners: {
            data: payload.product_banners.map(banner =>
              ({ id: banner.id, type: 'product-banner' })
            )
          }
        }
      },
      included: payload.product_banners.map(blockToJSONAPI)
    };
  }
});
