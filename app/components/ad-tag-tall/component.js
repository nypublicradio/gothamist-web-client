import Component from '@ember/component';
import config from 'gothamist-web-client/config/environment';

export default Component.extend({
  classNames: ['ad-tag-wide'],

  isEager: (!config.lazyLoadAds),

  actions: {
    handleSlotRendered(slot) {
      if (this.slotRenderEndedAction) {
        this.slotRenderEndedAction(slot);
      }
    }
  }
});
