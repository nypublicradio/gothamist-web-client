import fetch from 'fetch';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

import config from '../config/environment';


const BASE_COUNT = 28;
export const MAIN_COUNT = 4;
export const TOTAL_COUNT = BASE_COUNT + MAIN_COUNT;
export const GROUP_SIZE = 7;

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
        count: MAIN_COUNT,
      }),
      sponsored: this.store.queryRecord('article', {
        index: 'gothamist',
        term: '@sponsored',
      }),
      river: this.store.query('article', {
        index: 'gothamist',
        count: TOTAL_COUNT,
      }),
      wnyc: getWnycStories(),
    }).then(results => {
      results.river = results.river.filter(article => !results.main.includes(article));
      return results;
    });
  },

  afterModel() {
    this.controllerFor('application').setProperties({
      headerLandmark: null,
    });
  },
});

async function getWnycStories() {
  let response =  await fetch(`${config.apiServer}/api/v3/buckets/gothamist-wnyc-crossposting/`);
  let json = await response.json();

  return json.data.attributes['bucket-items'].map(s => s.attributes);
}
