import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  link: DS.attr('string'),
  description: DS.attr('string'),
  startTime: DS.attr('moment', {timezoneOverride: true}),
});
