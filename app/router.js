import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('404', {path: '*'});

  this.route('story', {path: '*any'});
  this.route('search');
  this.route('tags', {path: 'tags/:tag'});
});

export default Router;
