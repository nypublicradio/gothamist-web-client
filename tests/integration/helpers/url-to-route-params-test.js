import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

const routerStub = Service.extend({
  rootURL: '/',
  recognize() {
    return {
      name: 'author-detail',
      paramNames: ['name'],
      params: {
        'name': 'authorname'
      }
    };
  },
});

module('Integration | Helper | url-to-route-params', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', routerStub);
  });

  test('it renders', async function(assert) {
    this.set('url', '/author/authorname');

    await render(hbs`{{url-to-route-params url}}`);

    assert.equal(this.element.textContent.trim(), 'author-detail,authorname');
  });
});
