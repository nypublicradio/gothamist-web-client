import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['q'],

  init() {
    this._super(...arguments);
    this.set('results', []);
  },

  articles: filter('results', function(result) {
    return result.constructor.modelName === 'article';
  }),

  actions: {
    search(q) {
      this.store.query('page', {q}).then(results => this.set('results', results));
    }
  }
});
