import Component from '@ember/component';

export default Component.extend({
  classNames: ['ad-tag-wide'],
  /**
    The dfp ad slot path

    @argument slot
    @type {string}
  */
  slot: undefined,
  /**
    When true, displays an 'ADVERTISING' label.

    @argument showLabel
    @type {boolean}
  */
  showLabel: false,
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
  actions: {
    handleSlotRendered(slot) {
      if (this.slotRenderEndedAction) {
        this.slotRenderEndedAction(slot);
      }
    }
  }
});
