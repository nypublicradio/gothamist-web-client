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

const { warn } = console;
const failSafe = name => () => warn(`${name} failed to load`);

export default Route.extend({
  header: inject('nypr-o-header'),
  headData: inject(),
  fastboot: inject(),
  dataLayer: inject('nypr-metrics/data-layer'),

  title: () => 'Gothamist: New York City Local News, Food, Arts & Events',

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
      sponsored: this.getSponsoredPost().catch(failSafe('sponsored')),
      sponsoredMain: this.getSponsoredMain().catch(failSafe('sponsoredMain')),
      main: this.store.query('article', {
        show_as_feature: true,
        limit: MAIN_COUNT,
      }).catch(failSafe('main')),
      river: this.store.query('article', {
        limit: TOTAL_COUNT,
      }).catch(failSafe('river')),
      systemMessages: this.store.findRecord('system-messages', config.siteId).catch(() => ''),
      sitewideComponents: this.store.findRecord('sitewide-components', config.siteId).catch(() => ''),
      wnyc: getWnycStories(),
    }).then(results => {
      results.main = results.main.slice();
      if (!this.fastboot.isFastBoot) {
        addCommentCount(results.river);
        addCommentCount(results.main);
      }

      results.meta = results.river.meta;
      results.river = results.river.filter(article => !results.main.includes(article));
      // remove featured sponsored post from river
      if (results.sponsored) {
        results.river = results.river.filter(article => article !== results.sponsored);
      }
      // splice in sponsored main to main stories set
      if (results.sponsoredMain) {
        results.main.replace(MAIN_COUNT - 1, 1, [results.sponsoredMain]);
      }
      return results;
    });
  },

  // fetch the most recent sponsor post
  // filter it out if it's older than 24 hours
  async getSponsoredPost() {
    let { firstObject:post } = await this.store.query('article', {
      sponsored_content: true,
      limit: 1,
    });

    if (!post) {
      return;
    }
    if (moment().diff(post.publishedMoment, 'hours') <= 24) {
      return post;
    }
  },

  // fetch the most recent sponsored *main* post
  // filter if it's not between 24 and 48 hours old
  async getSponsoredMain() {
    let { firstObject:post } = await this.store.query('article', {
      sponsored_content: true,
      show_as_feature: true,
      limit: 1,
    });

    if (!post) {
      return;
    }
    const ageInHours = moment().diff(post.publishedMoment, 'hours');
    if (ageInHours >= 24 && ageInHours <= 48) {
      return post;
    }
  },
});

async function getWnycStories() {
  let response =  await fetch(`${config.apiServer}/api/v3/buckets/gothamist-wnyc-crossposting/`);
  if (!response.ok) {
    return [];
  }
  let json = await response.json();

  return json.data.attributes['bucket-items'].map(s => s.attributes);
}
