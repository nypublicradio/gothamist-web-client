import { module, skip /* test */ } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

import config from 'gothamist-web-client/config/environment';

module('Acceptance | popular', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  skip('visiting /popular', async function(assert) {
    // it's basically the same as the tags page
    // let's just assert that the correct query is made to the topics API
    server.get(`${config.apiServer}/topics/search`, function(schema, request) {
      assert.equal(request.queryParams.sort, 'socialtopics_score_1d', 'popular route requests articles based on social topics score');

      return schema.articles.all();
    });
    await visit('/popular');

    assert.equal(currentURL(), '/popular');
  });
});
