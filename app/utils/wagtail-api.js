import { camelize, dasherize, underscore } from '@ember/string';

/**
Utils to help dealing with Wagtail's API format

This is a how Wagtail's API represents a Wagtail Block:
{
  "type": "model_type",
  "value": {
    "key1": "foo",
    "key2": "bar"
  },
  "id": "0123456-abcdef-78910"
}
*/

/**
  Takes a JSON Object representing a Wagtail Block,
  and returns a JSON API formatted object.

  @function blockToJSONAPI
  @param block {Object}
  @return {Object}
*/
export const blockToJSONAPI = function(block) {
  return {
    id: block.id,
    type: dasherize(block.type),
    // move 'values' to 'attributes' and camelize keys
    attributes: {...Object.fromEntries(
      Object.entries(block.value).map(([k, v]) => [camelize(k), v])
    )},
  }
};

/**
  Takes a JSON Object representing an mirage model,
  and returns a JSON Object formatted like a
  Wagtail Block from the Wagtail API.

  Moves all properties besides id and type into an
  object under the 'value' key.

  @function mirageModelToBlock
  @param modelJSON {Object}
  @return {Object}
*/
export const mirageModelToBlock = function(modelJSON) {
  let block = {
    id: modelJSON.id,
    type: underscore(modelJSON.type),
    value: {},
  }
  delete modelJSON.id;
  delete modelJSON.type;
  Object.keys(modelJSON).forEach(key => {
    block.value[key] = modelJSON[key];
  });
  return block;
};