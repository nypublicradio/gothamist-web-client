import moment from 'moment';

import DS from 'ember-data';
import { computed } from '@ember/object';
import { reads, bool } from '@ember/object/computed';


export const LEAD_GALLERY = 'lead_gallery';
export const LEAD_VIDEO   = 'lead_video';
export const LEAD_AUDIO   = 'lead_audio';
export const LEAD_IMAGE   = 'lead_image';

export default DS.Model.extend({
  body:        DS.attr('string'),
  description: DS.attr('string'),

  disableComments: DS.attr('boolean'),

  leadAsset:      DS.attr(),

  legacyId:       DS.attr('string'),

  listingImage:   DS.attr(),
  listingSummary: DS.attr('string'),
  listingTitle:   DS.attr('string'),

  meta: DS.attr(),

  publicationDate: DS.attr('moment', {
    utc: true,
  }),

  relatedAuthors:                   DS.attr({defaultValue: () => []}),
  relatedContributingOrganizations: DS.attr({defaultValue: () => []}),
  relatedLinks:                     DS.attr({defaultValue: () => []}),
  relatedSponsors:                  DS.attr({defaultValue: () => []}),

  sensitiveContent:   DS.attr('boolean'),
  showAsFeature:      DS.attr('boolean'),
  showOnIndexListing: DS.attr('boolean'),

  socialImage: DS.attr(),
  socialText:  DS.attr('string'),
  socialTitle: DS.attr('string'),

  sponsoredContent: DS.attr('boolean'),

  tags:        DS.attr({defaultValue: () => []}),
  title:       DS.attr('string', {defaultValue: ''}),
  updatedDate: DS.attr('moment', {utc: true}),

  // computed
  path: computed('meta.html_url', function() {
    let [, path] = this.meta.html_url.split('/', 1);
    return path;
  }),
  publishedMoment: computed('meta.first_published_at', 'publicationDate', function() {
    return this.publicationDate || moment.utc(this.meta.first_published_at);
  }),
  modifiedMoment: reads('updatedDate'),

  section: computed('categories', function() {
    // TBD implemented
    return '';
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
    // if (!this.section.basename) {
    //   return;
    // }
    // let breadcrumb = [{
    //   route: ['sections', this.section.basename],
    //   label: this.section.label
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

  hasLead: bool('leadAsset'),

  leadImage: computed('leadAsset', function() {
    if (this.leadAsset && this.leadAsset.type === LEAD_IMAGE) {
      return this.leadAsset.value;
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
    return ['internalTags:tags','section.basename:Category'];
  }),
});
