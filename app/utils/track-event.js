const trackEvent = function({category, action, label, value, nonInteraction=false}) {
  if (window && window.dataLayer) {
    window.dataLayer.push({
      event: "eventTracking",
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      nonInteraction
    });
  }
}

export default trackEvent;
