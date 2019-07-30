import { Serializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';


const MIRAGE_ONLY = ['section', 'html_path'];

/**
  Delete passed in attributes from the given object
  Useful for cleaning out any mirage-only attrs from the response

  @function cleanMirageAttrs
  @param obj {Object}
  @param attrs {Array[String]} Key names to delete
  @return {Object} cleaned object
*/
export function cleanMirageAttrs(obj, attrs = []) {
  attrs.forEach(attr => delete obj[attr]);
  return obj;
}

export default Serializer.extend({
  embed: true,
  root: false,

  keyForAttribute: attr => underscore(attr),
  keyForEmbeddedRelationship: attr => underscore(attr),

  serialize(object, { queryParams }) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    if (Array.isArray(json)) {
      json.forEach(item => cleanMirageAttrs(item, MIRAGE_ONLY));
    } else {
      cleanMirageAttrs(json, MIRAGE_ONLY);
    }

    if (queryParams.html_path) {
      // client is expecting a single object
      return json[0];
    } else {
      // query request
      // return everything under an `items` namespace
      return {
        items: json,
        meta: {
          total_count: object.models.length,
        },
      };
    }
  }
});
