import DS from 'ember-data';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  moment: inject(),
  beforeModel() {
    this.moment.setTimeZone('America/New_York');
  },

  model() {
    return {
      primaryNav: [{
        url: '/tags/news',
        title: 'News',
      }, {
        url: '/tags/arts-entertainment',
        title: 'Arts & Entertainmeht',
      }, {
        url: '/tags/food',
        title: 'Food',
      }, {
        url: '/tags/popular',
        title: 'Popular',
      }],

      secondaryNav: [{
        url: '/advertising',
        title: 'Advertising',
      }, {
        url: '/contact',
        title: 'Contact Us'
      }, {
        url: '/newsletter',
        title: 'Newsletter',
      }, {
        url: '/feed.xml',
        title: 'RSS Feed',
      }, {
        url: '/staff',
        title: 'Staff'
      }]
    }
  },

  actions: {
    error(e) {
      if (e instanceof DS.NotFoundError) {
        this.transitionTo('404', e.url);
      } else {
        throw e;
      }
    }
  }
});
