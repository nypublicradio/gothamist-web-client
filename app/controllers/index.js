import Controller from '@ember/controller';
import fade from 'ember-animated/transitions/fade';

import addCommentCount from '../utils/add-comment-count';

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

    let filtered = results.filter(a => !this.model.main.includes(a));

    for (let i = 0; i < results.length; i += GROUP_SIZE) {
      moreArticles.pushObject(filtered.slice(i, i + GROUP_SIZE));
    }

    // this is an async function, but we don't want to `await` it, otherwise it will block rendering
    // pass in `results` because it's a DS.RecordArray as returned from a store query
    addCommentCount(results);

    return moreArticles;
  },
});
