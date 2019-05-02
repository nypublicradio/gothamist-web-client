import moment from 'moment';

import { helper } from '@ember/component/helper';

export const JUST_NOW = 'Just now';
export const RECENT = 'Less than one hour ago';
export const TIMESTAMP_FORMAT = 'MMM D, YYYY h:mm a';

export function timestamp([ timestamp ], { format } = {}) {
  timestamp = moment(timestamp, format);
  let now = moment();
  let minutes = now.diff(timestamp, 'minutes')
  let hours = now.diff(timestamp, 'hours');
  if (minutes <= 5) {
    return JUST_NOW;
  } else if (minutes > 5 && hours < 1) {
    return RECENT;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    return timestamp.format(TIMESTAMP_FORMAT);
  }
}

export default helper(timestamp);
