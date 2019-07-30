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

});
