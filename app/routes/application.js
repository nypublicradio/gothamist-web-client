import DS from 'ember-data';
import Route from '@ember/routing/route';

export default Route.extend({

  actions: {
    error(e) {
      if (e instanceof DS.NotFoundError) {
        this.transitionTo('404', e.url);
      }
    }
  }
});
