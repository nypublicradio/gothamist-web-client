import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('article');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('article', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it strips twitter embed scripts', function(assert) {
    let store = this.owner.lookup('service:store');
    let serializer = this.owner.lookup('serializer:article');
    let Article = store.modelFor('article');
    const PAYLOAD = {
      entries: {
        text: `
        <p>Below, a tweet (and Instagram) storm following the cancellation announcement: </p>

        <center>
          <blockquote class="twitter-tweet" data-lang="en">
            <p lang="en" dir="ltr">
              People stuck on Randall&#8217;s island for <a href="https://twitter.com/hashtag/governorsball?src=hash&amp;ref_src=twsrc%5Etfw">#governorsball</a> - ferries stopped running. Nowhere to go. Thunder and lightning. People scared - it&#8217;s a disaster. Theme for this year is <a href="https://twitter.com/hashtag/you?src=hash&amp;ref_src=twsrc%5Etfw">#you</a>&#8217;redoinggreat - not kidding. Like Stuart smalley was running this shitshow <a href="https://t.co/i1hS3SGG0r">pic.twitter.com/i1hS3SGG0r</a>
            </p>
            &mdash; Paula Froelich 🤔 (@Pfro) <a href="https://twitter.com/Pfro/status/1135367227430068224?ref_src=twsrc%5Etfw">June 3, 2019</a>
          </blockquote>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </center>

        <center>
          <blockquote class="twitter-tweet" data-lang="en">
            <p lang="en" dir="ltr">
              So <a href="https://twitter.com/hashtag/GovBall?src=hash&amp;ref_src=twsrc%5Etfw">#GovBall</a> cancelled Beastcoast right before their performance, security came onstage and cursed us out and we were thrown out into a major storm on a flooded/muddy island where we were trapped for the duration of the storm. <a href="https://t.co/2qDOp18FsY">pic.twitter.com/2qDOp18FsY</a>
            </p>
            &mdash; Black &amp; Jewish ☭ 🇵🇸🇻🇪 (@AfroBlueBenj) <a href="https://twitter.com/AfroBlueBenj/status/1135523360107110401?ref_src=twsrc%5Etfw">June 3, 2019</a>
          </blockquote>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </center>
      `
      }
    };

    let normalizedRecord = serializer.normalizeResponse(store, Article, PAYLOAD, 'foo', 'query');

    assert.notOk(normalizedRecord.data.attributes.text.match(/widgets.js/g), 'widgets script should be removed');
  });
});
