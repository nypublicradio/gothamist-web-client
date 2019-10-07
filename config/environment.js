'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'gothamist-web-client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      wagtailImages: {
        imagePath: `${process.env.CMS_SERVER}/images`,
      }
    },

    fastboot: {
      hostWhitelist: [/^localhost:\d+$/, /^\d+\.\d+\.\d+\.\d+:\d+$/].concat(process.env.HOST_WHITELIST ? process.env.HOST_WHITELIST.split(',') : [])
    },

    moment: {
      includeTimezone: 'all',
    },

    'nypr-ads': {
      prefix: process.env.AD_PREFIX,
    },

    'ember-math-helpers': {
      only: ['mod'],
    },

    'ember-metrics': {
      includeAdapters: ['chartbeat']
    },

    metrics: {
      chartbeat: {
        id: process.env.CHARTBEAT_ID || "00000",
        domain: 'gothamist.com'
      },
    },

    // ENDPOINTS
    cmsServer: process.env.CMS_SERVER,
    apiServer: process.env.API_SERVER,
    disqusAPI: process.env.DISQUS_API,
    disqusKey: process.env.DISQUS_PUBLIC_KEY,
    champEndpoint: process.env.CHAMP_ENDPOINT,

    // OTHER CONFIG
    wtcNewsletter:      '8c376c6dff',
    dailyNewsletter:    '65dbec786b',
    commentsAnchor:     'comments',
    donateCookie:       'goth_donateToutClosed',
    articleViewsCookie: 'goth_articleViews',
    productBannerCookiePrefix: 'gothamist_product_banner_',
    siteId:             process.env.SITE_ID || 2, //id for system_messages, sitewidecomponents, etc.

    // for nypr-auth
    etagAPI: process.env.BROWSER_ID_ENDPOINT,

    // for nypr-metrics
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID,
    'nypr-metrics': {
      disableEagerListenAnalytics: true,
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // enable mirage on the command line by running `$ MIRAGE=true ember serve`
    // anything truthy will work: `$ MIRAGE=1 ember serve`
    ENV['ember-cli-mirage'] = {
      enabled: !!process.env.MIRAGE, // allow evaluated value to control on/off
    };
    if (process.env.MIRAGE) {
      console.log('mirage enabled'); // eslint-disable-line
    }

    ENV['nypr-ads'] = {
      prefix: '_demo_test',
    };

    // for mirage endpoints
    ENV.apiServer = ENV.apiServer || 'https://api.demo.nypr.digital';
    ENV.cmsServer = ENV.cmsServer || 'https://cms.demo.nypr.digital';
    ENV.disqusAPI = ENV.disqusAPI || 'https://disqus.com';
    ENV.disqusKey = ENV.disqusKey || 'disqus-key';
    ENV.etagAPI = ENV.etagAPI || 'https://browserid.com';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    // for mirage endpoints
    ENV.cmsServer = 'https://cms.demo.nypr.digital';
    ENV.apiServer = 'https://api.demo.nypr.digital';
    ENV.cmsServer = 'https://cms.demo.nypr.digital';
    ENV.disqusAPI = 'https://disqus.com';
    ENV.disqusKey = 'disqus-key';
    ENV.etagAPI = 'https://browserid.com';
    ENV.APP.wagtailImages.imagePath = 'https://example.com/images';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
