import ApplicationSerializer, { cleanMirageAttrs } from './application';


const MIRAGE_ONLY = ['page', 'gallery', 'author_slug'];

export default ApplicationSerializer.extend({
  serialize(_object, { queryParams}) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    if (json.items) {
      json.items.forEach(item => cleanMirageAttrs(item, MIRAGE_ONLY));
    } else {
      cleanMirageAttrs(json, MIRAGE_ONLY)
    }

    if (queryParams.token) {
      // client is expecting a single object
      return json.items[0];
    } else {
      return json;
    }
  }
});
