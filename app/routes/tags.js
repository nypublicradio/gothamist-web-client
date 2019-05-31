import DS from 'ember-data';
import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import config from '../config/environment';
import { titleize } from '../helpers/titleize';
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

  titleToken: model => titleize(model.tag),

  beforeModel() {
    this.dataLayer.push({template: 'tag'});

    this.header.addRule('tags', {
      all: {
        nav: true,
        donate: true,
        search: true,
      },
    });
  },

  model({ tag }) {
    return hash({
      tag,
      title: titleize(tag),
      articles: this.store.query('article', {
        index: 'gothamist',
        term: tag,
        count: COUNT,
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
        index: 'gothamist',
        term: model.tag,
        count: COUNT,
        page: 2,
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
