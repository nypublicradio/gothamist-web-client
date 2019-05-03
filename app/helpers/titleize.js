import { helper } from '@ember/component/helper';

export function titleize(string) {
  return string.replace(
    /(\w)\w+/g,
    ([f, ...rest]) => `${f.toUpperCase()}${rest.join('')}`
  );
}

function makeHelper([ string ]) {
  return titleize(string);
}

export default helper(makeHelper);
