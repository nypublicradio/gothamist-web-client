import moment from 'moment';

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import {
  JUST_NOW,
  RECENT,
  TIMESTAMP_FORMAT,
} from 'gothamist-web-client/helpers/timestamp';


module('Integration | Helper | timestamp', function(hooks) {
  setupRenderingTest(hooks);

  test('timestamp', async function(assert) {
    const timestamp = moment();
    this.set('time', timestamp);

    timestamp.subtract(1, 'minutes');
    await render(hbs`{{timestamp time}}`);
    assert.equal(this.element.textContent.trim(), JUST_NOW);

    timestamp.subtract(30, 'minutes');
    await render(hbs`{{timestamp time}}`);
    assert.equal(this.element.textContent.trim(), RECENT);

    timestamp.subtract(29, 'minutes');
    await render(hbs`{{timestamp time}}`);
    assert.equal(this.element.textContent.trim(), "1 hour ago");

    timestamp.subtract(1, 'hours');
    await render(hbs`{{timestamp time}}`);
    assert.equal(this.element.textContent.trim(), "2 hours ago");

    timestamp.subtract(1, 'day');
    await render(hbs`{{timestamp time}}`);
    assert.equal(this.element.textContent.trim(), timestamp.format(TIMESTAMP_FORMAT));
  })
});
