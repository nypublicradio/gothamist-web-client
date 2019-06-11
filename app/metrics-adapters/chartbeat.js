import { get } from "@ember/object";
import BaseAdapter from "ember-metrics/metrics-adapters/base";
import canUseDOM from "ember-metrics/utils/can-use-dom";

const derivedSection = section => {
  let s = section ? section.toLowerCase() : "Home";
  return `Gothamist,${s},Gothamist ${s}`;
};

const derivedAuthors = authors => {
  if (authors && authors.length > 0) {
    return authors.map(a => a.name).join(",");
  }
  return "";
};

export default BaseAdapter.extend({
  toStringExtension() {
    return "chartbeat";
  },

  init() {
    const config = get(this, "config") || {};
    const { id, domain, section } = config;

    if (canUseDOM) {
      /* eslint-disable */
      (function() {
        /** CONFIGURATION START **/
        var _sf_async_config = (window._sf_async_config =
          window._sf_async_config || {});

        _sf_async_config.domain = domain;
        _sf_async_config.uid = id;
        _sf_async_config.flickerControl = false;
        _sf_async_config.useCanonical = true;
        _sf_async_config.sections = derivedSection(section);
        _sf_async_config.useCanonicalDomain = true;
        _sf_async_config.authors = "";

        function loadChartbeat() {
          var e = document.createElement("script");
          var n = document.getElementsByTagName("script")[0];
          e.type = "text/javascript";
          e.async = true;
          e.src = "//static.chartbeat.com/js/chartbeat.js";
          n.parentNode.insertBefore(e, n);
        }
        loadChartbeat();
      })();
    }
  },

  trackPage(args) {
    let data = args.pageData || {};

    pSUPERFLY.virtualPage({
      sections: derivedSection(data.sections),
      authors: derivedAuthors(data.authors),
      path: data.path,
      title: data.title
    });
  },

  willDestroy() {
    function removeFromDOM(script) {
      document.querySelectorAll(script).forEach(el => {
        el.parentElement.removeChild(el);
      });
    }

    if (!canUseDOM) {
      return;
    }

    removeFromDOM('script[src*="chartbeat"]');
    delete window._sf_async_config;
  }
});
