import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | story', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /story', async function(assert) {
    const STORY = server.create('story');

    await visit(`/${STORY.permalink}`);

    assert.equal(currentURL(), `/${STORY.permalink}`);
    assert.dom('[data-test-top-nav]').exists('nav should exist at load');
    assert.dom('[data-test-story-headline]').hasText(STORY.title);
    assert.dom('[data-test-article-body]').hasText(STORY.text);
  });
});
