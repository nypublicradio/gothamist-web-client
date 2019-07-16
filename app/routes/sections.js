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
    return  this.store.queryRecord('page', {
      html_path: section,
    }).then(section => {
      return hash({
        section,
        title: section.title,
        articles: this.store.query('article', {
          descendant_of: section.id,
          show_on_index_listing: true,
          limit: COUNT,
        })
      });
    })
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        descendant_of: model.section.id,
        show_on_index_listing: true,
        limit: COUNT,
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
