import DS from 'ember-data';
import Page from './page';
import { notEmpty } from '@ember/object/computed';

export const WAGTAIL_MODEL_TYPE = 'tagpages.TagPage';

export default Page.extend({
  midpageZone: DS.hasMany('streamfield-block'),
  topPageZone: DS.hasMany('streamfield-block'),
  designedHeader: DS.attr(),

  hasMidpageZone: notEmpty('midpageZone'),
  hasTopPageZone: notEmpty('topPageZone'),
  hasDesignedHeader: notEmpty('designedHeader'),
});
