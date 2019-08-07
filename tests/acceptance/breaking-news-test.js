import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import defaultScenario from '../../mirage/scenarios/test-default';

module('Acceptance | breaking news', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    defaultScenario(server);
  });

  test('breaking news appears on the home page', async function(assert) {
    server.create('breaking-news');

    await visit('/');

    assert.dom('.c-block--urgent').exists({count: 1});
  });

  test('multiple breaking news appear on the home page', async function(assert) {
    server.createList('breaking-news', 4);

    await visit('/');

    assert.dom('.c-block--urgent').exists({count: 4});
  });

  test('external breaking news links open in new window', async function(assert) {
    server.create('breaking-news', {
      link: 'http://example.com'
    });

    await visit('/');

    assert.dom('.c-block--urgent a').exists();
    assert.dom('.c-block--urgent a').hasAttribute('href','http://example.com');
    assert.dom('.c-block--urgent a').hasAttribute('target', '_blank');
    assert.dom('.c-block--urgent a').hasAttribute('rel', 'noopener');
  });

  test('local breaking news links open in same window, contact', async function(assert) {
    const url = '/contact';
    server.create('breaking-news', {
      link: url
    });

    await visit('/');

    assert.dom('.c-block--urgent a').exists();
    assert.dom('.c-block--urgent a').hasAttribute('href', url);
    assert.dom('.c-block--urgent a').doesNotHaveAttribute('target');
  });

  test('local breaking news links open in same window, author', async function(assert) {
    const url = '/author/abc';
    server.create('breaking-news', {
      link: url
    });

    await visit('/');

    assert.dom('.c-block--urgent a').exists();
    assert.dom('.c-block--urgent a').hasAttribute('href', url);
    assert.dom('.c-block--urgent a').doesNotHaveAttribute('target');
  });

  test('local breaking news links open in same window, article', async function(assert) {
    const url = '/article/123';
    server.create('breaking-news', {
      link: url
    });

    await visit('/');

    assert.dom('.c-block--urgent a').exists();
    assert.dom('.c-block--urgent a').hasAttribute('href', url);
    assert.dom('.c-block--urgent a').doesNotHaveAttribute('target');
  });

  test('local breaking news links open in same window, gallery', async function(assert) {
    const url = '/article/123/gallery';
    server.create('breaking-news', {
      link: url
    });

    await visit('/');

    assert.dom('.c-block--urgent a').exists();
    assert.dom('.c-block--urgent a').hasAttribute('href', url);
    assert.dom('.c-block--urgent a').doesNotHaveAttribute('target');
  });
});
