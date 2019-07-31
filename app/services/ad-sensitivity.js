import Service, { inject } from '@ember/service';


/**
  Tiny service to help managing the `sensitive` state of the app.

  Handles some timing issues with resetting the state on transition. We need to wait
  until the transition is complete before resetting, or we'll get UI flicker and potentially
  empty calls to third-party services (e.g. ads).

  @class `ad-sensitivity`
*/
export default Service.extend({
  router: inject(),

  /**
    Are we in sensitive mode?

    @field on
    @type {Boolean}
  */
  on: false,

  init() {
    this._super(...arguments);
    this.router.on('routeWillChange', transition => {
      // notify that that a reset is pending
      this._pending = true;
      transition.finally(() => this.reset());
    });
  },

  /**
    Activate sensitive mode. If there's a pending reset, mark that the `on` state
    should be preserved.

    @method activate
    @return {void}
  */
  activate() {
    this.set('on', true);

    // if there's a pending reset, notify that it should skip
    if (this._pending) {
      this._preserve = true;
    }
  },

  /**
    Handles resetting the sensitive state. If there's been a call to preserve the state,
    it will skip resetting and clear the `_preserve` flag.

    @method reset
    @return {void}
  */
  reset() {
    // no longer pending
    this._pending = false

    // if there was another call to `activate`, then skip resetting
    if (this._preserve) {
      this._preserve = false;
    } else {
      this.set('on', false);
    }
  }
});
