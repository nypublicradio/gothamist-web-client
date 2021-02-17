import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  pages: DS.hasMany('article'),
});
