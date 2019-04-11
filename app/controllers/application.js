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

  /**
   Conduct a search

   @method search
   @param {String} q The search query
   @return {void}
  */
  search(value) {
    // if there are 3 or more articles for the given query
    // go to the tag listing for that term
    // otherwise do a full site search
    this.store.query('story', {
      index: 'gothamist',
      offset: 2, // start at 3
      count: 1, // only  need to know if there's at least 1 entry (i.e. 3 or more is valid)
      term: value,
    })
    .then(result => {
      if (result.meta.count > 0) {
        this.router.transitionTo('tags', value);
      } else {
        this.router.transitionTo('search', {queryParams: {q: value}});
      }
    });
  }
});
