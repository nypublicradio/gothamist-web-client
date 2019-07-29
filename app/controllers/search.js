import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';

export default Controller.extend({
  queryParams: ['q'],

  init() {
    this._super(...arguments);
    this.set('results', []);
  },

  // enable listing of different types found in the search
  articles: filter('results', function(result) {
    return result.constructor.modelName === 'article';
  }),

  // for the FUTURE
  // people: filter('results', function(result) {
  //   return result.constructor.modelName === 'person';
  // }),

  search: task(function *(q) {
    let results = yield this.store.query('page', {q});

    this.set('results', results);
  }),

  // prevents UI jumping between searches
  resultsStyle: computed('search.{isIdle}', function() {
    return htmlSafe(`opacity: ${this.search.isIdle ? '1' : '0'}`);
  })
});
