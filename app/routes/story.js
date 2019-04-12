import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';

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


    schedule('afterRender', () => {
      // instagram embeds need a manual push after rehydration
      // ember will re-render a fastboot DOM tree,
      // but the IG embed script will only operate once
      if (typeof instgrm !== 'undefined') {
        instgrm.Embeds.process();
      }
    })
  }
});
