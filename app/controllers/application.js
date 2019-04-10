import Controller from '@ember/controller';
import { inject } from '@ember/service';

const DONATE_URL = 'https://pledge3.wnyc.org/donate/gothamist/onestep/?utm_medium=partnersite&utm_source=gothamist&utm_campaign=brandheader';

export default Controller.extend({
  router: inject(),

  DONATE_URL,

  showLeaderboard: true,

  showNav: true,

  showShareTools: false,

  showDonate: true,

  showSearch: true,

  // on story pages
  headline: null,

  headerLandmark: null,
});
