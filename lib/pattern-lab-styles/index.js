'use strict';

module.exports = {
  name: require('./package').name,

  /**
    If deploying to an environment, serve pattern lab styles from the root.
    If not, using the staging hosted version.
    Opt in to serving locally
  */
  contentFor(type) {
    if (type === 'head') {
      let CSS_ROOT;

      if (process.env.DEPLOY_TARGET) {
        CSS_ROOT = '/assets';
      } else {
        CSS_ROOT = 'https://nypr.southleft.com/css/themes/default';
      }

      if (process.env.LOCAL_STYLES) {
        CSS_ROOT = CSS_ROOT.replace('https://nypr.southleft.com', 'http://localhost:8020');
      }

      return `<link rel="stylesheet" href="${CSS_ROOT}/default.css">`;
    }
  },

  isDevelopingAddon() {
    return true;
  }
};
