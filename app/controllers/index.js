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
    // pull off self to allow for test injection
    const { TOTAL_COUNT, page } = this;

    this._super(...arguments);
    this.set('riverQuery', {
      index: 'gothamist',
      count: TOTAL_COUNT,
      page,
    })
  },

  transition: fade,

  riverCallback(results) {
    const moreArticles = [];
    const { GROUP_SIZE } = this;

    results = results.filter(a => !this.model.main.includes(a));

    for (let i = 0; i < results.length; i += GROUP_SIZE) {
      moreArticles.pushObject(results.slice(i, i + GROUP_SIZE));
    }

    return moreArticles;
  },
});
