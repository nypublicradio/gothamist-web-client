import ApplicationSerializer from './application';
import DS from 'ember-data';
import { camelize } from '@ember/string';

const normalizeProductBanner = function(banner) {
  return {
    id: banner.id,
    type: 'product-banner',
    // move 'values' to 'attributes' and camelize keys
    attributes: {...Object.fromEntries(
      Object.entries(banner.value).map(([k, v]) => [camelize(k), v])
    )}
  }
};

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    productBanners: { embedded: 'always' }
  },
  modelNameFromPayloadKey: () => 'system-messages',
  normalizeFindRecordResponse(store, primaryModelClass, payload, id) {
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
      included: payload.product_banners.map(normalizeProductBanner)
    };
  }
});
