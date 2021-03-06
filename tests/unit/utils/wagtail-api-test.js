import { module, test } from 'qunit';

import  {
  blockToJSONAPI,
  mirageModelToBlock,
  blockIsNotNull,
  extractPath,
  camelizeObject
} from 'gothamist-web-client/utils/wagtail-api';

module('Unit | Utility | wagtail-api', function() {

  test('blockToJSONAPI converts wagtail block JSON to JSON API format', function(assert) {
    let block = {
      "type": "model_type",
      "value": {
        "key_one": "foo",
        "key_two": "bar"
      },
      "id": "0123456-abcdef-78910"
    };

    let expected = {
      id: "0123456-abcdef-78910",
      type: "model-type",
      attributes: {
        keyOne: "foo",
        keyTwo: "bar"
      },
    };

    let result = blockToJSONAPI(block);
    assert.deepEqual(result, expected);
  });

  test('mirageModelToBlock converts mirage model JSON to wagtail block JSON format', function(assert) {
    let modelJSON = {
      id: "0123456-abcdef-78910",
      type: "model-type",
      key_one: "foo",
      key_two: "bar",
    };

    let expected = {
      "type": "model_type",
      "value": {
        "key_one": "foo",
        "key_two": "bar"
      },
      "id": "0123456-abcdef-78910"
    };

    let result = mirageModelToBlock(modelJSON);
    assert.deepEqual(result, expected);
  });

  test(`mirageModelToBlock converts mirage model JSON with null value to
    wagtail block JSON format with null value`, function(assert) {
    let modelJSON = {
      id: "0123456-abcdef-78910",
      type: "model-type",
      value: null,
      key_one: "foo",
      key_two: "bar",
    };

    let expected = {
      "type": "model_type",
      "value": null,
      "id": "0123456-abcdef-78910"
    };

    let result = mirageModelToBlock(modelJSON);
    assert.deepEqual(result, expected);
  });

  test('blockIsNotNull returns false for a block with null value', function(assert) {
    let block = {
      "type": "model_type",
      "value": null,
      "id": "0123456-abcdef-78910"
    };
    assert.notOk(blockIsNotNull(block));
  });

  test('blockIsNotNull returns true for a block with non-null value', function(assert) {
    let block = {
      "type": "model_type",
      "value": {
        "key_one": "foo",
        "key_two": "bar"
      },
      "id": "0123456-abcdef-78910"
    };
    assert.ok(blockIsNotNull(block));
  });

  test('extractPath strips protocols, domains, and trailing slashes', function(assert) {
    assert.equal(extractPath('http://gothamist.com/foo/bar/'), 'foo/bar');

    assert.deepEqual(extractPath({
      foo: 'http://gothamist.com/foo/bar'
    }), '', 'should silently handle unexpected types by returning the empty string');

    assert.equal(extractPath('foo/bar'), 'foo/bar', 'should not strip anything besides a trailing slash or leading protocol/domain');
  });

  test('camelizeObject camelizes an object', function(assert) {
    assert.deepEqual(camelizeObject({
      foo_bar: 'baz',
      bizBuz: 'qux'
    }), {
      fooBar: 'baz',
      bizBuz: 'qux'
    }, 'only updates snake cased keys');

    assert.deepEqual(camelizeObject(), {}, 'returns an object for an undefined argument');
    assert.deepEqual(camelizeObject(null), {}, 'returns an object for a null argument');
  })
});
