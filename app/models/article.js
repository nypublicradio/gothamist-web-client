import DS from 'ember-data';
import Page from './page';
import { computed } from '@ember/object';
import { reads, bool, or } from '@ember/object/computed';
import { inject } from '@ember/service';

import { extractPath, camelizeObject } from '../utils/wagtail-api';


export const WAGTAIL_MODEL_TYPE = 'news.ArticlePage';
export const SECTION_PAGE_TYPE = 'standardpages.IndexPage';

export const LEAD_GALLERY = 'lead_gallery';
export const LEAD_VIDEO   = 'lead_video';
export const LEAD_AUDIO   = 'lead_audio';
export const LEAD_IMAGE   = 'lead_image';

const AD_BINDINGS = [
  'adTags:tags',
  'racy',
  'sponsorNames:Sponsor',
  'section.slug:Category',
];

export default Page.extend({
  router: inject(),

  ancestry:    DS.attr(),
  body:        DS.attr(),
  description: DS.attr('string'),

  disableComments: DS.attr('boolean'),

  leadAsset:      DS.attr(),

  legacyId:       DS.attr('string'),

  meta: DS.attr(),

  publicationDate: DS.attr('moment', {
    timezoneOverride: true,
  }),

  provocativeContent: DS.attr('boolean'),

  relatedAuthors:                   DS.attr({defaultValue: () => []}),
  relatedContributingOrganizations: DS.attr({defaultValue: () => []}),
  relatedLinks:                     DS.attr({defaultValue: () => []}),
  relatedSponsors:                  DS.attr({defaultValue: () => []}),

  sensitiveContent:   DS.attr('boolean'),
  showAsFeature:      DS.attr('boolean'),

  sponsoredContent: DS.attr('boolean'),

  tags:        DS.attr({defaultValue: () => []}),
  updatedDate: DS.attr('moment', {timezoneOverride: true}),
  updateDate: DS.attr('moment', {timezoneOverride: true}),

  updated_date: DS.attr('moment', {
    timezoneOverride: true,
  }),

  url: DS.attr('string'),
  canonicalUrl: DS.attr('string'),

  // computed
  modifiedMoment: reads('updatedDate'),

  section: computed('ancestry', function() {
    if (!this.ancestry || !this.ancestry.length) {
      return {};
    }
    const NEAREST_SECTION = this.ancestry.findBy('meta.type', SECTION_PAGE_TYPE);

    if (NEAREST_SECTION) {
      return {
        title: NEAREST_SECTION.title,
        slug: NEAREST_SECTION.slug,
        id: NEAREST_SECTION.id,
      };
    } else {
      return {};
    }
  }),

  hasMain: reads('showAsFeature'),

  hasGallery: computed('leadAsset', function() {
    return this.leadAsset ? this.leadAsset.type === LEAD_GALLERY : false;
  }),
  hasVideo: computed('leadAsset', function() {
    return this.leadAsset ? this.leadAsset.type === LEAD_VIDEO : false;
  }),
  hasAudio: computed('leadAsset', function() {
    return this.leadAsset ? this.leadAsset.type === LEAD_AUDIO : false;
  }),
  idForComments: or('legacyId', 'uuid'),

  breadcrumb: computed('section', function() {
    if (!this.section.slug) {
      return;
    }
    let breadcrumb = [{
      route: ['sections', this.section.slug],
      label: this.section.title
    }];
    if (this.isSponsored) {
      breadcrumb.push({label: 'Sponsored'});
    }
    if (this.isOpinion) {
      breadcrumb.push({label: 'Opinion', route: ['tags', 'opinion']});
    }
    if (this.isAnalysis) {
      breadcrumb.push({label: 'Analysis', route: ['tags', 'analysis']});
    }
    // HACK
    if (this.tags.mapBy('name').includes('we the commuters')) {
      breadcrumb.push({label: 'We the Commuters', route: ['tags', 'wethecommuters']});
    }
    return breadcrumb;
  }),

  authors: computed('relatedAuthors', function() {
    return this.relatedAuthors.map(author => ({
      name: `${author.first_name} ${author.last_name}`,
      route: ['author-detail', author.slug],
      url: author.slug && this.router.urlFor('author-detail', author.slug),
      org: author.contributing_organization,
    }));
  }),

  // MAPPINGS
  isSponsored: reads('sponsoredContent'),

  isOpinion: computed('tags', function() {
    return this.tags.mapBy('name').includes('@opinion') || this.tags.mapBy('name').includes('opinion');
  }),
  isAnalysis: computed('tags', function() {
    return this.tags.mapBy('name').includes('@analysis') || this.tags.mapBy('name').includes('analysis');
  }),

  thumbnail: computed('leadImage', 'listingImage', function() {
    if (this.listingImage) {
      return camelizeObject(this.listingImage);
    } else if (this.leadImage && this.leadImage.image) {
      return camelizeObject(this.leadImage.image);
    }
  }),

  hasLead: bool('leadAsset'),

  leadImage: computed('leadAsset', function() {
    if (!this.leadAsset) {
      return;
    }
    switch(this.leadAsset.type) {
      case LEAD_IMAGE:
        return {
          image: camelizeObject(this.leadAsset.value.image),
          caption: this.leadAsset.value.caption,
        }
      default:
        if (this.leadAsset.value.default_image) {
          return {
            image: camelizeObject(this.leadAsset.value.default_image),
            caption: this.leadAsset.value.caption,
          };
        }
    }
  }),
  leadImageLink: reads('leadAsset.value.image_link'),

  ogImage: computed('socialImage', 'leadImage', function() {
    return this.socialImage || (this.leadImage && this.leadImage.image);
  }),

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.name.match(/^@/));
  }),
  internalTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags
      .filter(tag => tag.name.match(/^@/))
      .map(tag => tag.name.replace(/^@/,''));
  }),
  adBindings: AD_BINDINGS,
  racy: computed('provocativeContent', function() {
    // DFP does not like primitive booleans for targeting
    return this.provocativeContent ? 'true': '';
  }),
  sponsorNames: computed('relatedSponsors', function() {
    return this.relatedSponsors.mapBy('name').join(',');
  }),
  adTags: computed('tags', function() {
    return this.tags.mapBy('name');
  }),

  // compute `path` for article so it doesn't include the `section` slug
  // this is so we can easily create link-tos and compensate
  // for neste url structures
  path: computed('meta.html_url', 'section', function() {
    if (this.meta) {
      let path = extractPath(this.meta.html_url);
      // strip out the section
      return path.replace(`${this.section.slug}/`, '');
    }
  }),

  // for comments and share dialogs
  permalink: reads('url'),

  // relationships
  gallery: DS.belongsTo({async: true}),

});
