import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  value: DS.attr(),
  relatedCollection: DS.belongsTo('content-collection')
});
