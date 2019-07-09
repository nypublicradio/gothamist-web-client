import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: () => 'article',
  keyForAttribute: key => underscore(key),

  normalizeQueryRecordResponse(store, articleClass, payload) {
    // Wagtail returns an array of objects for REST query
    // ember wants a single record in response to `queryRecord` calls
    payload.items = payload.items[0];
    return this._super(...arguments);
  },

  extractMeta(store, articleClass, payload) {
    let meta = {
      total: payload.total_entries,
      count: Array.isArray(payload.items) ? payload.items.length : 1,
    }
    delete payload.meta;
    return meta;
  },
});
