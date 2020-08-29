import Route from "@ember/routing/route";
import RSVP from 'rsvp';

const { hash } = RSVP;

export default Route.extend({
  model(params) {
    return this.store.queryRecord("page", {
      html_path: Object.values(params).join('/'),
    });
  },
  async afterModel(model, transition) {
    let pageUrl = Object.values(transition.to.params).join('/')
    switch (model.constructor.modelName) {
      case "information":
        this.replaceWith(
          "information",
          {
            informationPagePath: pageUrl,
            page: model,
          },
          {
            queryParams: transition.to.queryParams,
          }
        );
        break;
      case "article": {
        let newTransition = this.replaceWith(
          "article",
          await hash({
            section: transition.to.params.wildcard,
            path: transition.to.params.path,
            article: model,
            gallery: model.gallery,
          }),
          {
            queryParams: transition.to.queryParams,
          }
        );
        newTransition.data.pageId = model.id;
        break;
      }
      default: {
        // If specific page type is not returned, assume it is a top-level section (news, food, etc.)
        let newTransition = this.replaceWith(
          "sections",
          transition.to.params.wildcard,
          {
            queryParams: transition.to.queryParams,
          }
        );
        newTransition.data.pageId = model.id;
      }
    }
  },
});
