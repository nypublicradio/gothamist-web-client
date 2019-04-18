import DS from 'ember-data';
import { makeHttps } from '../helpers/make-https';

export default DS.RESTSerializer.extend({
  normalizeFindRecordResponse(store, galleryClass, payload, id) {
    let slides = [];
    let gallery = {
      type: 'gallery',
      id,
      attributes: {
        slides
      }
    };
    payload.gallery.items.forEach(item => {
      slides.push({
        src: makeHttps([item.img_square]),
        full: makeHttps([item.img_full]),
        caption: item.caption,
        credit: item.photographer,
      });
    });
    return {data: gallery};
  }
});
