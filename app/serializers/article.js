import { dasherize } from '@ember/string';

import ApplicationSerializer from './application';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'article',

  normalize(ArticleClass, payload) {
    // the server defines this as an array
    // but it'll always be a single POJO
    // pull out the first index for easier reference in the app
    payload.lead_asset = payload.lead_asset ? payload.lead_asset[0] : null;

    payload.body.forEach(block => block.type = dasherize(block.type));

    return this._super(ArticleClass, payload);
  },

  normalizeQueryRecordResponse(store, ArticleClass, payload) {
    payload = {
      article: payload,
    };
    return this._super(store, ArticleClass, payload);
  },

  extractMeta(store, articleClass, payload) {
    if (!payload.meta) {
      return;
    }
    let meta = {
      total: payload.meta.total_count,
      count: Array.isArray(payload.items) ? payload.items.length : 1,
    }
    delete payload.meta;
    return meta;
  },
});
