import Route from '@ember/routing/route';
import RSVP from 'rsvp';

const { hash } = RSVP;

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true,
    }
  },

  model({ tag, page = 1 }) {
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
