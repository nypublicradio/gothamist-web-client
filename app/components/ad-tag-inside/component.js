/* global googletag */
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { and, not } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  fastboot: service(),
  sensitive: service('ad-sensitivity'),

  wormholeDestination: "",

  notFastBoot: not('fastboot.isFastBoot'),
  notSensitive: not('sensitive.on'),
  shouldRender: and('wormholeDestination', 'notFastBoot', 'notSensitive'),

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
