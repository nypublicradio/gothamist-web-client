import { helper } from '@ember/component/helper';

import config from '../config/environment';

const DEFAULTS = {
  fit: 'crop',
  q: 75,
};

export function imgixUri(path, ops = {}) {
  ops = {...DEFAULTS, ... ops};
  let domain = config.imgixHost;

  if (ops.domain === 'platypus') {
    domain = config.imgixPlatypusHost;
    delete ops.domain;
  }

  let qp = Object.keys(ops)
    .filter(key => ops[key])
    .map(key => `${key}=${ops[key]}`)
    .join('&');

  return `${domain}${path}${qp.length ? `?${qp}` : ''}`;
}

function makeHelper([ string ], hash) {
  return imgixUri(string, hash);
}

export default helper(makeHelper);
