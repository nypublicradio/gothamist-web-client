import Route from '@ember/routing/route';

export default Route.extend({
  model({ any }) {
    return this.store.queryRecord('story', {
      record: any
    });
  },

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: false,
      showShareTools: true,
      headline: model.title,
      showLeaderboard: false,
    });
  }
});
