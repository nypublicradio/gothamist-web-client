'use strict';

module.exports = {
  name: require('./package').name,

  contentFor(type) {
    if (type === 'head' && process.env.DEPLOY_TARGET) {
      return '<meta http-equiv="refresh" content="1200">';
    }
  }
};
