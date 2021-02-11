import { dasherize } from '@ember/string';

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'tag',

  normalize(TagModel, payload) {
    // `type` key is used to look up a corresponding component
    // ember wants component names to be dasherized
    // make this safe for testing
    payload.designed_header = payload.designed_header ? payload.designed_header[0] : null;
    if (payload.top_page_zone) {
      payload.top_page_zone.forEach(block => block.type = dasherize(block.type));
    }
    if (payload.midpage_zone) {
      payload.midpage_zone.forEach(block => block.type = dasherize(block.type));
    }

    return this._super(TagModel, payload);
  },


});
