import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';

module('Acceptance | 404', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    window.pSUPERFLY = {virtualPage: () => true};
  });

  test('404 page', async function(assert) {
    server.createList('article', 4);
    await visit('/nope');

    assert.equal(currentURL(), '/nope');

    assert.dom('[data-test-block]').exists({count: 4}, 'renders 4 popular stories');
  });

  test('navigating to 404 page', async function(assert) {
    const PERMALINK = 'foo';
    server.get(`${config.apiServer}/topics/search`, function(schema, request) {
      let {
        record,
      } = request.queryParams;
      if (record === `http://gothamist.com/${PERMALINK}`) {
        return {entries: []};
      }
      return schema.articles.all();
    });
    server.create('article', {permalink: PERMALINK, id: '1'});

    await visit('/');
    await click('[data-test-block="1"] .c-block__title-link');

    assert.equal(currentURL(), `/${PERMALINK}`);
    assert.dom('[data-test-404-heading]').hasText("The page you're looking for doesn't appear to exist.");
  });
});
