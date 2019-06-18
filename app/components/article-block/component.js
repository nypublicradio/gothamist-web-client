import Component from '@ember/component';
import { computed } from '@ember/object';

import config from '../../config/environment';
import { medium } from '../../breakpoints';
import { imgixUri } from '../../helpers/imgix-uri';


const PATH = '/static-images/defaults';
export const FALLBACK_THUMBNAIL = {
  food: {
    srcS: `${PATH}/food/food-sq.png`,
    srcSet: `${PATH}/food/food-sq@2x.png 2x, ${PATH}/food/food-sq@3x.png 3x`,
    srcM: `${PATH}/food/food-tile.png 1x, ${PATH}/food/food-tile@2x.png 2x, ${PATH}/food/food-tile@3x.png 3x`
  },
  news: {
    srcS: `${PATH}/news/news-sq.png`,
    srcSet: `${PATH}/news/news-sq@2x.png 2x, ${PATH}/news/news-sq@3x.png 3x`,
    srcM: `${PATH}/news/news-tile.png 1x, ${PATH}/news/news-tile@2x.png 2x, ${PATH}/news/news-tile@3x.png 3x`
  },
  'arts & entertainment': {
    srcS: `${PATH}/arts/arts-sq.png`,
    srcSet: `${PATH}/arts/arts-sq@2x.png 2x, ${PATH}/arts/arts-sq@3x.png 3x`,
    srcM: `${PATH}/arts/arts-tile.png 1x, ${PATH}/arts/arts-tile@2x.png 2x, ${PATH}/arts/arts-tile@3x.png 3x`
  },
  [undefined]: {
    srcS: `${PATH}/no-category/no-category-sq.png`,
    srcSet: `${PATH}/no-category/no-category-sq@2x.png 2x, ${PATH}/no-category/no-category-sq@3x.png 3x`,
    srcM: `${PATH}/no-category/no-category-tile.png 1x, ${PATH}/no-category/no-category-tile@2x.png 2x, ${PATH}/no-category/no-category-tile@3x.png 3x`
  },
};

export default Component.extend({
  tagName: '',

  showAuthor: false,
  showTimestamp: true,
  showCommentCount: true,

  commentsAnchor: config.commentsAnchor,

  init() {
    this._super(...arguments);
    if (!this.thumbnailSize) {
      this.thumbnailSize = [];
    }
  },

  thumbnail: computed('article', 'thumbnailSize', function() {
    if (!this.article) {
      return;
    }
    let path = this.article.thumbnailPath;
    let [ w, h, highDpi ] = this.thumbnailSize;

    if (path) {
      let sizes = {
        srcS: `${imgixUri(path, {w, h})}`,
      };

      if (highDpi) {
        sizes.srcSet = `${imgixUri(path, {w, h, dpr: 1})} 1x,
          ${imgixUri(path, {w, h, dpr: 2})} 2x,
          ${imgixUri(path, {w, h, dpr: 3})} 3x`;
      }

      if (this.mediumThumbnailSize) {
        let [ w, h, highDpi ] = this.mediumThumbnailSize;

        if (highDpi) {
          sizes.srcM = `${imgixUri(path, {w, h, dpr: 1})} 1x,
          ${imgixUri(path, {w, h, dpr: 2})} 2x,
          ${imgixUri(path, {w, h, dpr: 3})} 3x`;
        } else {
          sizes.srcM = `${imgixUri(path, {w, h})}`;
        }
      }

      return sizes;
    } else if (!path) {
      // fallback image
      let section = this.article.section || {};
      return FALLBACK_THUMBNAIL[section.basename];
    }
  }),

  thumbnailBreakpoint: medium,
});
