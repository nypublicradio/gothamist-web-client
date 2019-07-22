import moment from 'moment';
import { Response, faker } from 'ember-cli-mirage';

import config from '../config/environment';


const QUERY_MAP = {
  descendant_of: 'indexPageId',
};

const PARAMS_TO_SKIP = ['fields', 'type', 'limit', 'offset', 'order'];

const searchAllCollections = (query, schema) => {
  const collectionNames = schema.db._collections.mapBy('name').filter(n => n !== 'consts');

  for (let i = 0; i < collectionNames.length; i++) {
    let collection = collectionNames[i];
    let found = schema[collection].where({...query});
    if (found.models.length) {
      return found;
    }
  }
};

export default function() {

  this.urlPrefix = config.cmsServer;

  this.get('/api/v2/pages', (schema, request) => {
    let {
      limit,
      offset = 0,
      fields,
      type,
      order = '',
    } = request.queryParams;

    if (!fields && !type) {
      return new Response(400, {}, {detail: ["fields and type are required"]});
    }

    // coerce
    offset = Number(offset);
    limit = Number(limit);

    const START = offset;
    const END = (offset + 1 * limit);

    // construct a query object for the `where` method
    const QUERY = {}
    for (let param in request.queryParams) {
      // skip certain params
      if (!PARAMS_TO_SKIP.includes(param)) {
        // some query param keys translate to a different mirage attr key
        let prop = QUERY_MAP[param] || param;
        QUERY[prop] = request.queryParams[param];
      }
    }

    let articles = schema.articles.where(QUERY);

    if (order.match('publication_date')) {
      let sortFn;

      if (order[0] === '-') {
        // descending
        sortFn = (a, b) => moment(a.publication_date).isAfter(b.publication_date) ? -1 : 1;
      } else {
        sortFn = (a, b) => moment(a.publication_date).isBefore(b.publication_date) ? -1 : 1;
      }
      articles = articles.sort(sortFn)
    }

    return articles.slice(START, END);
  });

  // general purpose find endpoint
  // look at every defined model and see if there's a matching html_path
  this.get('/api/v2/pages/find', (schema, request) => {
    let { html_path } = request.queryParams;

    let found = searchAllCollections({ html_path }, schema);

    return found || new Response(404);
  });

  // elasticsearch endpoint
  this.get('/api/v2/search/', function(schema, { queryParams: { q } }) {
    let found = searchAllCollections({ description: q }, schema);
    found = this.serialize(found);
    found.items = found.items.map(item => ({
      result: item,
      content_type_id: 5,
      score: 1.2345,
    }));
    return found;
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
