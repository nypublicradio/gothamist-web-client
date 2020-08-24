import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Route.extend({
  header: inject('nypr-o-header'),
  dataLayer: inject('nypr-metrics/data-layer'),
  cookies: inject(),
  headData: inject(),
  metrics: inject(),
  fastboot: inject(),
  sensitive: inject('ad-sensitivity'),

  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken: model => model.page.title,

  afterModel(model) {
    this.headData.setProperties({
      metaDescription: model.page.description,
      ogType: 'information',
      ogTitle: model.page.title, // don't include " - Gothamist" like in <title> tag
      hideFromRobots: !model.page.showOnIndexListing,
    });
  }
});
