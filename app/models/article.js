import DS from 'ember-data';
import Page from './page';
import { computed } from '@ember/object';
import { reads, bool } from '@ember/object/computed';


export const SECTION_PAGE_TYPE = 'standardpages.IndexPage';

export const LEAD_GALLERY = 'lead_gallery';
export const LEAD_VIDEO   = 'lead_video';
export const LEAD_AUDIO   = 'lead_audio';
export const LEAD_IMAGE   = 'lead_image';

export default Page.extend({
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

  relatedAuthors:                   DS.attr({defaultValue: () => []}),
  relatedContributingOrganizations: DS.attr({defaultValue: () => []}),
  relatedLinks:                     DS.attr({defaultValue: () => []}),
  relatedSponsors:                  DS.attr({defaultValue: () => []}),

  sensitiveContent:   DS.attr('boolean'),
  showAsFeature:      DS.attr('boolean'),

  sponsoredContent: DS.attr('boolean'),

  tags:        DS.attr({defaultValue: () => []}),
  updatedDate: DS.attr('moment', {timezoneOverride: true}),

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
  moveableTypeId: reads('legacyId'),

  breadcrumb: computed('section', function() {
    return;
    // if (!this.section.slug) {
    //   return;
    // }
    // let breadcrumb = [{
    //   route: ['sections', this.section.slug],
    //   label: this.section.title
    // }];
    // if (this.isSponsored) {
    //   breadcrumb.push({label: 'Sponsored'});
    // }
    // if (this.isOpinion) {
    //   breadcrumb.push({label: 'Opinion', route: ['tags', 'opinion']});
    // }
    // if (this.isAnalysis) {
    //   breadcrumb.push({label: 'Analysis', route: ['tags', 'analysis']});
    // }
    //
    // // HACK
    // if (this.tags.includes('we the commuters')) {
    //   breadcrumb.push({label: 'We the Commuters', route: ['tags', 'wethecommuters']});
    // }
    // return breadcrumb;
  }),

  authors: computed('authorNickname', function() {
    return [{
      name: this.authorNickname,
      route: ['author-detail', this.authorNickname],
    }]
  }),

  // MAPPINGS
  isSponsored: reads('sponsoredContent'),

  isOpinion: computed('tags', function() {
    return this.tags.includes('@opinion') || this.tags.includes('opinion');
  }),
  isAnalysis: computed('tags', function() {
    return this.tags.includes('@analysis') || this.tags.includes('analysis');
  }),

  thumbnail: computed('leadImage', 'listingImage', function() {
    if (this.listingImage) {
      return {id: this.listingImage.id};
    } else if (this.leadImage && this.leadImage.image) {
      return {id: this.leadImage.image};
    }
  }),

  hasLead: bool('leadAsset'),

  leadImage: computed('leadAsset', function() {
    if (!this.leadAsset) {
      return;
    }
    switch(this.leadAsset.type) {
      case LEAD_IMAGE:
        return this.leadAsset.value;
      default:
        return {
          image: this.leadAsset.value.default_image
        };
    }
  }),
  leadImageCaption: reads('leadImage.caption'),
  leadImageCredit:  reads('leadImage.credit'),
  leadImageAlt:     reads('leadImage.alt'),
  // leadImageLink:    reads('_parsedLegacyContent.leadImageLink'),

  displayTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags.filter(tag => !tag.match(/^@/));
  }),
  internalTags: computed('tags', function() {
    let tags = this.tags || [];
    return tags
      .filter(tag => tag.match(/^@/))
      .map(tag => tag.replace(/^@/,''));
  }),
  adBindings: computed(function() {
    return ['internalTags:tags','section.slug:Category'];
  }),
});
