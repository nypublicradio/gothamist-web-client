import { module, test } from 'qunit';

import trackEvent from 'gothamist-web-client/utils/track-event';

module('Unit | Utility | track-event', function() {
  test('it logs an event to the dataLayer', function(assert) {
    window.dataLayer = window.dataLayer || [];
    let eventData = {
      category: "Test Category",
      action: "Test Action",
      label: "Test Label"
    };

    trackEvent(eventData);

    const data = window.dataLayer.pop();
    assert.equal(data['event'], "eventTracking");
    assert.equal(data['eventCategory'], "Test Category");
    assert.equal(data['eventAction'], "Test Action");
    assert.equal(data['eventLabel'], "Test Label");
  });
});
