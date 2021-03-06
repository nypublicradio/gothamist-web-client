import EmberRouter from '@ember/routing/router';
import { inject } from '@ember/service';
import config from './config/environment';


export const GALLERY_PATH = 'photos';

const Router = EmberRouter.extend({
  headData: inject(),
  location: config.locationType,
  rootURL: config.rootURL,

  setTitle(title) {
    this.headData.set('title', title);
  }
});

Router.map(function() {
  this.route('404', {path: '*wildcard'});
  this.route('500', {path: '*other-error'});

  this.route('gallery', {path: `:section/${GALLERY_PATH}/:slug`});
  this.route('article', {path: ':section/*path'});

  this.route('search');
  this.route('tags', {path: 'tags/:tag'});
  this.route('popular');
  this.route('staff');
  this.route('sections', {path: ':section'});
  this.route('author-detail', {path: 'staff/:slug'});

  this.route('newsletter');
  this.route('preview');

  this.route('information', {path: '*informationPagePath'});

  this.route('generic', {path: ':wildcard'});
  this.route('generic-subpath', {path: ':wildcard/*path'});
});

export default Router;
