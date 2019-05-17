import Component from '@ember/component';
import { computed } from '@ember/object';

import config from '../../config/environment';

export default Component.extend({
  tagName: '',

  showAuthor: false,
  showTimestamp: true,
  showCommentCount: true,

  commentsAnchor: config.commentsAnchor,

  thumbnail: computed('article', 'thumbnailSize', function() {
    switch(this.thumbnailSize) {
      case '640':
        return this.article.thumbnail640;
      case '105':
        return this.article.thumbnail105;
      default:
        return this.article.thumbnail300;
    }
  })
});
