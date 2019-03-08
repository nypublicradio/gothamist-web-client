import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | search-results', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function() {
    const QUERY = 'foo';

    window.__gcse = {
      finished: Promise.resolve(),
    };

    window.google = {
      search: {
        cse: {
          element: {
            render: this.mock('redner').once(),
            getElement: () => ({
              execute: this.mock('execute').once().withArgs(QUERY),
            })
          }
        }
      }
    }

    this.set('query', QUERY);
    await render(hbs`{{search-results query=query}}`);
  });
});
