import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  cookies: service(),

  compute([cookieId]) {
    return this.cookies.exists(cookieId);
  }
});
