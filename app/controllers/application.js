import Controller from '@ember/controller';
import { inject } from '@ember/service';

import config from '../config/environment';

const DONATE_URL = 'https://pledge3.wnyc.org/donate/gothamist/onestep/?utm_medium=partnersite&utm_source=gothamist&utm_campaign=brandheader';

const NEWSLETTER_ENDPOINT = `${config.apiServer}/opt-in/v1/subscribe/mailchimp`;
const NEWSLETTER_PARAMS = {list: config.dailyNewsletter};


export default Controller.extend({
  router: inject(),
  sensitive: inject('ad-sensitivity'),

  queryParams: ['build'],
  build: null,

  DONATE_URL,

  NEWSLETTER_ENDPOINT,
  NEWSLETTER_PARAMS,

  showLeaderboard: true,

  showNav: true,

  showShareTools: false,

  showDonate: true,

  showSearch: true,

  // on article pages
  headline: null,

  headerLandmark: null,

  /**
   Conduct a search

   @method search
   @param {String} q The search query
   @return {void}
  */
  search(q) {
    this.router.transitionTo('search', {queryParams: { q }});
  }
});
