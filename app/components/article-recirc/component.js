import Component from '@ember/component';
import { inject } from '@ember/service';

import addCommentCount from '../../utils/add-comment-count';


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

    // four recent articles in case the current article shows up in the results
    let recent = this.store.query('article', {
      limit: 4,
      descendant_of: this.article.section.id,
    });

    // five featured articles in case the current article or any of the recent
    // articles show up in the results
    let featured = this.store.query('article', {
      limit: 5,
      show_as_feature: true,
      descendant_of: this.article.section.id,
    });

    // wait for both result sets
    Promise.all([featured, recent]).then(([featured, recent]) => {
        addCommentCount(featured);
        addCommentCount(recent);

        // remove current article from results
        recent = this._dedupe(this.article, recent);
        featured = this._dedupe(this.article, featured);

        // dedupe featured if it happens to show up in recent
        recent.forEach(article => featured = this._dedupe(article, featured));

        this.setProperties({
          recent,
          featured,
        });
      });
  },

  _dedupe(needle, haystack) {
    return haystack.rejectBy('id', needle.id);
  }
});
