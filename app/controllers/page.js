import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { inject } from "@ember/service";

export default Controller.extend({
  router: inject(),

  // Accepts all queryParams, including those not known in advance
  queryParams: computed("router.location", function () {
    let qp = this.get("router.location").getURL().split("?")[1];
    if (qp) {
      let qpAsObj = JSON.parse(
        '{"' +
          decodeURI(qp)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      return [...Object.keys(qpAsObj), "to"];
    }
    return ["to"];
  }),
});
