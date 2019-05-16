import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject(),

  tagName: '',

  // defer network request
  didInsertElement() {
    this.fetchArticles();
  },

  // navigating from article template to article template
  // will not re-fire didInsertElement
  didUpdateAttrs() {
    this.fetchArticles();
  },

  fetchArticles() {
    if (!this.article) {
      return;
    }

    // four popular articles in case the current article shows up in the results
    let popular = this.store.query('article', {
      index: 'gothamist',
      sort: 'socialtopics_score_1d',
      count: 4,
      term: `c|${this.article.section.basename}`,
    });

    // five featured articles in case the current article or any of the popular
    // articles show up in the results
    let featured = this.store.query('article', {
      index: 'gothamist',
      count: 5,
      term: ['@main', `c|${this.article.section.basename}`],
    });

    // wait for both result sets
    Promise.all([featured, popular]).then(([featured, popular]) => {
        // remove current article from results
        popular = this._dedupe(this.article, popular);
        featured = this._dedupe(this.article, featured);

        // dedupe featured if it happens to show up in popular
        popular.forEach(article => featured = this._dedupe(article, featured));

        this.setProperties({
          popular,
          featured,
        });
      });
  },

  _dedupe(needle, haystack) {
    return haystack.rejectBy('id', needle.id);
  }
});
