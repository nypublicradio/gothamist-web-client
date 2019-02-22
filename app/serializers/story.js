import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: () => 'story',
  keyForAttribute: key => underscore(key),

  normalizeQueryRecordResponse(store, storyClass, payload) {
    // GothTopics always returns an array of entries
    // ember wants a single record in response to `queryRecord` calls
    payload.entries = payload.entries[0];
    return this._super(...arguments);
  }
});
