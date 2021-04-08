import ApplicationSerializer from './application';
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

const getGalleries = function(pages) {
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

export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: () => 'content-collection',
  normalize(typeClass, hash) {
    let normalized = {
      data: {
        type: 'content-collection',
        id: hash.id,
        attributes: {
          title: hash.title,
        },
        relationships: {
          pages: {
            data: hash.pages.map(page => {
              return {
                type: 'article',
                id: page.id,
              }
            })
          }
        },
      },
      included: [
        ...hash.pages.map(page => {
          return {
            type: 'article',
            id: page.id,
            attributes: normalizePageAttributes(page),
            relationships: getRelatedGallery(page)
          }
        }),
      ...getGalleries(hash.pages)
      ]
    }
    return normalized
  }
});
