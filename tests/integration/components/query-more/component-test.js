import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | query-more', function(hooks) {
  setupRenderingTest(hooks);

  test('it yields an ember concurrency task that queries the store with the given args', async function() {
    const MODEL = 'foo';
    const QUERY = {
      baz: '1234',
      qux: true,
    };

    const store = this.owner.lookup('service:store');

    this.mock(store)
      .expects('query')
      .withArgs(MODEL, QUERY)
      .resolves({});

    this.setProperties({
      MODEL,
      QUERY,
    });

    await render(hbs`
      <QueryMore @query={{QUERY}} @model={{MODEL}} as |more|>
        <button onclick={{perform more.queryMore}} id="query-more">click</button>
      </QueryMore>
    `);

    await click('#query-more');
  });

  test('it yields retrieved results as an array within `pages`', async function(assert) {
    const RESULTS = ['foo', 'bar', 'baz'];
    const store = this.owner.lookup('service:store');

    this.mock(store)
      .expects('query')
      .resolves(RESULTS);

    await render(hbs`
      <QueryMore as |more|>
        <button onclick={{perform more.queryMore}} id="query-more">click</button>

        <div id="results">
          {{#each more.pages as |page|}}
            {{#each page as |item|}}
              {{item}}
            {{/each}}
          {{/each}}
        </div>
      </QueryMore>
    `);

    await click('#query-more');
    assert.dom('#results').hasText('foo bar baz');
  });

  test('it accepts a callback that can alter the retrieved results', async function(assert) {
    const RESULTS = ['foo', 'bar', 'baz'];
    const EXPECTED = RESULTS.slice(0, -1);
    const CALLBACK = results => (results.pop(), results);
    const store = this.owner.lookup('service:store');

    this.set('callback', CALLBACK);
    this.mock(store)
      .expects('query')
      .resolves(RESULTS);


    await render(hbs`
      <QueryMore @callback={{action callback}} as |more|>
        <button onclick={{perform more.queryMore}} id="query-more">click</button>

        <div id="results">
          {{#each more.pages as |page|}}
            {{#each page as |item|}}
              {{item}}
            {{/each}}
          {{/each}}
        </div>
      </QueryMore>
    `);

    await click('#query-more');

    assert.deepEqual(RESULTS, EXPECTED, 'callback should modify resolved value');
    assert.dom('#results').hasText(EXPECTED.join(' '));
  });

  test('if a `page` query param is passed, it will be incremented afterwards', async function(assert) {
    const MODEL = 'foo';
    const QUERY = {
      page: 1,
    };

    this.setProperties({
      MODEL,
      QUERY,
    });
    const store = this.owner.lookup('service:store');
    this.mock(store)
      .expects('query')
      .withArgs(MODEL, {page: 1})
      .resolves({});

    await render(hbs`
      <QueryMore @model={{MODEL}} @query={{QUERY}} as |more|>
        <button onclick={{perform more.queryMore}} id="query-more">click</button>
      </QueryMore>
    `);

    await click('#query-more');

    assert.equal(QUERY.page, 2);
  });

  test('it adds to the existing result set', async function(assert) {
    const EXPECTED = ['foo', 'bar', 'baz', 'qux'];
    const store = this.owner.lookup('service:store');
    this.stub(store, 'query')
      .onCall(0).returns(['foo', 'bar'])
      .onCall(1).returns(['baz', 'qux']);

    await render(hbs`
      <QueryMore as |more|>
        <button onclick={{perform more.queryMore}} id="query-more">click</button>

        <div id="results">
          {{#each more.pages as |page|}}
            {{#each page as |item|}}
              {{item}}
            {{/each}}
          {{/each}}
        </div>
      </QueryMore>
    `);

    await click('#query-more');
    assert.dom('#results').hasText('foo bar');

    await click('#query-more');
    assert.dom('#results').hasText(EXPECTED.join(' '));
  });

  test('yielded `isFinished` reflects if more results are available on the server', async function(assert) {
    const store = this.owner.lookup('service:store');
    this.stub(store, 'query')
      .onCall(0).resolves({contents: ['foo', 'bar'], meta: {total: 4}})
      .onCall(1).resolves({contents: ['baz', 'qux'], meta: {total: 4}});

    await render(hbs`
      <QueryMore @query={{hash count=2}} as |more|>
        {{#unless more.isFinished}}
          <button onclick={{perform more.queryMore}} id="query-more">click</button>
        {{/unless}}

        <div id="results">
          {{#each more.pages as |page|}}
            {{#each page as |item|}}
              {{item}}
            {{/each}}
          {{/each}}
        </div>
      </QueryMore>
    `);

    await click('#query-more');
    await click('#query-more');

    assert.dom('#query-more').doesNotExist('button should be hidden when there are no more results');
  });
});
