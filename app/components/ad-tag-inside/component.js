import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import { next } from '@ember/runloop';
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
      // console.log('inserted wormhole target', insertedTarget)
      this.set('wormholeDestination', insertedTarget);
      // if (this.ref && typeof htlbid !== "undefined") {
      //   next(() => {
      //     htlbid.forceRefresh(this.ref);
      //   })
      // }
    },
    handleSlotRenderEnded(/*event*/) {
      // console.log('rendered ad', event)
      // this.ref = event.ref;
    },
  }
});
