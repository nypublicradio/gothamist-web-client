import RSVP from 'rsvp';

import Route from '@ember/routing/route';
import { classify } from '@ember/string';
import { inject } from '@ember/service';

const { hash } = RSVP;

const titleize = ([f, ...rest]) => `${f.toUpperCase()}${rest.join('')}`;

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: model => classify(model.tag),

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
      tag: tag.replace(/(\w)\w+/g, titleize),
      articles: this.store.query('article', {
        index: 'gothamist',
        term: tag,
        count: 10,
        page,
      })
    });
  }
});
