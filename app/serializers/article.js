import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  attrs: {
    thumbnail640: 'thumbnail_640',
    thumbnail105: 'thumbnail_105',
    thumbnail300: 'thumbnail_300',
  },
  modelNameFromPayloadKey: () => 'article',
  keyForAttribute: key => underscore(key),

  normalizeQueryRecordResponse(store, articleClass, payload) {
    // GothTopics always returns an array of entries
    // ember wants a single record in response to `queryRecord` calls
    payload.entries = payload.entries[0];
    return this._super(...arguments);
  },

  extractMeta(store, articleClass, payload) {
    let meta = {
      total: payload.total_entries,
      count: payload.listed_entries,
    }
    delete payload.total_entries;
    delete payload.listed_entries;
    return meta;
  },
});
