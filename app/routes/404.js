import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { schedule } from '@ember/runloop';

import addCommentCount from '../utils/add-comment-count';

export const COUNT = 4;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: '404 Error',

  model() {
    this.header.addRule('404', {
      all: {
        nav: true,
        search: true,
        donate: true,
      }
    });

    this.dataLayer.push({template: '404'});

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
  },

  actions: {
    didTransition() {
      schedule('afterRender', () => this.dataLayer.send404());
    }
  }
});
