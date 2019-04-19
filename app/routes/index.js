import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  header: inject('nypr-o-header'),
  headData: inject(),

  titleToken: 'Homepage',

  beforeModel() {
    this.header.addRule('index', {
      resting: {
        nav: true,
        leaderboard: true,
        donate: true,
        search: true,
      },
      floating: {
        nav: true,
        donate: true,
        search: true,
      }
    });

    this.headData.setProperties({
      metaDescription: 'A website about New York',
      ogType: 'website',
    });
  },

  model() {
    return this.store.query('article', {
      index: 'gothamist',
      term: '@main',
      count: 3
    });
  },

  afterModel() {
    this.controllerFor('application').setProperties({
      headerLandmark: null,
    });
  }
});
