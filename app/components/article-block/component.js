import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  thumbnail: computed('article', 'thumbnailSize', function() {
    switch(this.thumbnailSize) {
      case '640':
        return this.article.thumbnail640;
      case '105':
        return this.article.thumbnail105;
    }
  })
});
