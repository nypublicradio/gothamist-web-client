import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';


/**
  Display story details

  Usage:
  ```hbs
  <DismissableBlock
    @cookiePrefix='announcement_'
    @cookiedId={{model.announcement.id}}
    @dismissedFor=3
    @dismissedUnit='days'
    as |dismiss|
  />

    <div>
      <button {{action dismiss}}>Close</button>
      A message you want to pop up occasionally.
    </div>

  </DismissableBlock>
  ```

  @yield {action} dismiss
*/
export default Component.extend({
  cookies: service(),
  tagName: '',
  cookiePrefix: '',
  cookieId: null,
  dismissedFor: 0,
  dismissedUnit: 'hours',
  cookieName: computed('cookiePrefix','cookieId', function() {
    return `${this.cookiePrefix}${this.cookieId}`;
  }),
  isCookieSet: computed('cookieName', function() {
    return this.cookies.exists(this.cookieName);
  }),
  wasDismissCalled: false,
  wasDismissed: or('isCookieSet', 'wasDismissCalled'),
  actions: {
    dismiss() {
      let expires = moment().add(this.dismissedFor, this.dismissedUnit).toDate();
      this.cookies.write(this.cookieName, 1, {expires, path: '/'});
      this.set('wasDismissCalled', true);
    }
  }
});
