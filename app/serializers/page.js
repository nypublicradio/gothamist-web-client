import ApplicationSerializer from './application';

import { WAGTAIL_MODEL_TYPE as ARTICLE } from '../models/article';


// making responses p o l y m o r p h i c
// additional models that extend from `Page` can go here
const TYPES = {
  [ARTICLE]: 'article',
  // [PERSON]: 'person',
};

export default ApplicationSerializer.extend({
  // enable polymorphic responses
  // if it's an actual `Page` response coming straight from the server
  // the key will be `items`
  modelNameFromPayloadKey: key => key === 'items' ? 'page' : key,

  normalizeQueryRecordResponse(store, PageModel, payload) {
    payload = {
      [this.modelNameFromPayloadKey()]: payload,
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
