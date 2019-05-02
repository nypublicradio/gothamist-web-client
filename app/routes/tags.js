import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

import fade from 'ember-animated/transitions/fade';

const { hash } = RSVP;

export const COUNT = 12;
export const titleize = [/(\w)\w+/g, ([f, ...rest]) => `${f.toUpperCase()}${rest.join('')}`];

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: model => model.tag.replace(...titleize),

  beforeModel() {
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
      title: tag.replace(...titleize),
      articles: this.store.query('article', {
        index: 'gothamist',
        term: tag,
        count: COUNT,
      })
    });
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
    });
  }
});
