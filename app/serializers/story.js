import DS from 'ember-data';
import { underscore } from '@ember/string';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: () => 'story',
  keyForAttribute: key => underscore(key),
});
