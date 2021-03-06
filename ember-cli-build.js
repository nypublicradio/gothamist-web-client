'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('autoprefixer');
const stew = require('broccoli-stew')

var env = process.env.ENV;

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sourcemaps: {
      enabled: true,
    },
    babel: {
      sourceMaps: 'inline'
    },
    sassOptions: {
      includePaths: [
        'node_modules/include-media/dist',
      ],
      sourceMap: true,
    },
    postcssOptions: {
      compile: {
        enabled: false,
      },
      filter: {
        enabled: true,
        plugins: [
          {
            module: autoprefixer,
          }
        ]
      }
    },
    fingerprint: {
      exclude: ['png'], // default images
    },
    'nypr-design-system': {
      themes: env && env.toUpperCase() === 'PROD' ?
        ['gothamist'] :
        ['gothamist', 'white-label', 'deprecated']
    },
    SRI: {
      // JS preload fails due to a bug in chromium
      // patched, should land soon: https://chromium.googlesource.com/chromium/src.git/+/664b6639caeb2e0e7a9755db5a69256050b9d2e2
      enabled: false,
    }
  });

  let tree = app.toTree()
  if (env && env.toUpperCase() === 'PROD') {
    tree = stew.rename(tree, 'robots-prod.txt', 'robots.txt');
    tree = stew.rm(tree, 'robots-demo.txt')
  } else {
    tree = stew.rename(tree, 'robots-demo.txt', 'robots.txt');
    tree = stew.rm(tree, 'robots-prod.txt')
  }

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return tree;
};
