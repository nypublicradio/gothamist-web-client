/* global googletag */
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  fastboot: service(),
  wormholeDestination: "",
  actions: {
    handleInsert(insertedTarget) {
      this.set('wormholeDestination', insertedTarget);
      if (this.ad && typeof googletag !== "undefined") {
        next(() => {
          googletag.pubads().refresh([this.ad]);
        })
      }
    },
    handleSlotRenderEnded(event) {
      this.ad = event.slot;
    },
  }
});
