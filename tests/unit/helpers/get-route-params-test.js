import { routeInfoToParamsList } from 'gothamist-web-client/helpers/get-route-params';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | get-route-params', function(hooks) {
  setupTest(hooks);

  const application = {
    localName: "application",
    name: "application",
    paramNames: [],
    params: {},
    parent: null
  }

  const article = {
    localName: "article",
    name: "article",
    paramNames: ["any"],
    params: {
      any: "article/abc",
    },
    parent: application
  }

  test('it handles simple routes', function(assert) {
    const testRouteInfo = {
      localName: "contact",
      name: "contact",
      paramNames: [],
      params: {},
      parent: application
    };

    const expected = ['contact'];

    assert.deepEqual(routeInfoToParamsList(testRouteInfo), expected);
  });

  test('it handles simple routes', function(assert) {
    const testRouteInfo = {
      localName: "contact",
      name: "contact",
      paramNames: [],
      params: {},
      parent: application
    };

    const expected = ['contact'];

    assert.deepEqual(routeInfoToParamsList(testRouteInfo), expected);
  });

  test('it handles routes with params', function(assert) {
    const testRouteInfo = {
      localName: "tags",
      name: "tags",
      paramNames: ['tag'],
      params: {
        tag: 'abc'
      },
      parent: application
    };

    const expected = ['tags', 'abc'];

    assert.deepEqual(routeInfoToParamsList(testRouteInfo), expected);
  });

  test('it handles article routes', function(assert) {
    const testRouteInfo = {
      localName: "index",
      name: "article.index",
      paramNames: [],
      params: {},
      parent: article
    };

    const expected = ['article.index', 'article/abc'];

    assert.deepEqual(routeInfoToParamsList(testRouteInfo), expected);
  });

  test('it handles gallery routes', function(assert) {
    const testRouteInfo = {
      localName: "gallery",
      name: "article.gallery",
      paramNames: [],
      params: {},
      parent: article
    };

    const expected = ['article.gallery', 'article/abc'];

    assert.deepEqual(routeInfoToParamsList(testRouteInfo), expected);
  });

});
