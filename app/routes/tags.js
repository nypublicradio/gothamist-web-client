import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { classify } from '@ember/string';

const { hash } = RSVP;

export default Route.extend({
  titleToken: model => classify(model.tag),

  queryParams: {
    page: {
      refreshModel: true,
    }
  },

  model({ tag, page = 1 }) {
    if (['news', 'arts-entertainment', 'food'].includes(tag)) {
      tag = `c|${tag}`;
    }
    return hash({
      tag,
      stories: this.store.query('story', {
        index: 'gothamist',
        term: tag,
        count: 10,
        page,
      })
    });
  }
});
