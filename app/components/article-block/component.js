import moment from 'moment';

import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  timestamp: computed('article', function() {
    let { publishedMoment:pub } = this.article;
    let diff = moment().diff(pub, 'hours');
    if (diff < 24) {
      return `${diff} hours ago`;
    } else {
      return pub.format('MMM D, YYYY h:mm a');
    }
  }),

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
