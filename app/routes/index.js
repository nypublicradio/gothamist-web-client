import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('story', {
      index: 'gothamist',
      term: '@main',
      count: 3
    });
  },

  afterModel() {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: false,
      headline: null,
      showLeaderboard: true,
    });
  }
});
