import DS from 'ember-data';
import Page from './page';
import { notEmpty } from '@ember/object/computed';

export const WAGTAIL_MODEL_TYPE = 'tagpages.TagPage';

export default Page.extend({
  midpageZone: DS.attr(),
  topPageZone: DS.attr(),
  designedHeader: DS.attr(),

  hasMidpageZone: notEmpty('midpageZone'),
  hasTopPageZone: notEmpty('topPageZone'),
  hasDesignedHeader: notEmpty('topPageZone'),
});
