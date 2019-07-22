import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  dataLayer: inject('nypr-metrics/data-layer'),
  header: inject('nypr-o-header'),
  fastboot: inject(),

  titleToken: 'Search Results',

  beforeModel() {
    this.dataLayer.push({template: 'search'});

    this.header.addRule('search', {
      all: {
        nav: true,
        donate: true,
        search: true,
      },
      resting: {
        leaderboard: true,
      },
    });
  },

  model({ q }) {
    if (q && !this.fastboot.isFastBoot) {
      // delay rendering until client
      this.controllerFor('search').search.perform(q);
    }
  }
});
