import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import addCommentCount from '../utils/add-comment-count';

export const COUNT = 4;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: '500 Error',

  beforeModel() {
    this.dataLayer.push({template: '500'});

    this.header.addRule('500', {
      all: {
        nav: true,
        search: true,
        donate: true,
      }
    });
  },

  model() {
    return this.store.query('article', {
      index: 'gothamist',
      sort: 'socialtopics_score_1d',
      count: COUNT,
    })
  },

  afterModel(model) {
    if (!this.fastboot.isFastBoot) {
      addCommentCount(model);
    }
  }
});
