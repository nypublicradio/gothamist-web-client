import moment from 'moment';
import { Response, faker } from 'ember-cli-mirage';

import config from '../config/environment';
import { paginate, searchAllCollections } from './utils';


const QUERY_MAP = {
  descendant_of: 'pageId',
};

const PARAMS_TO_SKIP = ['fields', 'type', 'limit', 'offset', 'order'];

export default function() {
  this.urlPrefix = config.cmsServer;

  this.get('/api/v2/pages/:id', (schema, request) => {
    const collectionNames = schema.db._collections.mapBy('name').filter(n => n !== 'consts');
    let { id } = request.params;

    for (let i = 0; i < collectionNames.length; i++) {
      let collection = collectionNames[i];
      let found = schema[collection].find(id);
      if (found) {
        return found;
      }
    }

    return new Response(404);
  });

  this.get('/api/v2/pages', (schema, request) => {
    let {
      limit,
      offset,
      fields,
      type,
      order = '',
    } = request.queryParams;

    if (!fields && !type) {
      return new Response(400, {}, {detail: ["fields and type are required"]});
    }

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

    return paginate(articles, limit, offset);
  });

  // general purpose find endpoint
  // look at every defined model and see if there's a matching html_path
  this.get('/api/v2/pages/find', (schema, request) => {
    let { html_path } = request.queryParams;

    // add a trailing slash to match server expectations
    html_path = html_path.replace(/([^/]+)$/, '$1/');

    if (html_path === "/") {
      return schema['homepages'].all();
    }

    if (html_path.startsWith("tags/")) {
      let slug = html_path.split('/')[1];
      return schema['tagpages'].where({slug});
    }

    let found = searchAllCollections({ html_path }, schema);

    return found || new Response(404);
  });



  // elasticsearch endpoint
  this.get('/api/v2/search/', function(schema, { queryParams }) {
    let {
      limit,
      offset,
      q,
    } = queryParams;

    let found = searchAllCollections({ description: q }, schema);
    found = this.serialize(found);
    if (found) {
      found.items = found.items.map(item => ({
        result: item,
        content_type_id: 5,
        score: 1.2345,
      }));
      found.items = paginate(found.items, limit, offset);
    } else {
      found = {
        items: [],
        meta: { total_count: 0 }
      };

    }

    return found;
  });

  this.get('/api/v2/page_preview', (schema, request) => {
    if (request.queryParams) {
      let { identifier, token } = request.queryParams;
      return schema.articles.findBy({ identifier, token }) ||
        schema.galleries.findBy({ identifier, token }) ||
        schema.tagpages.findBy({ identifier, token });
    }
    return new Response(404);
  });

  this.get('/api/v2/sitewide_components/:id/');

  this.get('/api/v2/system_messages/:id/');

  this.urlPrefix = config.apiServer;

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
