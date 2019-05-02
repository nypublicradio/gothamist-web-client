import moment from 'moment';

import Component from '@ember/component';
import { computed } from '@ember/object';

export const JUST_NOW = 'Just now';
export const RECENT = 'Less than one hour ago';
export const TIMESTAMP_FORMAT = 'MMM D, YYYY h:mm a';

export default Component.extend({
  tagName: '',

  timestamp: computed('article', function() {
    let { publishedMoment:pub } = this.article;
    let now = moment();
    let minutes = now.diff(pub, 'minutes')
    let hours = now.diff(pub, 'hours');
    if (minutes <= 5) {
      return JUST_NOW;
    } else if (minutes > 5 && hours < 1) {
      return RECENT;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return pub.format(TIMESTAMP_FORMAT);
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
