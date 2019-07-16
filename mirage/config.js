import { Response, faker } from 'ember-cli-mirage';

import config from '../config/environment';


export default function() {

  this.urlPrefix = config.cmsServer;

  this.get('/api/v2/pages', (schema, request) => {
    let {
      tags,
      limit,
      offset = 0,
      fields,
      type,
    } = request.queryParams;

    if (!fields && !type) {
      return new Response(400, {}, {detail: ["fields and type are required"]});
    }

    // coerce
    offset = Number(offset);
    limit = Number(limit);

    if (tags) {
      return schema.articles.where({tags}).slice(offset, (offset + 1 * limit));
    }
  });

  // general purpose find endpoint
  // look at every defined model and see if there's a matching html_path
  this.get('/api/v2/pages/find', (schema, request) => {

  });

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
