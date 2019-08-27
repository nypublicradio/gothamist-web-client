import Component from '@ember/component';
import { filter } from '@ember/object/computed';
import { getOwner } from '@ember/application';

export default Component.extend({
  tagName: '',

  components: filter('blocks', function(block) {
    const owner = getOwner(this);
    return Boolean(owner.lookup(`component:article-body/${block.type}`));
  }),
});
