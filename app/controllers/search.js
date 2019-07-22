import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  queryParams: ['q'],

  init() {
    this._super(...arguments);
    this.set('results', []);
  },

  articles: filter('results', function(result) {
    return result.constructor.modelName === 'article';
  }),

  search: task(function *(q) {
    let results = yield this.store.query('page', {q});

    this.set('results', results);
  }),
});
