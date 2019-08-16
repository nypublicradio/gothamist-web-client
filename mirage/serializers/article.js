import ApplicationSerializer, { cleanMirageAttrs } from './application';


const MIRAGE_ONLY = ['indexPage', 'gallery'];

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    if (json.items) {
      json.items.forEach(item => cleanMirageAttrs(item, MIRAGE_ONLY));
    } else {
      cleanMirageAttrs(json, MIRAGE_ONLY)
    }

    return json;
  }
});
