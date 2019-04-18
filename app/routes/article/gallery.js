import Route from '@ember/routing/route';

export default Route.extend({

  titleToken: model => `Photos - ${model.title}`,

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: true,
      headline: null,
      showLeaderboard: false,
      headerLandmark: null,
    });
  }
});
