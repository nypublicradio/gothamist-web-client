import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  router: inject(),
  store:  inject(),

  search(value) {
    // if there are 3 or more articles for the given query
    // go to the tag listing for that term
    // otherwise do a full site search
    this.store.query('story', {
      index: 'gothamist',
      offset: 2, // start at 3
      count: 1, // only  need to know if there's at least 1 entry (i.e. 3 or more is valid)
      term: value,
    })
    .then(result => {
      if (result.meta.count > 0) {
        this.router.transitionTo('tags', value);
      } else {
        this.router.transitionTo('search', {queryParams: {q: value}});
      }
    });
  }
});
