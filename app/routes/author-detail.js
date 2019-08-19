import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import addCommentCount from '../utils/add-comment-count';


const { hash } = RSVP;
export const COUNT = 12;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),

  titleToken: model => model.name,

  beforeModel() {
    this.header.addRule('author-detail', {
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

  model({ slug }) {
    const QUERY = {
      author_slug: slug,
      limit: COUNT,
    };

    return hash({
      author: this.store.queryRecord('page', {
        html_path: `staff/${slug}`
      }),
      articles: this.store.query('article', QUERY),
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        limit: COUNT,
        author_slug: model.author.slug,
      },
      transition: fade,
    });

    if (this.fastboot.isFastBoot) {
      return;
    } else {
      addCommentCount(model.articles);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  }
});
