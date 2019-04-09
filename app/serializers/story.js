import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  attrs: {
    thumbnail640: 'thumbnail_640',
  },
  modelNameFromPayloadKey: () => 'story',
  keyForAttribute: key => underscore(key),

  normalizeQueryRecordResponse(store, storyClass, payload) {
    // GothTopics always returns an array of entries
    // ember wants a single record in response to `queryRecord` calls
    payload.entries = payload.entries[0];
    return this._super(...arguments);
  },

  extractMeta(store, storyClass, payload) {
    return {
      total: payload.total_entries,
      count: payload.listed_entries,
    }
  }
});
