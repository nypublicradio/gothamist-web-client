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

module('Integration | Helper | get-route-params', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', routerStub);
  });

  test('it renders', async function(assert) {
    this.set('url', '/author/authorname');

    await render(hbs`{{get-route-params url}}`);

    assert.equal(this.element.textContent.trim(), 'author-detail,authorname');
  });

  test('it returns undefined for external urls', async function(assert) {
    this.set('url', 'http://example.com');

    await render(hbs`{{#if (get-route-params url)}}true{{else}}false{{/if}}`);

    assert.equal(this.element.textContent.trim(), 'false');
  });

});
