import ApplicationSerializer from './application';
import DS from 'ember-data';
import { camelize, dasherize } from '@ember/string';
import fromEntries from '../utils/from-entries';

const normalizePageAttributes = function(page) {
  return fromEntries(
    Object.entries(page).map(([k, v]) => {
      if (k === 'lead_asset' && page.lead_asset) {
        v = page.lead_asset[0]
      }
      if (k === 'body') {
        v.forEach(block => block.type = dasherize(block.type));
      }
      return [camelize(k), v]
    })
  )
}

const getRelatedGallery = function(page) {
  let leadAsset = page.lead_asset && page.lead_asset[0];
  if (leadAsset && leadAsset.type === "lead_gallery") {
    return {
      gallery: {
        data: {
          type: 'gallery',
          id: page.lead_asset[0].value.gallery
        }
      }
    }
  }
  else {
    return {}
  }
}

const getGalleries = function(payload) {
  let pages = payload.page_collection_relationship && payload.page_collection_relationship.pages;
  if (pages) {
    return pages
      .filter(
        page => page.lead_asset &&
        page.lead_asset[0] &&
        page.lead_asset[0].type === 'lead_gallery')
      .map(page => ({
        type: 'gallery',
        id: page.lead_asset[0].value.gallery,
        attributes: page.lead_asset[0].value
      }));
  } else {
    return [];
  }
}

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    page_collection_relationship: { embedded: 'always' },
    pages: { embedded: 'always' },
  },
  modelNameFromPayloadKey: () => 'home',
  normalizeQueryRecordResponse(store, primaryModelClass, payload) {
    payload.page_collection_relationship = payload.page_collection_relationship ? payload.page_collection_relationship[0] : {title: "", pages: []};

    console.log('JSON', payload)

    let newPayload = {
      data: {
        type: 'home',
        id: payload.id,
        attributes: {
          meta: payload.meta,
          first_published_at: payload.first_published_at,
          title: payload.title,
          type: payload.type,
          url: payload.url,
        },
        relationships: {
          page_collection_relationship: {
            data: {
              type: 'content-collection',
              id: 4 // this should be pulled from the content-collection
            }
          }
        },
      },
      included: [{
        type: 'content-collection',
        id: 4,
        attributes: {
          title: payload.page_collection_relationship.title,
        },
        relationships: {
          pages: {
            data: payload.page_collection_relationship.pages.map(page => {
              return {
                type: 'article',
                id: page.id,
              }
            })
          }
        }
      }, ...payload.page_collection_relationship.pages.map(page => {
        return {
          type: 'article',
          id: page.id,
          attributes: normalizePageAttributes(page),
          relationships: getRelatedGallery(page)
        }
      }), ...getGalleries(payload)]
  }
  console.log('PAYLOAD', newPayload)
  return newPayload
  },
});
