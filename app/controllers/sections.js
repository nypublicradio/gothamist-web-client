import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default Controller.extend({
  filteredRiver: filter('model.river', ['model.featured'], function(item) {
    return !this.model.featured.includes(item);
  }),
});
