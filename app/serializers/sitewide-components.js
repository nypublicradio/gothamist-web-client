import ApplicationSerializer from './application';
import DS from 'ember-data';
import { blockToJSONAPI } from '../utils/wagtail-api';

 export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    breakingNews: { embedded: 'always' }
  },
  modelNameFromPayloadKey: () => 'sitewide-components',
  normalizeFindRecordResponse(store, primaryModelClass, payload, id) {
  return {
      data: {
        id,
        type: 'sitewide-components',
        relationships: {
          breakingNews: {
            data: payload.breaking_news.map(banner =>
              ({ id: banner.id, type: 'breaking-news' })
            )
          }
        }
      },
      included: payload.breaking_news.map(blockToJSONAPI)
    };
  }
});
