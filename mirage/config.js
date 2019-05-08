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
      count,
      page = 1,
    } = request.queryParams;
    if (term) {
      let articles;
      if (term.startsWith('c|')) {
        // section/category query
        let category = term.replace('c|', '');
        articles = schema.articles.all();
        articles = articles.filter(a => a.categories[0].basename === category);
      } else {
        // tag queries
        articles = schema.articles.where({tags: [term]});
      }
      return articles.slice((page - 1) * count, page * count);
    }

    if (record) {
      return schema.articles.where({ permalink: record });
    }

    const allArticles = schema.articles.all();
    return allArticles.slice((page - 1) * count, page * count);
  });

  this.get('/api/v3/buckets/:id', 'wnyc-story');

  this.urlPrefix = config.disqusAPI;

  this.get('/threads/set.json', {
    response: [{
      posts: 100, identifiers: []
    }]
  });

  this.urlPrefix = config.etagAPI;
  this.get('/', {});
}
