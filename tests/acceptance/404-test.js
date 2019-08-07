import { module, test, skip } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { Response } from 'ember-cli-mirage';

import defaultScenario from '../../mirage/scenarios/test-default';

import config from 'gothamist-web-client/config/environment';

module('Acceptance | 404', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    defaultScenario(server);
    window.pSUPERFLY = {virtualPage: () => true};
  });

  test('404 page', async function(assert) {
    server.createList('article', 4);
    await visit('/nope');

    assert.equal(currentURL(), '/nope');

    assert.dom('[data-test-block]').exists({count: 4}, 'renders 4 popular stories');
  });

  skip('navigating to 404 page', async function(assert) {
    const article = server.create('article', {id: '1'});
    server.get(`${config.cmsServer}/api/v2/pages/find`, function(schema, request) {
      let {
        html_path,
      } = request.queryParams;
      if (html_path === article.html_path.slice(0, -1)) {
        return new Response(404, {}, {message: "not found"});
      }
      return schema.articles.all();
    });

    await visit('/');
    await click('[data-test-block="1"] .c-block__title-link');

    assert.equal(currentURL(), `/${article.html_path.slice(0, -1)}`);
    assert.dom('[data-test-404-heading]').hasText("The page you're looking for doesn't appear to exist.");
  });
});
