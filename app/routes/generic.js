import Route from "@ember/routing/route";

export default Route.extend({
  model({ wildcard }) {
    return this.store.queryRecord("page", {
      html_path: wildcard,
    });
  },
  afterModel(model, transition) {
    switch (model.constructor.modelName) {
      case "information":
        this.transitionTo("information", {
          informationPagePath: transition.to.params.wildcard,
          page: model,
        });
        break;
      default: {
        // If specific page type is not returned, assume it is a top-level section (news, food, etc.)
        let newTransition = this.transitionTo(
          "sections",
          transition.to.params.wildcard
        );
        newTransition.data.pageId = model.id;
      }
    }
  },
});
