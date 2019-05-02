import Controller from '@ember/controller';
import fade from 'ember-animated/transitions/fade';

import {
  GROUP_SIZE,
  TOTAL_COUNT,
} from '../routes/index';


export default Controller.extend({
  GROUP_SIZE,
  TOTAL_COUNT,

  init() {
    this._super(...arguments);

    // pull off self to allow for test injection
    const { TOTAL_COUNT } = this;

    this.set('riverQuery', {
      index: 'gothamist',
      count: TOTAL_COUNT,
      page: 2,
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
