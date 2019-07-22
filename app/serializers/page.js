import ApplicationSerializer from './application';

import { WAGTAIL_MODEL_TYPE as ARTICLE } from '../models/article';


const TYPES = {
  [ARTICLE]: 'article',
  // [PERSON]: 'person',
};

export default ApplicationSerializer.extend({
  // enable polymorphic responses
  modelNameFromPayloadKey: key => key === 'items' ? 'page' : key,

  normalizeQueryRecordResponse(store, PageModel, payload) {
    payload = {
      page: payload,
    };

    return this._super(store, PageModel, payload);
  },

  normalizeQueryResponse(store, PageModel, payload, id, requestType) {
    payload.items = payload.items.map(({ result }) => {
      return {
        type: TYPES[result.meta.type], // enable polymorphic responses
        ...result,
      };
    })
    return this._super(store, PageModel, payload, id, requestType);
  }
});
