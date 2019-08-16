import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../../../models/article';

module('Unit | Route | preview', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:preview');
    assert.ok(route);
  });

  test('it renders article route', function(assert) {
    assert.expect(2)
    let route = this.owner.lookup('route:preview');
    let testModel = {
      meta: {
        type: ARTICLE_TYPE
      },
      gallery: {}
    }

    route.render = function(route, options) {

      assert.equal(route, 'article', 'it should call the article route');
      assert.deepEqual(options.model, {
        article: testModel,
        gallery: testModel.gallery
      }, 'it should pass the correct model shape');
    }

    route.renderTemplate(undefined, testModel)
  });
});
