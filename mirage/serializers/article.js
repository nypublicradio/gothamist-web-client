import { Serializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';

export default Serializer.extend({
  keyForCollection: () => 'entries',
  keyForAttribute: attr => underscore(attr),

  serialize(object, request) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    return {
      ...json,
      total_entries: object.models.length,
      listed_entries: parseInt(request.queryParams.count, 10),
    };
  }
});
