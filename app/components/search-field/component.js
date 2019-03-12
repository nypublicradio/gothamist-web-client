import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  router: inject(),

  search(value) {
        this.router.transitionTo('search', {queryParams: {q: value}});
  }
});
