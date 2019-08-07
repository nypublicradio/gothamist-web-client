import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  router: service(),
  compute([ url ]/*, hash*/) {
    let router = this.get('router');
    if (window && window.location) {

      let origin = `${location.protocol}//${location.host}`;
      url = url.replace(origin, '');

      if (url.startsWith(router.rootURL) || url === '') {
        return false;
      }
    }
    return true;
  }
});
