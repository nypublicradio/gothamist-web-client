import Controller from '@ember/controller';
import fade from 'ember-animated/transitions/fade';

export default Controller.extend({
  page: 1,

  init() {
    this._super(...arguments);
    this.set('moreArticles', []);
  },

  transition: fade,

  getMoreStories() {
    const { GROUP_SIZE, COUNT } = this;

    this.store.query('article', {
      index: 'gothamist',
      count: COUNT,
      page: this.incrementProperty('page'),
    }).then(results => {
      results = results.filter(a => !this.model.main.includes(a));

      for (let i = 0; i < results.length; i += GROUP_SIZE) {
        this.moreArticles.pushObject(results.slice(i, i + GROUP_SIZE));
      }
    });
  },
});
