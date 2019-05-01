import config from '../config/environment';

export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
  */

  this.urlPrefix = config.apiServer;

  this.get('/topics/search', function(schema, request) {
    let {
      term,
      record,
      // count,
    } = request.queryParams;
    if (term === '@main') {
      // homepage
      return schema.articles.where({tags: ['@main']});
    }

    if (record) {
      return schema.articles.where({ permalink: record });
    }
  });

  this.get('/api/v3/buckets/:id', 'wnyc-story');

  this.get('https://disqus.com/api/3.0/threads/details.json', {response: {posts: 100}});
}
