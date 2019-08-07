import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

const routerStub = Service.extend({
  rootURL: '/'
});

module('Integration | Helper | is-external', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', routerStub);
  });

  test('it tests if urls go to other domains', async function(assert) {
    this.set('url', 'https://example.com');
    await render(hbs`{{#if (is-external url)}}true{{else}}false{{/if}}`);
    assert.equal(this.element.textContent.trim(), 'true');

    this.set('url', 'mailto:abc@example.com');
    await render(hbs`{{#if (is-external url)}}true{{else}}false{{/if}}`);
    assert.equal(this.element.textContent.trim(), 'true');

    this.set('url', `${window.location.origin}`);
    await render(hbs`{{#if (is-external url)}}true{{else}}false{{/if}}`);
    assert.equal(this.element.textContent.trim(), 'false');

    this.set('url', `${window.location.origin}/test`);
    await render(hbs`{{#if (is-external url)}}true{{else}}false{{/if}}`);
    assert.equal(this.element.textContent.trim(), 'false');

    this.set('url', `/test`);
    await render(hbs`{{#if (is-external url)}}true{{else}}false{{/if}}`);
    assert.equal(this.element.textContent.trim(), 'false');
  });
});
