import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';

module('Unit | Transform | moment', function(hooks) {
  setupTest(hooks);

  const TEST_STRING = "2019-06-20T18:49:16.280131Z";

  test('it turns a string into a moment', function(assert) {
    let transform = this.owner.lookup('transform:moment');

    assert.ok(moment.isMoment(transform.deserialize(TEST_STRING)));
  });

  test('it turns a moment into a string', function(assert) {
    let transform = this.owner.lookup('transform:moment');
    const MOMENT = moment(TEST_STRING);

    assert.ok(typeof transform.serialize(MOMENT) === 'string');
  });

  test('it respects params', function(assert) {
    const INPUT_FORMAT = 'YYYY-MM-DD';
    const OUTPUT_FORMAT = 'M/D/YYYY';

    let date = moment.utc('1999-12-16', INPUT_FORMAT);

    let transform = this.owner.lookup('transform:moment');

    let stringified = transform.serialize(date, {
      outputFormat: OUTPUT_FORMAT,
    });

    assert.equal(stringified, date.format(OUTPUT_FORMAT), 'serializes to specified `outputFormat`');

    let dateified = transform.deserialize('1999-12-16', {
      inputFormat: INPUT_FORMAT,
      utc: true,
    });

    assert.ok(dateified.isValid(), 'uses specified `inputFormat`');
    assert.ok(dateified.isUTC(), 'respects `utc` param');
  })
});
