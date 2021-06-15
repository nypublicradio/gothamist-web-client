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

    'nypr-ads-htl': {
      prefix: process.env.AD_PREFIX,
      scriptURL: 'https://htlbid.com/v3/gothamist.com/htlbid.js',
    },

    '@sentry/ember': {
      disablePerformance: true,
      sentry: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        whitelistUrls: [/gothamist-client\.demo\.nypr\.digital/, /gothamist\.com/],
      }
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
    newsletterEndpoint: `${process.env.API_SERVER}/email-proxy/subscribe`,
    wtcNewsletter:      '8c376c6dff',
    dailyNewsletter:    '65dbec786b',
    commentsAnchor:     'comments',
    donateCookie:       'goth_donateToutClosed',
    articleViewsCookie: 'goth_articleViews',
    productBannerCookiePrefix: 'gothamist_product_banner_',
    siteId:             Number(process.env.GOTHAMIST_SITE_ID) || 2, //id for system_messages, sitewidecomponents, etc.
    lazyLoadAds:        !!process.env.LAZY_LOAD_ADS,  // If LAZY_LOAD_ADS exists, turn on lazy loading for non-sticky ads

    // for header meta tags, see head.hbs for dimensions
    fallbackMetadataImage: '/static-images/home_og_1200x650.png',

    // for nypr-auth
    etagAPI: process.env.BROWSER_ID_ENDPOINT,

    // for nypr-metrics
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID,
    'nypr-metrics': {
      disableEagerListenAnalytics: true,
    },

    googleOptimize: process.env.GOOGLE_OPTIMIZE_ID,
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
    ENV.siteId = Number(process.env.GOTHAMIST_SITE_ID) || 1;
    ENV.apiServer = ENV.apiServer || 'https://api.demo.nypr.digital';
    ENV.cmsServer = ENV.cmsServer || 'https://cms.demo.nypr.digital';
    ENV.disqusAPI = ENV.disqusAPI || 'https://disqus.com';
    ENV.disqusKey = ENV.disqusKey || 'disqus-key';
    ENV.etagAPI = ENV.etagAPI || 'https://browserid.com';

    // @todo: use ENV.cmsServer default for imagePath defined above
    // @body: we have a fallback CMS server if running locally,
    // but it's not set for the imagePath, so the fallback CMS_SERVER value
    // won't be used, even though it should be.
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
    ENV.siteId = 1;
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
