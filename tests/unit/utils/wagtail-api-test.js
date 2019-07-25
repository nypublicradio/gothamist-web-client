import  { blockToJSONAPI, mirageModelToBlock } from 'gothamist-web-client/utils/wagtail-api';
import { module, test } from 'qunit';

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

});
