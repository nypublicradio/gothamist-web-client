import { Serializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';

export default Serializer.extend({
  keyForCollection: () => 'items',
  keyForAttribute: attr => underscore(attr),

  serialize(object/*, request*/) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    return {
      ...json,
      meta: {
        total_count: object.models.length,
      },
    };
  }
});
