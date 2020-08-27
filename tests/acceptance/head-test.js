import { module, test } from "qunit";
import { visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | head component", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("puts canonicalUrl in head", async function (assert) {
    const article = await server.create("article", "withSection", {
      text: "foo",
      section: "food",
      canonicalUrl: "http://www.example.com",
    });

    await visit(`/food/${article.slug}`);

    assert
      .dom("link[rel=canonical]", document)
      .hasAttribute("href", "http://www.example.com");
  });

  test("puts original url if no canonicalUrl", async function (assert) {
    const article = await server.create("article", "withSection", {
      text: "foo",
      section: "food",
    });

    await visit(`/food/${article.slug}`);

    assert.notEqual(
      document.querySelector("link[rel=canonical").href,
      "http://www.example.com"
    );
  });
});
