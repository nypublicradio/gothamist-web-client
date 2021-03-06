import { modifier } from 'ember-modifier';
import { debounce } from '@ember/runloop';
import trackEvent from '../utils/track-event'


export default modifier(function trackScrollDepth(element, [label]/*, params, hash*/) {
  const milestones = [0.25,0.50,0.75,1];
  let watching = [];

  function resetTrackedMilestones() {
    watching = milestones.slice(0);
  }

  function trackScrollDepth(threshold) {
    let percentScrolled = threshold * 100;
    trackEvent({
      category: 'NTG article milestone',
      action: `${percentScrolled}%`,
      label: label,
      value: percentScrolled,
      nonInteraction: true
    })
  }

  function handleScrollChanges() {
    debounce(this, () => {
      let target = element;
      if (!target) {
        target = document.body;
      }
      let distanceToTargetBottom = target.offsetHeight + target.offsetTop;
      let parent = target.offsetParent;
      while(parent) {
        distanceToTargetBottom += parent.offsetTop;
        parent = parent.offsetParent;
      }

      let scrolled = window.pageYOffset;
      let windowHeight = window.innerHeight;
      let progress = scrolled / (distanceToTargetBottom - windowHeight);
      watching.forEach(function(threshold, index) {
        if (progress > threshold) {
          trackScrollDepth(threshold);
          watching.splice(index, 1);
        }
      });
    }, 200);
  }

  resetTrackedMilestones();
  window.addEventListener('routeChange', resetTrackedMilestones);
  window.addEventListener('scroll', handleScrollChanges, {passive: true});
  window.addEventListener('resize', handleScrollChanges);

  return () => {
    window.removeEventListener('routeChange', resetTrackedMilestones);
    window.removeEventListener('scroll', handleScrollChanges, {passive: true});
    window.removeEventListener('resize', handleScrollChanges);
  }
});
