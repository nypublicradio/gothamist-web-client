import Controller from '@ember/controller';
import config from '../config/environment';

const NEWSLETTER_ENDPOINT = `${config.apiServer}/opt-in/v1/subscribe/mailchimp`;
const NEWSLETTER_PARAMS = {list: config.dailyNewsletter};

export default Controller.extend({
  NEWSLETTER_ENDPOINT,
  NEWSLETTER_PARAMS,
});
