import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['featured-collection'],
  pages: reads('collection.pages')
});
