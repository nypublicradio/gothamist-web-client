import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import { titleize } from '../helpers/titleize';
import addCommentCount from '../utils/add-comment-count';


const { hash } = RSVP;
export const COUNT = 12;

export default Route.extend({
  fastboot: inject(),
  dataLayer: inject('nypr-metrics/data-layer'),
  header: inject('nypr-o-header'),

  titleToken: model => titleize(model.section),

  beforeModel() {
    this.dataLayer.push({template: 'section'});

    this.header.addRule('sections', {
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

  model({ section }) {
    return hash({
      section,
      title: titleize(section),
      articles: this.store.query('article', {
        index: 'gothamist',
        term: `c|${section}`,
        count: COUNT,
      })
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        index: 'gothamist',
        term: `c|${model.section}`,
        count: COUNT,
        page: 2,
      },
      transition: fade,
    });

    if (this.fastboot.isFastBoot) {
      return;
    } else {
      addCommentCount(model.articles);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  },

  actions: {
    didTransition() {
      this.controllerFor('application').set('mainRouteClasses', 'u-no-spacing')
      return true;
    },
    willTransition(transition) {
      if (transition.to.localName !== 'sections') {
        transition.then(() => {
          this.controllerFor('application').set('mainRouteClasses', null);
        });
      }
      return true;
    }
  }
});
