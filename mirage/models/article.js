import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  // for section pages
  indexPage: belongsTo(),
});
