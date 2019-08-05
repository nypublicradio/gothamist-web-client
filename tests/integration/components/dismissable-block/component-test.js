import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click } from '@ember/test-helpers';
import moment from 'moment';

import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | dismissable-block', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(() => {
    document.cookie = `test=; expires=${moment().subtract(1, 'day')}; path=/`;
  })

  test('it renders', async function(assert) {
    await render(hbs`
      <DismissableBlock>
        template block text
      </DismissableBlock>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it can be dissmissed and sets a cookie', async function(assert) {
    this.set('cookieId', 'test')
    await render(hbs`
      <DismissableBlock
        @cookieId={{cookieId}}
        @dismissedFor=1
        as |dismiss|>
        <button id='button' {{action dismiss}}>Dismiss</button>
      </DismissableBlock>
    `);

    await click('#button');

    assert.dom('#button').doesNotExist();
    assert.ok(document.cookie.includes('test=1'));
  });

  test('it does not show when the cookie is set', async function(assert) {
    document.cookie = `test=1; expires=${moment().add(6, 'hours')}; path=/`;

    await render(hbs`
      <DismissableBlock
        @cookieId='test'
      >
        <div id='hideme'>Hide Me</div>
      </DismissableBlock>
    `);

    assert.dom('#hideme').doesNotExist();
  });

  test('it accepts a cookie prefix', async function(assert) {
    await render(hbs`
      <DismissableBlock
        @cookiePrefix='te'
        @cookieId='st'
        @dismissedFor=1
        as |dismiss|
      >
        <button id='button' {{action dismiss}}></button>
      </DismissableBlock>
    `);

    await click('#button');

    assert.dom('#button').doesNotExist();
    assert.ok(document.cookie.includes('test=1'));
  });

});
