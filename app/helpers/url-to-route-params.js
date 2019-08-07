import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';


/**
 *  This helper accepts a 'url' as a string and returns
 *  an array of route parameters for use with our custom
 *  link-to, if possible.
 *
 *  It will return undefined when running in fastboot,
 *  because we don't have access to the current location.
 *
 */
export default Helper.extend({
  router: service(),
  compute([ url ]/*, hash*/) {
    // If we're not in fastboot don't try this.
    if (window && window.location) {
      let origin = `${location.protocol}//${location.host}`;
      url = url.replace(origin, '');

      let router = this.get('router');
      if (url.startsWith(router.rootURL)) {
        let routeInfo = router.recognize(url);
        return routeInfoToParamsList(routeInfo)
      }
    }
  }
});


/**
 * `routeInfo` is a specific type of Ember object that
 * `router.recognize()` returns. This method takes a
 * `routeInfo` and returns an array of routing
 * parameters for use with our custom `link-to`.
 *
 * Note: this doesn't hande query string parameters.
 *
 * @param  {Object} routeInfo RouteInfo
 * @return {[String]}         An array of routing parameters
 */
export function routeInfoToParamsList(routeInfo) {
  let routeParams = [routeInfo.name];

  while (routeInfo && routeInfo.name !== 'application') {
    routeInfo.paramNames.forEach(
      paramName => routeParams.push(routeInfo.params[paramName])
    );
    routeInfo = routeInfo.parent;
  }

  return routeParams;
}
