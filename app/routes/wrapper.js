import fetch from 'fetch';
import Route from '@ember/routing/route';

import config from '../config/environment';

export default Route.extend({
  model({ any }) {
    return fetch(`${config.gothamistAPI}?record=${any}`)
      .then(r => r.json())
      .then(({entries}) => entries[0]);
  }
});
