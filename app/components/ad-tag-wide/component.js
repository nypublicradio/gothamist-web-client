import Component from '@ember/component';
import { inject } from '@ember/service';
import config from 'gothamist-web-client/config/environment';

export default Component.extend({
  classNames: ['ad-tag-wide'],

  sensitive: inject('ad-sensitivity'),
  /**
    The dfp ad slot path

    @argument slot
    @type {string}
  */
  slot: undefined,
  /**
    When true adds markup and classes for
    breaking out of horizontal margins.

    @argument breakMargins
    @type {boolean}
  */
  breakMargins: false,
  /**
    Called when the dfp-ad finishes rendering

    @argument slotRenderEndedAction
    @type {function}
  */
  isEager: (!config.lazyLoadAds),

  actions: {
    handleSlotRendered(slot) {
      if (this.slotRenderEndedAction) {
        this.slotRenderEndedAction(slot);
      }
    }
  }
});
