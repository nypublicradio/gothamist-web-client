import DS from 'ember-data';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { WAGTAIL_MODEL_TYPE as ARTICLE_TYPE } from '../models/article';
import { WAGTAIL_MODEL_TYPE as GALLERY_TYPE } from '../models/gallery';
import { WAGTAIL_MODEL_TYPE as INFORMATION_TYPE } from '../models/information';
import { WAGTAIL_MODEL_TYPE as TAG_TYPE } from '../models/tag';
import { getArticlesfromStreamfield } from '../routes/tags';
import RSVP from 'rsvp';
const { hash, resolve } = RSVP;
const { log } = console;


export default Route.extend({
  fastboot: inject(),
  model({ identifier, token }) {
    let isFastBoot = this.fastboot.isFastBoot;
    if (isFastBoot) {
      this.fastboot.response.headers.set('Cache-Control', 'no-cache');
    }
    return this.store.queryRecord('page', {identifier, token},
      {adapterOptions: {preview: true}}
    );
  },
  renderTemplate(controller, model) {
    switch(get(model, 'meta.type')) {
      case ARTICLE_TYPE:
        this.controllerFor('article').set('isPreview', true);
        hash({
          article: model,
          gallery: resolve(model.gallery)
            .catch(() => log('gallery not found')),
        }).then(model => {
          this.render('article', { model })
        });
        break;
      case GALLERY_TYPE:
        this.controllerFor('gallery').set('isPreview', true);
        hash({
          gallery: model,
          articles: model.relatedArticles,
        }).then(model => {
          this.render('gallery', { model })
        });
        break;
      case TAG_TYPE:
        this.controllerFor('application').set('mainRouteClasses', 'tags-page')
        this.controllerFor('page').set('isPreview', true);
        hash({
          tag: model.get('slug'),
          title: model.get('slug').replace(/-/g, ' '),
          page: model,
          articles: this.store.query('article', {
            tag_slug: model.get('slug'),
            limit: 12,
          })
        }).then(results => {
          // if tag has no articles with and no curated page, throw a 404 error
          if (results.articles.length === 0 && results.page === {}) {
            let e = new DS.NotFoundError();
            e.url = `tags/${results.tag}`;
            throw e;
          }

          if (results.articles.length > 0) {
            // get real tag name from first article
            results.title = results.articles.firstObject.tags.findBy('slug', results.tag)['name'];
            // meta info from the query results used by the load more results component
            results.meta = results.articles.meta
          } else {
            results.meta = { count: 0 }
          }

          // get a list of featured articles found in collections in the curated page streamfields
          if (results.page) {
            let topFeaturedArticles = results.page.hasTopPageZone ? getArticlesfromStreamfield(results.page.topPageZone) : [];
            let midFeaturedArticles = results.page.hasMidpageZone ? getArticlesfromStreamfield(results.page.midpageZone) : [];
            results.featuredArticles = topFeaturedArticles.concat(midFeaturedArticles)
          } else {
            results.featuredArticles = []
          }

          // remove featured articles from the main list of articles
          results.articles = results.articles.filter((article) => {
            return !results.featuredArticles.map(a => a.id).includes(article.id)
          });

          return results;
        }).then(model => {
          this.render('tags', { model })
        });
        break;
      case INFORMATION_TYPE:
        this.controllerFor('information').set('isPreview', true);
        hash({
          page: model,
        }).then(model => {
          this.render('information', { model })
        });
        break;
      default:
        this._super(...arguments);
    }
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('isPreview', true);
  },
});
