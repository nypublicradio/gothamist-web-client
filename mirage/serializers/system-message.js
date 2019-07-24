import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    return json.systemMessage;
  }
});
