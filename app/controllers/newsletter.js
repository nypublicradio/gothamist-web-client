import Controller from '@ember/controller';
import config from '../config/environment';
import trackEvent from '../utils/track-event';

const NEWSLETTER_ENDPOINT = config.newsletterEndpoint;
const NEWSLETTER_PARAMS = {list: config.dailyNewsletter};

export default Controller.extend({
  NEWSLETTER_ENDPOINT,
  NEWSLETTER_PARAMS,
  trackEvent
});
