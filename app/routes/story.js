import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),

  titleToken: model => model.title,

  model({ any }) {
    return this.store.queryRecord('story', {
      record: any
    });
  },

  afterModel(model) {
    this.controllerFor('application').setProperties({
      showNav: true,
      showShareTools: true,
      headline: model.title,
      showLeaderboard: false,
      headerLandmark: '.c-article__share',
    });

    this.headData.setProperties({
      metaDescription: model.excerptFull,
    });
  }
});
