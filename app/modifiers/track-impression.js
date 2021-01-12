import { modifier } from 'ember-modifier';

export default modifier(function trackImpression(element/*, params, hash*/) {
  let eventCategory = element.dataset.category;
  let eventAction = element.dataset.action;
  let eventLabel = element.dataset.label;
  function trackImpression() {
    if (window && window.dataLayer && !element.dataset.viewed) {
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
  function onChange(changes, observer) {
    changes.forEach(change => {
      if (change.intersectionRatio >= 1) {
        trackImpression();
        observer.disconnect();
      }
    });
  }
  if (window && 'IntersectionObserver' in window) {
    let options = {
        root: null, //viewport
        rootMargin: '0px',
        threshold: 1.0
    };
    let observer = new IntersectionObserver(onChange, options);
    observer.observe(element);

    return () => observer.disconnect();
  }
});
