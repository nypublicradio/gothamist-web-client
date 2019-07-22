import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['q'],

  init() {
    this._super(...arguments);
    this.set('results', []);
  },

  actions: {
    search(q) {
      this.store.query('page', {q}).then(results => this.set('results', results));
    }
  }
});
