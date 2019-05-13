import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

import addCommentCount from '../../utils/add-comment-count';


const { hash } = RSVP;
export const COUNT = 12;

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),

  titleToken: model => model.name,

  beforeModel() {
    this.header.addRule('staff.detail', {
      all: {
        nav: true,
        donate: true,
        search: true,
      }
    });
  },

  model({ name }) {
    return hash({
      name,
      articles: this.store.query('article', {
        index: 'gothamist',
        term: `a|${name}`,
        count: COUNT,
      })
    })
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.setProperties({
      query: {
        index: 'gothamist',
        term: model.name,
        count: COUNT,
        page: 2,
      },
      transition: fade,
    });

    if (this.fastboot.isFastBoot) {
      return;
    } else {
      addCommentCount(model.articlees);

      controller.set('addComments', results => (addCommentCount(results), results));
    }
  }
});
