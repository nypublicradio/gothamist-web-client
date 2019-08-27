import moment from 'moment';
import DS from 'ember-data';

export default DS.Transform.extend({
  // return an in-memory value for the given serialized primitive
  deserialize(string, ops = {}) {
    let date = moment(string, ops.inputFormat);
    if (ops.utc) {
      date.utc();
    }
    if (ops.timezoneOverride) {
      date.tz(moment.defaultZone.name);
    }
    return date;
  },

  // return a serialized value suitable for JSON over the wire
  serialize(date, ops = {}) {
    if (moment.isMoment(date)) {
      if (ops.utc) {
        date.utc();
      } else {
        date.local();
      }
      return date.format(ops.outputFormat);
    } else {
      return date;
    }
  }
});
