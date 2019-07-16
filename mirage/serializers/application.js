import { Serializer } from 'ember-cli-mirage';
import { underscore } from '@ember/string';

export default Serializer.extend({
  keyForAttribute: attr => underscore(attr),
});
