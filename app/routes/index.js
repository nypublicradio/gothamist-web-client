import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),

  titleToken: 'Homepage',

  beforeModel() {
    this.headData.setProperties({
      metaDescription: 'A website about New York',
    });
  },

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
      headerLandmark: null,
    });
  }
});
