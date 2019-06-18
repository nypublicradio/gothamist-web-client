import DS from 'ember-data';

import { imgixUri } from '../helpers/imgix-uri';

const GOTH_HOST_REGEX = /(https?:\/\/.*gothamist\.com)/;


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
      const RATIO = item.img_web_width / item.img_web_height;
      const RESIZED_WIDTH = 1200;
      let path = item.img_web_gallery.replace(GOTH_HOST_REGEX, '');
      slides.push({
        thumb: imgixUri(path, {w: 106, h: 106, domain: 'platypus'}),
        preview: imgixUri(path, {w: 625, h: 416, q: 90, domain: 'platypus'}),
        full: imgixUri(path, {w: RESIZED_WIDTH, q: 90, domain: 'platypus'}),
        height: (RESIZED_WIDTH / RATIO),
        caption: item.caption,
        credit: payload.gallery.photographer,
        thumbSrcSet: `${imgixUri(path, {w: 106, h: 106, dpr: 1, domain: 'platypus'})} 1x,
        ${imgixUri(path, {w: 106, h: 106, dpr: 2, domain: 'platypus'})} 2x,
        ${imgixUri(path, {w: 106, h: 106, dpr: 3, domain: 'platypus'})} 3x`,
      });
    });
    return {data: gallery};
  }
});
