import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

const { hash } = RSVP;

export const COUNT = 12;

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: 'Popular',

  beforeModel() {
    this.header.addRule('popular', {
      all: {
        nav: true,
        search: true,
        donate: true,
      }
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

  setupController(controller) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        index: 'gothamist',
        sort: 'socialtopics_score_1d',
        count: COUNT,
        page: 2,
      },
      transition: fade
    })
  },

  renderTemplate(controller, model) {
    this.render('tags', {
      controller,
      model,
    });
  }
});
