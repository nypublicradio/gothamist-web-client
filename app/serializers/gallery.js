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
        full: makeHttps([item.img_web_gallery]),
        width: item.img_web_width,
        height: item.img_web_height,
        caption: item.caption,
        credit: payload.gallery.photographer,
      });
    });
    return {data: gallery};
  }
});
