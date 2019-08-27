import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';


export const COUNT = 12;

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
    this.set('q', q);
    const QUERY = {
      q,
      limit: COUNT,
    };
    let results = yield this.store.query('page', QUERY);

    this.setProperties({
      results,
      QUERY,
    });
  }).drop(),

  // prevents UI jumping between searches
  resultsStyle: computed('search.{isIdle}', function() {
    return htmlSafe(`opacity: ${this.search.isIdle ? '1' : '0'}`);
  })
});
