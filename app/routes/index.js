import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

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
    return hash({
      main: this.store.query('article', {
        index: 'gothamist',
        term: '@main',
        count: 4
      }),
      sponsored: this.store.query('article', {
        index: 'gothamist',
        term: '@sponsored',
        count: 1
      }),
      river: this.store.query('article', {
        index: 'gothamist',
        count: 28
      }),
    }).then(results => {
      results.river = results.river.filter(article => !results.main.includes(article));
      return results;
    });
  },

  afterModel() {
    this.controllerFor('application').setProperties({
      headerLandmark: null,
    });
  }
});
