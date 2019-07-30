import ApplicationSerializer, { cleanMirageAttrs } from './application';

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    return cleanMirageAttrs(json, ['count']);
  }
});
