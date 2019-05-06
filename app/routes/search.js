import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: 'Search Results',

  beforeModel() {
    this.header.addRule('search', {
      all: {
        nav: true,
        donate: true,
        search: true,
      }
    });
  }
});
