import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: 'Contact Us',

  beforeModel() {
    this.header.addRule('staff.index', {
      all: {
        nav: true,
        donate: true,
        search: true,
      }
    });
  },

});
