import { camelize, dasherize, underscore } from '@ember/string';
import fromEntries from '../utils/from-entries';

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
    attributes: {...fromEntries(
      Object.entries(block.value).map(([k, v]) => [camelize(k), v])
    )},
  }
};

/**
  Takes a JSON Object representing a Wagtail Block,
  and returns false if the block value is null, true if
  non-null.

  Usage:

  arrayOfBlocks.filter(blockIsNotNull)

  @function blockIsNotNull
  @param block {Object}
  @return {Boolean}
**/
export const blockIsNotNull = function(block) {
  return block.value !== null;
}

/**
  Takes a JSON Object representing an mirage model,
  and returns a JSON Object formatted like a
  Wagtail Block from the Wagtail API.

  Moves all properties besides id and type into an
  object under the 'value' key.

  If the mirage model has a value key set to null,
  instead of containing the other properties, the
  value key of the response will be null as well.

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
  if (modelJSON.value === null) {
  // let mirage set explicit null values
    block.value = null;
  } else {
    Object.keys(modelJSON).forEach(key => {
      block.value[key] = modelJSON[key];
    });
  }
  return block;
};

/**
  Extract a path from a wagtail `html_url` value. Strips trailing slashes and removes the leading protocol/host.

  @function extractPath
  @param url {String}
  @return {String} the cleaned path
*/
export const extractPath = function(url) {
  if (typeof url !== 'string') {
    return '';
  }
  return url.replace(/https?:\/\/[^/]+\//, '').replace(/\/$/, '');
}


/**
  Camelize the keys of an object one level deep.

  @function camelizeObject
  @param obj {Object}
  @return {Object} the updated object
*/
export const camelizeObject = obj => fromEntries(
  Object.entries(obj || {}).map(([k, v]) => [camelize(k), v])
)
