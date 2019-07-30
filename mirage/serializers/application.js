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
  keyForAttribute: attr => underscore(attr),

  keyForCollection: () => 'items',

  serialize(object, { queryParams }) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    json.items.forEach(item => cleanMirageAttrs(item, MIRAGE_ONLY));

    if (queryParams.html_path) {
      // client is expecting a single object
      return json.items[0];
    } else {
      return {
        ...json,
        meta: {
          total_count: object.models.length,
        },
      };
    }
  }
});
