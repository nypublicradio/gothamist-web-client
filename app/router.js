import EmberRouter from '@ember/routing/router';
import { inject } from '@ember/service';
import config from './config/environment';

const Router = EmberRouter.extend({
  headData: inject(),
  location: config.locationType,
  rootURL: config.rootURL,

  setTitle(title) {
    this.headData.set('title', title);
  }
});

Router.map(function() {
  this.route('404', {path: '*'});

  this.route('article', {path: '*any'}, function() {
    this.route('gallery');
  });
  this.route('search');
  this.route('tags', {path: 'tags/:tag'});
  this.route('popular');
  this.route('sections', {path: 'sections/:section'});
  this.route('staff', function() {
    this.route('detail', {path: ':name'});
  });

  this.route('contact');

  this.route('500', {path: 'server-error'});
});

export default Router;
