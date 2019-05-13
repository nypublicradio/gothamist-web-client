import DS from 'ember-data';
import fetch from 'fetch';

import config from '../config/environment';


export const QUERY_PARAMS = {
  api_key: config.disqusKey,
  forum: 'gothamist',
};
export const BASE = `${config.disqusAPI}/threads/set.json`;

/**
  Takes the given model or list of models (aka RecordArray) and fetches their comment count
  from the Disqus API.

  Catches network errors and prints them to the console.

  @function addCommentCount
  @param modelOrRecordArray {DS.Model|DS.RecordArray}
  @return {void}
*/
export default async function addCommentCount(modelOrRecordArray) {
  let qp = Object.keys(QUERY_PARAMS).map(key => `${key}=${QUERY_PARAMS[key]}`);

  if (modelOrRecordArray instanceof DS.Model) {
    qp.push(`thread:ident=${modelOrRecordArray.id}`);
  } else if (modelOrRecordArray instanceof DS.RecordArray) {
    modelOrRecordArray.mapBy('id').forEach(id => qp.push(`thread:ident=${id}`));
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
    if (!res) {
      return; // disqus blocked;
    }
  }

  let { response } = await res.json();

  if (modelOrRecordArray instanceof DS.Model) {
    let [thread] = response;
    modelOrRecordArray.set('commentCount', thread.posts);
  } else if (modelOrRecordArray instanceof DS.RecordArray){
    response.forEach(thread => {
      let { identifiers, posts } = thread;
      let [ id ] = identifiers;
      let article = modelOrRecordArray.findBy('id', id);
      if (article) {
        article.set('commentCount', posts);
      }
    });
  }

}
