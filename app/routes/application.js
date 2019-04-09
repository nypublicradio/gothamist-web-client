import DS from 'ember-data';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  moment: inject(),
  beforeModel() {
    this.moment.setTimeZone('America/New_York');
  },

  actions: {
    error(e) {
      if (e instanceof DS.NotFoundError) {
        this.transitionTo('404', e.url);
      }
    }
  }
});
