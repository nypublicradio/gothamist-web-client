import { imgixUri } from 'gothamist-web-client/helpers/imgix-uri';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import config from 'gothamist-web-client/config/environment';

module('Unit | Helper | imgix-uri', function(hooks) {
  setupTest(hooks);

  test('creates an imgix uri for the provided path and params', function(assert) {
    let uri = imgixUri('/foo.jpg', {h: 100, w: 100});
    assert.equal(uri, `${config.imgixHost}/foo.jpg?crop=faces&fit=crop&auto=compress,format&fm=jpg&h=100&w=100`, 'uses default params');

    uri = imgixUri('/foo.jpg', {domain: 'platypus', h: 100, w: 100});
    assert.equal(uri, `${config.imgixPlatypusHost}/foo.jpg?crop=faces&fit=crop&auto=compress,format&fm=jpg&h=100&w=100`, 'can switch to platypus host');

    uri = imgixUri('/foo.jpg', {fit: 'scale'});
    assert.equal(uri, `${config.imgixHost}/foo.jpg?crop=faces&fit=scale&auto=compress,format&fm=jpg`, 'can override defaults and leave off width and height');
  });
});
