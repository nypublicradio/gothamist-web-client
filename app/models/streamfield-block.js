import DS from 'ember-data';
import { reads } from '@ember/object/computed'


export default DS.Model.extend({
  type: DS.attr('string'),
  value: DS.attr(),
  relatedCollection: DS.belongsTo('content-collection'),
  relatedArticles: reads('relatedCollection.pages')
});
