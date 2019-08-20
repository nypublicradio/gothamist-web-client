import DS from 'ember-data';
import fetch from 'fetch';

import { get } from '@ember/object';

import config from '../config/environment';


export const QUERY_PARAMS = {
  api_key: config.disqusKey,
  forum: 'gothamist',
};
export const BASE = `${config.disqusAPI}/threads/set.json`;

const DEFAULT_OPS = {
  ident: 'id',
};

/**
  Takes the given model or list of models (aka RecordArray) and fetches their comment count
  from the Disqus API.

  Catches network errors and prints them to the console.

  @function addCommentCount
  @param modelOrRecordArray {DS.Model|DS.RecordArray}
  @return {void}
*/
export default async function addCommentCount(modelOrRecordArray, ops = {}) {
  ops = {...DEFAULT_OPS, ...ops};
  let qp = Object.keys(QUERY_PARAMS).map(key => `${key}=${QUERY_PARAMS[key]}`);

  if (modelOrRecordArray instanceof DS.Model) {
    qp.push(`thread:ident=${get(modelOrRecordArray, ops.ident)}`);
  } else if (modelOrRecordArray instanceof DS.RecordArray) {
    modelOrRecordArray.mapBy(ops.ident).forEach(ident => qp.push(`thread:ident=${ident}`));
  }

  let res;
  try {
    res = await fetch(`${BASE}?${qp.join('&')}`);
    if (res.status !== 200) {
      const e = new Error('Disqus API call failed.');
      e.response = res;
      throw e;
    }
  } catch(e) {
    console.warn(e); // eslint-disable-line
    return; // disqus blocked;
  }

  let { response } = await res.json();

  if (modelOrRecordArray instanceof DS.Model) {
    let [thread] = response;
    modelOrRecordArray.set('commentCount', thread.posts);
  } else if (modelOrRecordArray instanceof DS.RecordArray){
    response.forEach(thread => {
      let { identifiers, posts } = thread;
      let [ id ] = identifiers;
      let article = modelOrRecordArray.findBy(ops.ident, id);
      if (article) {
        article.set('commentCount', posts);
      }
    });
  }

}
