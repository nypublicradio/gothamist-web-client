import { modifier } from 'ember-modifier';

export default modifier(function trackImpression(element/*, params, hash*/) {
  let eventCategory = element.dataset.category;
  let eventAction = element.dataset.action;
  let eventLabel = element.dataset.label;

  function trackImpression() {
    if (window.dataLayer && !element.dataset.viewed) {
      window.dataLayer.push({
        event: "impression",
        eventCategory,
        eventAction,
        eventLabel,
        nonInteraction: true
      })
      element.dataset.viewed = true;
    }
  }
  function elementIntersectionChanged(changes/*, observer*/) {
    changes.forEach(change => {
      if (change.intersectionRatio >= 0.75) {
        trackImpression();
      }
    });
  }
  function routeChanged() {
    // reset impression when route changes
    delete element.dataset.viewed;
  }

  window.addEventListener('routeChange', routeChanged);

  if ('IntersectionObserver' in window) {
    let options = {
        root: null, //viewport
        rootMargin: '0px',
        threshold: 0.75
    };
    let observer = new IntersectionObserver(elementIntersectionChanged, options);
    observer.observe(element);

    return () => observer.disconnect();
  }
});
