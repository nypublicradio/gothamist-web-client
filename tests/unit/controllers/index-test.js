import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Controller | index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:index');
    assert.ok(controller);
  });

  test('getMoreStories creates pages of GROUP_SIZE', async function(assert) {
    const GROUP_SIZE = 4;
    // simple, filterable list
    const RESULTS = Array.from(new Array(50), (el, i) => i);
    let controller = this.owner.lookup('controller:index');

    controller.setProperties({
      model: {main: []},
      GROUP_SIZE,
    });

    this.stub(controller.store, 'query')
      .resolves(RESULTS);

    assert.equal(controller.moreArticles.length, 0);
    await controller.getMoreStories();

    assert.equal(controller.moreArticles.length, Math.ceil(RESULTS.length / GROUP_SIZE));

  });
});
