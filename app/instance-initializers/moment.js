import moment from 'moment';

export function initialize() {
  moment.tz.setDefault('America/New_York');
  moment.updateLocale('en', {
    meridiem: hour => {
      if (hour < 12) {
        return 'a.m.';
      } else {
        return 'p.m.';
      }
    }
  });
}

export default {
  initialize
};
