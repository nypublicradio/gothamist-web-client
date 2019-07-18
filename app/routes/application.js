import uuid from 'uuid/v1';
import DS from 'ember-data';

import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { schedule } from '@ember/runloop';
import { doTargetingForPath, clearTargetingForPath } from 'nypr-ads';
import config from '../config/environment';

export default Route.extend({
  router: inject(),
  fastboot: inject(),
  headData: inject(),
  session: inject(),
  metrics: inject(),
  dataLayer: inject('nypr-metrics/data-layer'),

  init() {
    this._super(...arguments);

    this.dataLayer.push({sessionID: uuid()});

    // for 404 tracking
    this.router.on('routeWillChange', () => {
      this.dataLayer.push({previousPath: this.router.currentURL})

      // reset metrics context before every transition with just the referring URL
      // subsequent updates to pagedata will need to merge with this existing value
      this.set('metrics.context.pageData', {
        referrer: this.router.currentURL,
      });
    });

    // synthetic page view for analytics
    this.router.on('routeDidChange', (transition) => {
      const from = get(transition, 'from.name')
      const to = get(transition, 'to.name')
      if (from === 'article.gallery' && to === 'article.gallery') {
        schedule('afterRender', () => this.dataLayer.push('event', 'Gallery Slide View'));
      } else {
        schedule('afterRender', () => this.dataLayer.sendPageView());
      }
    });
  },

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
        route: ['sections', 'arts-entertainment'],
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

  afterModel(_model, transition) {
    if (this.fastboot.isFastBoot) {
      let { host, path } = this.fastboot.request;
      let url = `https://${host}${path.replace(/\/$/, '')}`;

      this.headData.setProperties({
        url,
        apiServer: config.apiServer,
        // default og image if nested route does not override
        image: {
          full: '/static-images/home_og_1200x600.png',
          width: 600,
          height: 1200,
        }
      });
    }

    const metrics = this.metrics;

    // Lazy-load chartbeat
    if (!this.fastboot.isFastBoot) {
      transition.finally(() => {
        metrics.activateAdapters([
          {
            name: 'chartbeat',
            environments: ['all'],
            config: {
              ...config.metrics.chartbeat,
              ...metrics.context.pageData,
            }
          }
        ]);
      });
    }

  },

  actions: {
    error(e, transition) {
      console.error(e); // eslint-disable-line
      // extract required arguments for urlFor:

      // The dot-separated, fully-qualified name of the route, like "article.index"
      let targetRoute = transition.targetName;
      // all the RouteInfos for the intended route
      let routes = transition.routeInfos;
      // gather up the path params in their correct order
      let params = routes.map(route =>
        route.paramNames.map(key => route.params[key])  // `paramNames` is each param in order
                                                        // specified in router.js
      ).reduce((params, vals) => params.concat(vals), []); // flatten

      let path = this.router.urlFor(targetRoute, ...params);
      // strip the leading slash
      path = path.replace(/^\//, '');

      if (e instanceof DS.NotFoundError) {
        if (this.fastboot.isFastBoot) {
          this.set('fastboot.response.statusCode', 404);
        }
        this.transitionTo('404', path);
      } else if (this.fastboot.isFastBoot) {
        this.set('fastboot.response.statusCode', 500);
        this.transitionTo('500');
      } else {
        this.transitionTo('500', path);
      }
    },

    didTransition() {
      doTargetingForPath();
      if (typeof FastBoot === 'undefined') {
        this.metrics.trackPage()
      }
    },

    willTransition() {
      clearTargetingForPath();
    }
  }
});
