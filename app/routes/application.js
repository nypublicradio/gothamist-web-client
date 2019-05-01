import DS from 'ember-data';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  fastboot: inject(),
  headData: inject(),

  title(tokens) {
    return `${tokens.join(' - ')} - Gothamist`
  },

  model() {
    return {
      primaryNav: [{
        url: '/tags/news',
        title: 'News',
      }, {
        url: '/tags/arts-entertainment',
        title: 'Arts & Entertainment',
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

  afterModel() {
    if (this.fastboot.isFastBoot) {
      let { protocol, host, path } = this.fastboot.request;
      let url = `${protocol}//${host}${path.replace(/\/$/, '')}`;

      this.headData.setProperties({
        url,
      });
    }
  },

  actions: {
    error(e) {
      if (e instanceof DS.NotFoundError) {
        this.transitionTo('404', e.url);
      } else {
        throw e;
      }
    },

    didTransition() {
      if (typeof FastBoot === 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }
});
