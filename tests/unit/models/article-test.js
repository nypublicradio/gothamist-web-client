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

const CAPTION_WITH_WHITESPACE = `
<p>
  <span class="mt-enclosure mt-enclosure-image" style="display: inline;">
    <div class="image-none">
      <img alt="bigboy040819.jpeg" src="http://gothamist.com/attachments/nyc_clampen/bigboy040819.jpeg" width="640" height="480" />
      <br />
      <i> Joseph Jordan a.k.a Eric Striker (Courtesy of the Southern Poverty Law Center) </i>
    </div>
  </span>
</p>
`;

const CREDIT_WITH_LINK = `
<p>
  <span class="mt-enclosure mt-enclosure-image" style="display: inline;">
    <div class="image-none">
      <img alt="bigboy040819.jpeg" src="http://gothamist.com/attachments/nyc_clampen/bigboy040819.jpeg" width="640" height="480" />
      <br />
      <i> Barsik may just be NYC's biggest cat. (<a href="http://example.com">Animal Care Centers of NYC</a>)</i>
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
    let model = store.createRecord('article', {text: CAPTION_WITH_CREDIT});

    assert.equal(model.leadImageCaption, "Barsik may just be NYC's biggest cat.");
    assert.equal(model.leadImageCredit, "Animal Care Centers of NYC");

    model = store.createRecord('article', {text: CREDIT_WITH_LINK});

    assert.equal(model.leadImageCaption, "Barsik may just be NYC's biggest cat.");
    assert.equal(model.leadImageCredit, `<a href="http://example.com">Animal Care Centers of NYC</a>`);

    model = store.createRecord('article', {text: CAPTION_WITH_LINK});

    assert.equal(model.leadImageCaption, `A Latch M-series keyless entrance, <a href="https://www.latch.com/m-series">via Latch's website</a>.`);
    assert.notOk(model.leadImateCredit);

    model = store.createRecord('article', {text: CAPTION_WITH_WHITESPACE});

    assert.equal(model.leadImageCaption, 'Joseph Jordan a.k.a Eric Striker');
    assert.equal(model.leadImageCredit, 'Courtesy of the Southern Poverty Law Center');
  })

  test('external links', function(assert) {
    const URL = window.location.toString();
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('article', {text: `
      <p>
        <a href="http://google.com" id="external">external link</a>
      </p>
      <p>
        <a href="${URL}">internal link</a>
      </p>
    `});

    let external = model.body.querySelector('#external');
    let internal = model.body.querySelector('#internal');

    assert.dom(external).hasAttribute('target', '_blank', 'external link gets target blank');
    assert.dom(external).hasAttribute('rel', 'noopener', 'target blank gets no opener');

    assert.dom(internal).doesNotHaveAttribute('target');
  })
});
