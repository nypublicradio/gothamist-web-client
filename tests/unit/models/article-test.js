import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { ANCESTRY } from '../fixtures/article-fixtures';


module('Unit | Model | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {});
    assert.ok(model);
  });

  // test computeds
  test('section is computed from ancestry', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {
      ancestry: ANCESTRY,
    });

    assert.deepEqual(model.section, {slug: 'news', title: 'News'});
  });
});
