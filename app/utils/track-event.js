const trackEvent = function(params, {event, category, action, label, nonInteraction=false}) {
  if (window && window.dataLayer) {
    window.dataLayer.push({
      event,
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      nonInteraction
    });
  }
}

export default trackEvent;
