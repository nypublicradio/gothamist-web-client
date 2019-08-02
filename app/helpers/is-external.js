import { helper } from '@ember/component/helper';

export function isExternal([ url ]/*, hash*/) {
  if (window && window.location) {
    let base = window.location.origin;
    if (url.startsWith(base)) {
      return false;
    }
    if (url.startsWith('/')) {
      return false;
    }
    if (url === '') {
      return false;
    }
  }
  return true;
}

export default helper(isExternal);
