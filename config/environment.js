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
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: [/^localhost:\d+$/, /^\d+\.\d+\.\d+\.\d+:\d+$/].concat(process.env.HOST_WHITELIST ? process.env.HOST_WHITELIST.split(',') : [])
    },

    moment: {
      includeTimezone: 'all',
    },

    // ENDPOINTS
    apiServer: process.env.API_SERVER,
    platypusServer: process.env.PLATYPUS_SERVER,
    disqusAPI: process.env.DISQUS_API,
    disqusKey: process.env.DISQUS_PUBLIC_KEY,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // enable mirage on the command line by running `$ mirage=true ember serve`
    // anything truthy will work: `$ mirage=1 ember serve`
    ENV['ember-cli-mirage'] = {
      enabled: !!process.env.mirage
    };

    // for mirage endpoints
    ENV.apiServer = 'https://api.demo.nypr.digital';
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
    ENV.apiServer = 'https://api.demo.nypr.digital';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
