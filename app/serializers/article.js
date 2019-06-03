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

  normalizeResponse() {
    let response = this._super(...arguments);

    if (Array.isArray(response.data)) {
      response.data.forEach(data => stripTwitterEmbeds(data.attributes));
    } else if (typeof response.data === 'object') {
      stripTwitterEmbeds(response.data.attributes);
    }

    return response;
  },

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

const TWITTER_SCRIPT_REGEX = /<script[^>]*(?=src="[^"]*twitter[^"]*")[^>]*><\/script>/g
function stripTwitterEmbeds(attrs) {
  attrs.text = attrs.text.replace(TWITTER_SCRIPT_REGEX, '');
}
