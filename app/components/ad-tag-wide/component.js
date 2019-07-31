import Component from '@ember/component';
import { inject } from '@ember/service';

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
