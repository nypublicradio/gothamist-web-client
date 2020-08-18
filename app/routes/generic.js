import Route from "@ember/routing/route";

export default Route.extend({
  model({ wildcard }) {
    return this.store.queryRecord("page", {
      html_path: wildcard
    });
  },
  afterModel (model, transition) {
    // Section page should not render non-IndexPages, and therefore redirects
    // to the 404 page, which handles generics
    if (model.meta && (model.meta.type === "standardpages.IndexPage")) {
      let newTransition = this.transitionTo('sections', transition.to.params.wildcard)
      newTransition.data.pageId = model.id
    }
  }
});
