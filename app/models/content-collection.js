import DS from 'ember-data';

export default DS.Model.extend({
  home: DS.belongsTo('home'),
  title: DS.attr('string'),
  pages: DS.hasMany('article'),
});
