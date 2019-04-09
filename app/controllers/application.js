import Controller from '@ember/controller';

const DONATE_URL = 'https://pledge3.wnyc.org/donate/gothamist/onestep/?utm_medium=partnersite&utm_source=gothamist&utm_campaign=brandheader';

export default Controller.extend({
  DONATE_URL,

  showLeaderboard: true,

  showNav: true,

  showShareTools: false,

  showDonate: true,

  showSearch: true,

  // on story pages
  headline: null,
});
