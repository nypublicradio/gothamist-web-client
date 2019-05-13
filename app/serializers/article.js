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

  // extractRelationships(articleClass, hash) {
  //   let attrs = this._super(...arguments);
  //   if (!hash.has_gallery) {
  //     return attrs;
  //   }
  //
  //   let gallery = {
  //     type: 'gallery',
  //   };
  //   let relationships = {
  //     gallery: {
  //       data: gallery,
  //     },
  //   };
  //
  //   if (hash.gallery_dropbox) {
  //     gallery.id = hash.entrytopics[0];
  //   } else {
  //     let slides = [];
  //
  //     gallery.id = `${hash.id}-gallery`;
  //     gallery.attributes = {
  //       slides,
  //     };
  //
  //     for (let i = 0; i < hash.gallery_full.length; i++) {
  //       slides.push({
  //         src: hash.gallery_array[i],
  //         caption: hash.gallery_captions[i],
  //         full: hash.gallery_full[i],
  //         credit: hash.gallery_credit[i],
  //       })
  //     }
  //
  //     this.store.push({data: gallery});
  //
  //     delete gallery.attributes;
  //   }
  //
  //   return relationships;
  // }
});
