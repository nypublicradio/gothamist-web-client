import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  width: 630,

  height: computed('value.image', function() {
    if (this.value.image) {
      let { height, width } = this.value.image;
      let newHeight = (this.width * height) / width;
      return Math.round(newHeight);
    }
  }),
});
