import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default Helper.extend({
  router: service(),
  compute([ url ]/*, hash*/) {
    if (window && window.location) {
      let rootUrl = config.rootUrl;
      if (url.startsWith(rootUrl)) {
        let router = this.get('router');
        let routeInfo = router.recognize(url);
        let params = [routeInfo.name, ...routeInfo.paramNames.map(
          paramName => routeInfo.params[paramName]
        )]
        return params;
      }
    }
  }
});
