import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  imageWidth: 80,

  imageTemplate: computed('story', function() {
    let image = this.story && this.story['image-main'];
    if (image) {
      return image.template;
    }
  }),
  thumbnail: computed('imageTemplate', function() {
    if (!this.imageTemplate) {
      return;
    }
    let x = this.imageWidth || 0;
    let y = this.imageHeight || 0;
    let crop = 'c';
    let quality = '80';

    function replaceFn(originalString, base, path) {
      return `${base}/${x}/${y}/${crop}/${quality}/${path}`;
    }

    return this.imageTemplate.replace(/(.*\/i)\/%s\/%s\/%s\/%s\/(.*)/, replaceFn);
  }),
});
