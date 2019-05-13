import functionalModifier from 'ember-functional-modifiers';

function countWords(element) {
  let text = element.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
};

const embeds = ['iframe', 'embed', 'video', 'twitter-widget', 'center'];
const dontInsertBefore = ['blockquote', ...embeds];
const dontInsertAfter = ['h1', 'h2', 'h3', 'h4', 'h5', ...embeds];

export function insertTarget(element, [id], {wordBoundary=300, containerSelector}) {
  let container = document.querySelector(containerSelector) || element;
  let children = container.children;
  let boundary;
  let wordCount = 0;
  [...children].some((child, index) => {
    let currentTag = child.tagName.toLowerCase();
    let nextChild = children[index+1];
    let nextTag =  nextChild && nextChild.tagName.toLowerCase();

    wordCount += countWords(child);
    if (wordCount >= wordBoundary
      && !dontInsertAfter.includes(currentTag)
      && !dontInsertBefore.includes(nextTag)) {
      boundary = child;
      return true;
    }
  })
  if (boundary) {
    boundary.insertAdjacentHTML('afterend', `<div id="${id}"></div>`);
  }
}

export default functionalModifier(insertTarget);
