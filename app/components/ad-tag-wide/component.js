import Component from '@ember/component';

export default Component.extend({
  classNames: ['ad-tag-wide'],
  height: 0,
  actions: {
    handleSlotRendered(slot) {
      if (slot && slot.size) {
        this.set('height', slot.size[1]);
      }
      if (this.slotRenderEndedAction) {
        this.slotRenderEndedAction(...arguments);
      }
    }
  }
});