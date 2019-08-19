import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  keyForRelationship: key => underscore(key),
  keyForAttribute: key => underscore(key),

  normalizeFindRecordResponse(store, Model, payload, ...rest) {
    payload = {
      [this.modelNameFromPayloadKey()]: payload,
    };

    return this._super(store, Model, payload, ...rest);
  },

  normalizeQueryRecordResponse(store, Model, payload) {
    payload = {
      [this.modelNameFromPayloadKey()]: payload,
    };

    return this._super(store, Model, payload);
  },

  extractMeta(store, Model, payload) {
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
