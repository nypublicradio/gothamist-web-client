import DS from 'ember-data';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Route.extend({
  fastboot: inject(),
  headData: inject(),
  session: inject(),
  dataLayer: inject('nypr-metrics/data-layer'),

  title(tokens) {
    return `${tokens.join(' - ')} - Gothamist`
  },

  beforeModel() {
    // browser only for browser ids
    if (!this.fastboot.isFastBoot) {
      this.session.syncBrowserId()
        .then(id => this.dataLayer.push({IDCustomEvents: id}));
    }
  },

  model() {
    return {
      primaryNav: [{
        route: ['sections', 'news'],
        text: 'News',
      }, {
        route: ['sections', 'arts & entertainment'],
        text: 'Arts & Entertainment',
      }, {
        route: ['sections', 'food'],
        text: 'Food',
      }, {
        route: ['popular'],
        text: 'Popular',
      }],

      secondaryNav: [{
        url: 'https://www.gothamistllc.com/',
        text: 'Advertising',
      }, {
        route: ['contact'],
        text: 'Contact Us'
      }, {
        url: 'https://wnyc.us5.list-manage.com/subscribe?u=4109fdd323aaac7078eadaa8f&id=65dbec786b',
        text: 'Newsletter',
      }, {
        url: 'https://feeds.gothamistllc.com/gothamist05',
        text: 'RSS Feed',
      }, {
        route: ['staff'],
        text: 'Staff'
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
      } else if (this.fastboot.isFastBoot) {
        this.transitionTo('500');
      } else {
        throw e;
      }
    },

    didTransition() {
      if (typeof FastBoot === 'undefined') {
        window.scrollTo(0, 0);
      }

      schedule('afterRender', () => this.dataLayer.sendPageView());
    }
  }
});
