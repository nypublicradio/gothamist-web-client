import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  nodes: computed('value', function() {
    if (typeof FastBoot === 'undefined') {
      const range = document.createRange();
      return range.createContextualFragment(this.value.code);
    } else {
      return this.value.code;
    }
  })
});
