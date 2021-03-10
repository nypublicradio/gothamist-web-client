import moment from 'moment';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import addCommentCount from '../utils/add-comment-count';


const BASE_COUNT = 28;
export const MAIN_COUNT = 4;
export const TOTAL_COUNT = BASE_COUNT + MAIN_COUNT;
export const GROUP_SIZE = 7;

const { warn } = console;
const failSafe = name => () => warn(`${name} failed to load`);
const LISTING_FIELDS = [
  'ancestry',
  'description',
  'lead_asset',
  'legacy_id',
  'listing_image',
  'publication_date',
  'show_as_feature',
  'sponsored_content',
  'tags',
  'updated_date',
  'url',
  'uuid',
].join(',');

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
      homepage: this.store.queryRecord('homepage', {
        html_path: `/`
      }).catch(failSafe('homepage')),
      main: this.store.query('article', {
        sponsored_content: false,
        show_as_feature: true,
        limit: MAIN_COUNT,
        fields: LISTING_FIELDS,
      }).catch(failSafe('main')),
      river: this.store.query('article', {
        limit: TOTAL_COUNT,
        fields: LISTING_FIELDS,
      }).catch(failSafe('river'))
    }).then((results)=> {

      let featuredArticles = []
      if (results.homepage) {
        featuredArticles = results.homepage.featuredArticles.slice(0);
      }

      results.main = results.main.slice();

      // replace main with featured articles
      if (featuredArticles) {
        results.main.forEach((item, index) => {
          if (featuredArticles[index]) {
            results.main[index] = featuredArticles[index];
          }
        });
      }

      if (!this.fastboot.isFastBoot) {
        addCommentCount(results.main);
        addCommentCount(results.river);
      }
      results.meta = results.river.meta;

      // remove articles in main (the featured content area) from the river
      if (results.sponsoredMain) {
        results.main.replace(MAIN_COUNT - 1, 1, [results.sponsoredMain]);
      }

      results.river = results.river.filter(article => !results.main.includes(article));
      // remove featured sponsored post from river

      if (results.sponsored) {
        results.river = results.river.filter(article => article !== results.sponsored);
      }

      return results;
    });
  },

  // fetch the most recent sponsored content post
  // this is the sponsored content post with an outline
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
  // this is the sponsored content post that appears as the last featured item
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
