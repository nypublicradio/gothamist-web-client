/* global googletag */
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  fastboot: service(),
  wormholeTarget: "",
  actions: {
    handleInsert(insertedTarget) {
      this.set('wormholeDestination', insertedTarget);
      if (this.ad && typeof(googletag) !== "undefined") {
        run(() => {
          googletag.pubads().refresh([this.ad]);
        })
      }
    },
    handleSlotRenderEnded(event) {
      this.ad = event.slot;
    },
  }
});
