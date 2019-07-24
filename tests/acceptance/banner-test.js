import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import moment from 'moment';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'gothamist-web-client/config/environment';

module('Acceptance | banner', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    //clear cookie
    document.cookie = `${config.productBannerCookiePrefix}12345=; expires=${moment().subtract(1, 'day')}; path=/`;
    server.create('system-message');
    // setup test banner
    server.get(`${config.cmsServer}/api/v2/system_messages/1/`, function() {
      return {
        id: 1,
        meta: {
          type : "utils.SystemMessagesSettings",
          detail_url: `http://localhost/api/v2/system_messages/1/`
        },
        product_banners: [
          {
            "type": "product_banner",
            "id": "12345",
            "value": {
              "title": "Test Title",
              "description": "<p>Test Description</p>",
              "button_text": "Test Button",
              "button_link": "http://example.com",
              "frequency": 8,
              "location": "TOP"
            }
          }
        ]
      }
    });
  });

  test('top product banner displays', async function(assert) {
    await visit('/');

    assert.dom('[data-test-top-product-banner]').exists();
    assert.dom('[data-test-top-product-banner] .o-box-banner__title').includesText("Test Title");
    assert.dom('[data-test-top-product-banner] .o-box-banner__dek').includesText("Test Description");
    assert.dom('[data-test-top-product-banner] .o-box-banner__cta').includesText("Test Button");
  });

  test('can dismiss top product banner', async function(assert) {
    await visit('/');

    await click('[data-test-top-product-banner] button.o-box-banner__close');

    assert.dom('[data-test-top-product-banner]').doesNotExist();
    assert.ok(document.cookie.includes('gothamist_product_banner_12345=1'));
  });

  test('top product banner does not show when cookie is set', async function(assert) {
    // set cookie
    document.cookie = `${config.productBannerCookiePrefix}12345=1; expires=${moment().add(8, 'hours')}; path=/`;

    await visit('/');

    assert.dom('[data-test-top-product-banner]').doesNotExist();
  });
});
