import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

import {
  TOTAL_COUNT,
} from 'gothamist-web-client/routes/index';

module('Unit | Controller | index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:index');
    assert.ok(controller);
    assert.deepEqual(controller.riverQuery, {
      index: 'gothamist',
      count: TOTAL_COUNT,
      page: 1,
    });
  });

  test('riverCallback creates pages of GROUP_SIZE', async function(assert) {
    const GROUP_SIZE = 4;
    // simple, filterable list
    const RESULTS = Array.from(new Array(GROUP_SIZE * 5), (el, i) => i);
    let controller = this.owner.lookup('controller:index');

    controller.setProperties({
      model: {main: []},
      GROUP_SIZE,
    });

    let results = controller.riverCallback(RESULTS);

    assert.equal(results.length, Math.ceil(RESULTS.length / GROUP_SIZE));
    assert.ok(
      results.every(set => set.length === GROUP_SIZE),
      'results should be an array of arrays that are the length of GROUP_SIZE'
    );
  });
});
