import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: () => 'article',
  keyForAttribute: key => underscore(key),

  normalize() {
    let data = this._super(...arguments);

    // the server defines this as an array
    // but it'll always be a single POJO
    // pull out the first index for easier reference in the app
    data.lead_asset = data.lead_asset ? data.lead_asset[0] : null;

    return data;
  },

  normalizeQueryRecordResponse(store, articleClass, payload) {
    // Wagtail returns an array of objects for REST query
    // ember wants a single record in response to `queryRecord` calls
    payload.items = payload.items[0];
    return this._super(...arguments);
  },

  extractMeta(store, articleClass, payload) {
    let meta = {
      total: payload.meta.total_count,
      count: Array.isArray(payload.items) ? payload.items.length : 1,
    }
    delete payload.meta;
    return meta;
  },
});
