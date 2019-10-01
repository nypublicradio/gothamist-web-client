import { helper } from '@ember/component/helper';

export function stringify([data]/*, hash*/) {
  return JSON.stringify(data);
}

export default helper(stringify);
