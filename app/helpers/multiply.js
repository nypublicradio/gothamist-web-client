import { helper } from '@ember/component/helper';

export function multiply([a, b]/*, hash*/) {
  let result = a * b;
  if (isNaN(result)) {
    result = '';
  }
  return result;
}

export default helper(multiply);
