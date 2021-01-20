import DS from 'ember-data';
import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import config from '../config/environment';
import addCommentCount from '../utils/add-comment-count';


const sanitize = tag => tag
  .replace(/%20|\W/g, '')
  .toLowerCase();

const { hash } = RSVP;
export const COUNT = 12;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: model => model.tag.replace(/-/g, ' '),

  beforeModel() {
    this.dataLayer.push({template: 'tag'});

    this.header.addRule('tags', {
      all: {
        nav: true,
        donate: true,
        search: true,
      },
      resting: {
        leaderboard: true,
      },
    });
  },

  model({ tag }) {
    return hash({
      tag,
      title: tag.replace(/-/g, ' '),
      page: this.store.queryRecord('tag', {
        html_path: `tags/${tag}`
      }),
      articles: this.store.query('article', {
        tag_slug: tag,
        limit: COUNT,
      }),
      // HACK
      isWTC: sanitize(tag) === 'wethecommuters',
    }).then(results => {
      if (results.articles.length === 0) {
        let e = new DS.NotFoundError();
        e.url = `tags/${results.tag}`;
        throw e;
      }
      return results;
    })
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.setProperties({
      query: {
        tag_slug: model.tag,
        limit: COUNT,
      },
      transition: fade,
      wtcEndpoint: `${config.apiServer}/opt-in/v1/subscribe/mailchimp`,
      wtcParams: {list: config.wtcNewsletter},
    });

    if (this.fastboot.isFastBoot) {
      return;
    } else {
      addCommentCount(model.articles);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  }
});
