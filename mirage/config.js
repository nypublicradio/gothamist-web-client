import { faker } from 'ember-cli-mirage';

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
    } = qpExtract(request.url);
    if (term) {
      if (!Array.isArray(term)) {
        term = [term];
      }
      let articles;

      let category = term.find(t => t.startsWith('c|'));
      let author = term.find(t => t.startsWith('a|'));
      if (category) {
        // section/category query
        category = category.replace('c|', '');
        articles = schema.articles.all();
        articles = articles.filter(a => a.categories[0].basename === category);
      } else if (author) {
        // author query
        author = author.replace('a|', '');
        articles = schema.articles.where({author_nickname: author});
      } else {
        // tag queries
        articles = schema.articles.where({tags: term});
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

  this.get('/threads/set.json', (schema, request) => {
    if (!request.queryParams) {
      return {response: []};
    }
    // duplicate keys for `thread:ident` do not get captured by mirage/pretender
    let params = request.url.split('?')[1];
    let ids = params
      .split('&')
      .filter(param => param.split('=')[0] === 'thread:ident')
      .map(param => param.split('=')[1]);

    return {
      response: ids.map(id => ({posts: faker.random.number(200), identifiers: [id]})),
    }
  });

  this.urlPrefix = config.etagAPI;
  this.get('/', {});
}

function qpExtract(url) {
  return url
    .split('?')[1]
    .split('&')
    .map(p => ([p.split('=')[0], decodeURIComponent(p.split('=')[1])]))
    .reduce((params, [key, val]) => {
      if (params[key] && Array.isArray(params[key])) {
        params[key].push(val);
      } else if (params[key]) {
        params[key] = [params[key]];
        params[key].push(val);
      } else {
        params[key] = val;
      }
      return params;
    }, {});
}
