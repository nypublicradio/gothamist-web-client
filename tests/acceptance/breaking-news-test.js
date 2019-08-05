import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | breaking news', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    server.create('sitewide-components');
  });

  test('breaking news appears on the home page', async function(assert) {
    server.create('breaking-news');

    await visit('/');

    assert.dom('[data-test-breaking-news]').exists({count: 1});
  });

  test('multiple breaking news appear on the home page', async function(assert) {
    server.createList('breaking-news', 4);

    await visit('/');

    assert.dom('[data-test-breaking-news]').exists({count: 4});
  });

  test('external breaking news links open in new window', async function(assert) {
    server.create('breaking-news', {
      url: 'http://example.com'
    });

    await visit('/');

    assert.dom('[data-test-breaking-news] a').hasAttribute('target','_blank');
    assert.dom('[data-test-breaking-news] a').hasAttribute('rel','noopener');
  });

  test('local breaking news links open in same window', async function(assert) {
    server.create('breaking-news', {
      url: '/news/'
    });

    await visit('/');

    assert.dom('[data-test-breaking-news] a').doesNotHaveAttribute('target');
  });
});
