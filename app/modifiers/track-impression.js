import { modifier } from 'ember-modifier';
import trackEvent from '../utils/track-event';

export default modifier(function trackImpression(element/*, params, hash*/) {
  let category = element.dataset.category;
  let action = element.dataset.action;
  let label = element.dataset.label;

  function trackImpression() {
    if (window.dataLayer && !element.dataset.viewed) {
      trackEvent({
        event: "impression",
        category,
        action,
        label,
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

  function clearViewedStatus() {
    delete element.dataset.viewed;
  }

  if ('IntersectionObserver' in window) {
    window.addEventListener('routeChange', clearViewedStatus);
    let options = {
        root: null, //viewport
        rootMargin: '0px',
        threshold: 0.75
    };
    let observer = new IntersectionObserver(elementIntersectionChanged, options);
    observer.observe(element);

    // cleanup
    return () => {
      window.removeEventListener('routeChange', clearViewedStatus);
      observer.disconnect();
    }
  }
});
