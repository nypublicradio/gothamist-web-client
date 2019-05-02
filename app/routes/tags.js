import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

const { hash } = RSVP;

export const COUNT = 30;
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

  model({ tag, page = 1 }) {
    return hash({
      tag: tag.replace(...titleize),
      articles: this.store.query('article', {
        index: 'gothamist',
        term: tag,
        count: COUNT,
        page,
      })
    });
  }
});
