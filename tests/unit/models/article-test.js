import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


const CAPTION_WITH_CREDIT = `
<p>
  <span class="mt-enclosure mt-enclosure-image" style="display: inline;">
    <div class="image-none">
      <img alt="bigboy040819.jpeg" src="http://gothamist.com/attachments/nyc_clampen/bigboy040819.jpeg" width="640" height="480" />
      <br />
      <i> Barsik may just be NYC's biggest cat. (Animal Care Centers of NYC)</i>
    </div>
  </span>
</p>
`;

const CAPTION_WITH_LINK = `
<p>
  <span class="mt-enclosure mt-enclosure-image" style="display: inline;">
    <div class="image-none">
      <img alt="050819latch1.jpg" src="http://gothamist.com/attachments/nyc_arts_john/050819latch1.jpg" width="640" height="473" />
      <br />
      <i> A Latch M-series keyless entrance, <a href="https://www.latch.com/m-series">via Latch's website</a>.</i>
    </div>
  </span>
</p>
`;

module('Unit | Model | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {});
    assert.ok(model);
  });

  test('lead images', function(assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {
      text: CAPTION_WITH_CREDIT,
    });

    assert.equal(model.leadImageCaption, "Barsik may just be NYC's biggest cat.");
    assert.equal(model.leadImageCredit, "Animal Care Centers of NYC");

    model = store.createRecord('article', {text: CAPTION_WITH_LINK});

    assert.equal(model.leadImageCaption, `A Latch M-series keyless entrance, <a href="https://www.latch.com/m-series">via Latch's website</a>.`);
    assert.notOk(model.leadImateCredit);
  })
});
