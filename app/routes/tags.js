import DS from 'ember-data';
import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import config from '../config/environment';
import addCommentCount from '../utils/add-comment-count';

const getArticlesfromStreamfield = function(streamfield) {
  return streamfield.reduce((articles, block) => {
    if (block.type === 'content-collection') {
      return articles.concat(block.relatedArticles.slice(0));
    } else {
      return articles
    }
  }, [])
}

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
        // eslint-disable-next-line no-unused-vars
      }).catch(error => { return }),
      articles: this.store.query('article', {
        tag_slug: tag,
        limit: COUNT,
      }),
      // HACK
      isWTC: sanitize(tag) === 'wethecommuters',
    }).then(results => {

      if (results.page) {
        let topFeaturedArticles = results.page.hasTopPageZone ? getArticlesfromStreamfield(results.page.topPageZone) : [];
        let midFeaturedArticles = results.page.hasMidpageZone ? getArticlesfromStreamfield(results.page.midpageZone) : [];
        results.featuredArticles = topFeaturedArticles.concat(midFeaturedArticles)
      } else {
        results.featuredArticles = []
      }

      // remove featured articles from the main list of articles
      results.meta = results.articles.meta
      results.articles = results.articles.filter((article) => {
        return !results.featuredArticles.map(a => a.id).includes(article.id)
      });


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
      addCommentCount(model.featuredArticles);
      addCommentCount(model.articles);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  },

  actions: {
    didTransition() {
      this.controllerFor('application').set('mainRouteClasses', 'tags-page')
      return true;
    }
  }
});
