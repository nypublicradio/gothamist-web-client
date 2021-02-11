import ApplicationSerializer from './application';

import { WAGTAIL_MODEL_TYPE as ARTICLE } from '../models/article';
import { WAGTAIL_MODEL_TYPE as GALLERY } from '../models/gallery';
import { WAGTAIL_MODEL_TYPE as TAG } from '../models/tag';
import { WAGTAIL_MODEL_TYPE as INFORMATION_PAGE } from '../models/information';


// making responses p o l y m o r p h i c
// additional models that extend from `Page` can go here
const TYPES = {
  [ARTICLE]: 'article',
  [GALLERY]: 'gallery',
  [TAG]: 'tag',
  [INFORMATION_PAGE]: 'information',
  // [PERSON]: 'person',
};

export default ApplicationSerializer.extend({
  // enable polymorphic responses
  // if it's an actual `Page` response coming straight from the server
  // the key will be `items`
  // `'page'` is the default because it's the polymorphic base model
  modelNameFromPayloadKey: (key = 'page') => {return key === 'items' ? 'page' : key},

  normalizeQueryResponse(store, PageModel, payload, id, requestType) {
    payload.items = payload.items.map(({ result }) => {
      return {
        type: TYPES[result.meta.type], // enable polymorphic responses
        ...result,
      };
    })
    return this._super(store, PageModel, payload, id, requestType);
  },

  normalizeQueryRecordResponse(store, PageModel, payload, ...rest) {
    // some responses, like previews for unsaved pages don't
    // have an id, but Ember Data needs an id to work.
    if (payload.id === null) {
      payload.id = 0;
    }
    payload.type = TYPES[payload.meta.type];
    return this._super(store, PageModel, payload, ...rest);
  }
});
