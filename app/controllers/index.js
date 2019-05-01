import Controller from '@ember/controller';
import fade from 'ember-animated/transitions/fade';

import {
  GROUP_SIZE,
  TOTAL_COUNT,
} from '../routes/index';


export default Controller.extend({
  GROUP_SIZE,
  TOTAL_COUNT,
  page: 1,

  init() {
    this._super(...arguments);
    this.set('moreArticles', []);
  },

  transition: fade,

  getMoreStories() {
    // pull off self to allow for test injection
    const { GROUP_SIZE, TOTAL_COUNT } = this;

    this.store.query('article', {
      index: 'gothamist',
      count: TOTAL_COUNT,
      page: this.incrementProperty('page'),
    }).then(results => {
      results = results.filter(a => !this.model.main.includes(a));

      for (let i = 0; i < results.length; i += GROUP_SIZE) {
        this.moreArticles.pushObject(results.slice(i, i + GROUP_SIZE));
      }
    });
  },
});
