import fetch from 'fetch';
import moment from 'moment';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

import config from '../config/environment';
import addCommentCount from '../utils/add-comment-count';


const BASE_COUNT = 28;
export const MAIN_COUNT = 4;
export const TOTAL_COUNT = BASE_COUNT + MAIN_COUNT;
export const GROUP_SIZE = 7;

export default Route.extend({
  header: inject('nypr-o-header'),
  headData: inject(),
  fastboot: inject(),
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: 'Gothamist: New York City Local News, Food, Arts & Events',

  beforeModel() {
    this.dataLayer.push({template: 'homepage'});

    this.header.addRule('index', {
      all: {
        nav: true,
        donate: true,
        search: true,
        homepage: true,
      },
      resting: {
        leaderboard: true,
        stackLogo: true,
      },
    });

    this.headData.setProperties({
      metaDescription: 'Gothamist is a website about New York City news, arts and events, and food, brought to you by New York Public Radio.',
      ogType: 'website',
    });
  },

  model() {
    return hash({
      sponsored: this.getSponsoredPost(),
      main: this.store.query('article', {
        index: 'gothamist',
        term: '@main',
        count: MAIN_COUNT,
      }),
      river: this.store.query('article', {
        index: 'gothamist',
        count: TOTAL_COUNT,
      }),
      wnyc: getWnycStories(),
    }).then(results => {
      if (!this.fastboot.isFastBoot) {
        addCommentCount(results.river);
        addCommentCount(results.main);
      }

      results.meta = results.river.meta;
      results.river = results.river.filter(article => !results.main.includes(article));
      // remove featured sponsored post from river
      if (results.sponsored) {
        results.river = results.river.filter(article => article !== results.sponsored.firstObject);
      }
      return results;
    });
  },

  // fetch the most recent sponsor post
  // filter it out if it's older than 24 hours
  async getSponsoredPost() {
    let post = await this.store.query('article', {
      index: 'gothamist',
      term: '@sponsor',
      count: 1,
    });

    if (!post.firstObject) {
      return;
    }
    if (moment().diff(post.firstObject.publishedMoment, 'hours') <= 24) {
      return post;
    }
  }
});

async function getWnycStories() {
  let response =  await fetch(`${config.apiServer}/api/v3/buckets/gothamist-wnyc-crossposting/`);
  if (!response.ok) {
    return [];
  }
  let json = await response.json();

  return json.data.attributes['bucket-items'].map(s => s.attributes);
}
