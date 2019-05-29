export function prepDomForFastBoot() {
  let start = document.getElementById('fastboot-body-start');
  let end = document.getElementById('fastboot-body-end');

  if (!start || !end) {
    return;
  }

  if (start.parentElement !== end.parentElement) {
    start.parentElement.appendChild(end);
  }
}

export function initialize(/* appInstance */) {
  if (typeof FastBoot === 'undefined') {
    prepDomForFastBoot();
  }
}

export default {
  name: 'fastboot-fix',

  initialize,
};
