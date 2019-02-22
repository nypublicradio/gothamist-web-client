import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('story', {
      index: 'gothamist',
      term: '@main',
      count: 3
    });
  }
});
