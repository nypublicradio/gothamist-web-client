import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  fastboot: inject(),
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),

  titleToken: 'Contact Us',

  beforeModel() {
    this.dataLayer.push({template: 'flatpage'});

    this.header.addRule('contact', {
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

  actions: {
    didTransition() {
      if (!this.fastboot.isFastBoot) {
        window.scrollTo(0, 0);
      }
      return true;
    }
  }

});
