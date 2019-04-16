import { Serializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';

export default Serializer.extend({
  keyForCollection: () => 'entries',
  keyForAttribute: attr => underscore(attr),
});
