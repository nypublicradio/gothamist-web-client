import DS from 'ember-data';
import Page from './page';
import { reads } from '@ember/object/computed'

export const WAGTAIL_MODEL_TYPE = 'home.HomePage';

export default Page.extend({
  page_collection_relationship: DS.belongsTo('content-collection'),
  featuredArticles: reads('page_collection_relationship.pages')
});
