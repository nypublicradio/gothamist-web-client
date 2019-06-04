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
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: 'Popular',

  beforeModel() {
    this.dataLayer.push({template: 'dimension'});

    this.header.addRule('popular', {
      all: {
        nav: true,
        search: true,
        donate: true,
      },
      resting: {
        leaderboard: true,
      },
    });
  },

  model() {
    // return a hash so it can render into `tags.hbs`
    return hash({
      articles: this.store.query('article', {
        index: 'gothamist',
        sort: 'socialtopics_score_1d',
        count: COUNT,
      }),
      title: 'Popular',
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        index: 'gothamist',
        sort: 'socialtopics_score_1d',
        count: COUNT,
        page: 2,
      },
      transition: fade
    });

    if (this.fastboot.isFastBoot) {
      return;
    } else {
      addCommentCount(model.articles);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  },

  renderTemplate(controller, model) {
    this.render('tags', {
      controller,
      model,
    });
  }
});
