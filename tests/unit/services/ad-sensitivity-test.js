import sinon from 'sinon';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | ad-sensitivity', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:ad-sensitivity');
    assert.ok(service);
  });

  test('it resets on transition', function(assert) {
    let sensitive = this.owner.lookup('service:ad-sensitivity');
    let router = this.owner.lookup('service:router');

    const transition = {finally: sinon.stub().callsArg(0)};

    sensitive.activate();

    router.trigger('routeWillChange', transition);

    assert.notOk(sensitive.on, 'should reset on transition');
  });
});
