import Component from '@ember/component';
import { computed } from '@ember/object';

import getWagtailUrl from 'ember-wagtail-images/utils/get-wagtail-url';

import config from '../../config/environment';
import { medium } from '../../breakpoints';


/**
  Root-relative path to section-specific fallback thumbnails.

  @const PATH
  @type {String}
*/
const PATH = '/static-images/defaults';
/**
  Mapping of a section name to a set of image paths for small screens, medium screens, and a srcset value for high-dpi screens.

  @const FALLBACK_THUMBNAIL
  @type {Object}
*/
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

/**
  Thumbnail view for an article delivered by Wagtail. Wraps the `NyprMBlock` component with some fixed arguments.

  Usage:
  ```hbs
  <ArticleBlock
    @article={{article}}
    @orientation='h'
    @size='l'
    @thumbnailSize={{array 100 100 true}}
    @mediumThumbnailSize={{array 360 240}}
  />
  ```

  @class article-block
*/
export default Component.extend({
  tagName: '',

  /**
    Article object for rendering. Shoul have at minimum, the following attributes:
    ```
      commentCount Number
      description String
      hasAudio Boolean
      hasGallery Boolean
      hasVideo Boolean
      isSponsored Boolean
      path String
      publishedMoment Moment
      relatedAuthors Array[Object<first_name String, last_name String, slug String>]
      section Object<label String, basename String>
      thumbnail Object<id String>
      title String
    ```
    @argument article
    @type {Object}
  */

  /**
    Configured anchor tag for linking to comments section. Please define in `config/environment.js` under `ENV.commentsAnchor`.

    @field commentsAnchor
    @type {String}
  */
  commentsAnchor: config.commentsAnchor,

  /**
    Hide the "eyebrow", i.e. section name, by passing a truthy value. Default: `false`.

    @argument hideEyebrow
    @type {Boolean}
  */
  hideEyebrow: false,

  /**
    Hide the excerpt by passing a truthy value. Default: `hideExcerpt`.

    @argument hideExcerpt
    @type {Boolean}
  */
  hideExcerpt: false,

  /**
    Desired dimensions for the article thumbnail medium breakpoints. Pass an array in the form of:
    ```
    [<width>, <height>, <high dpi?>]
    ```
    If the third index is a truthy value, a `srcset` string will be computed for 1x, 2x, and 3x based on the ID of the passed in thumbnail image.

    @argument mediumThumbnailSize
    @type {Array[Number, Number, [Boolean]]}
  */

  /**
    Passed through to `NyprMBlock` as `@orientation`

    @argument orientation
    @type {String}
  */

  /**
    Show the author's name in the metadata area. Default `false`.

    @argument showAuthor
    @type {Boolean}
  */
  showAuthor: false,

  /**
    Show the comment count in the metadata area. Default `true`.

    @argument showCommentCount
    @type {Boolean}
  */
  showCommentCount: true,

  /**
    Show the timestamp in the metadata area. Default `true`.

    @argument showTimestamp
    @type {Boolean}
  */
  showTimestamp: true,

  /**
    Passed through to `NyprMBlock` as `@size`

    @argument size
    @type {String}
  */

  /**
    Desired dimensions for the article thumbnail at small breakpoints. Will also be used for larger breakpoints if `mediumThumbnailSize` is undefined. Pass an array in the form of:
    ```
    [<width>, <height>, <high dpi?>]
    ```
    If the third index is a truthy value, a `srcset` string will be computed for 1x, 2x, and 3x based on the ID of the passed in thumbnail image.

    @argument thunbnailSize
    @type {Array[Number, Number, [Boolean]]}
  */

  /**
    Breakpoint for which the `mediumThumbnailSize` `source` elements will be configured. Please do not edit directly. Change in `app/breakpoints.js`.

    @argument thunbnailBreakpoint
    @type {String}
  */
  thumbnailBreakpoint: medium,

  /**
    Derived image paths and srcset for small and medium thumbnails based on passed in article.

    @accessor thumbnail
    @type {Object}
  */
  thumbnail: computed('article', function() {
    if (!this.article) {
      return;
    }

    let { thumbnail } = this.article;

    if (!thumbnail) {
      // fallback image
      let section = this.article.section || {};
      return FALLBACK_THUMBNAIL[section.basename];
    }

    if (thumbnail) {
      let [ width, height, highDpi ] = this.thumbnailSize || [];

      let { id } = thumbnail;
      let sizes = {
        srcS: `${getWagtailUrl(id, {width, height})}`,
      };

      if (highDpi) {
        sizes.srcSet = `${getWagtailUrl(id, {width, height})} 1x,
          ${getWagtailUrl(id, {width: width * 2, height: height * 2})} 2x,
          ${getWagtailUrl(id, {width: width * 3, height: height * 3})} 3x`;
      }

      if (this.mediumThumbnailSize) {
        let [ width, height, highDpi ] = this.mediumThumbnailSize || [];

        if (highDpi) {
          sizes.srcM = `${getWagtailUrl(id, {width, height})} 1x,
          ${getWagtailUrl(id, {width: width * 2, height: height * 2})} 2x,
          ${getWagtailUrl(id, {width: width * 3, height: height * 3})} 3x`;
        } else {
          sizes.srcM = `${getWagtailUrl(id, {width, height})}`;
        }
      }

      return sizes;
    }
  }),
});
