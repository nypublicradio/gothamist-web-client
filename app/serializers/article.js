import { dasherize } from '@ember/string';

import ApplicationSerializer from './application';

import { LEAD_GALLERY } from '../models/article';


export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'article',

  normalize(ArticleModel, payload) {
    // the server defines this as an array
    // but it'll always be a single POJO
    // pull out the first index for easier reference in the app
    payload.lead_asset = payload.lead_asset ? payload.lead_asset[0] : null;

    // `type` key is used to look up a corresponding component
    // ember wants component names to be dasherized
    // make this safe for testing
    if (payload.body) {
      payload.body.forEach(block => block.type = dasherize(block.type));
    }

    return this._super(ArticleModel, payload);
  },


  extractRelationships(ArticleModel, hash) {
    if (hash.lead_asset && hash.lead_asset.type === LEAD_GALLERY) {
      let gallery = {
        gallery: hash.lead_asset.value.gallery,
      }
      return this._super(ArticleModel, gallery);
    }
  },
});
