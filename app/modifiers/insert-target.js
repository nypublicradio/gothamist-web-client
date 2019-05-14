import functionalModifier from 'ember-functional-modifiers';

function countWords(node) {
  let text = node.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
}

const embeds = ['iframe', 'embed', 'video', 'twitter-widget', 'center'];
const dontInsertBefore = ['blockquote', ...embeds];
const dontInsertAfter = ['h1', 'h2', 'h3', 'h4', 'h5', ...embeds];

export function insertTarget(element, [id], {wordBoundary=300, containerSelector}) {
  let container = document.querySelector(containerSelector) || element;
  let nodes = [...container.childNodes].filter(node => {
    // ignore whitespace only text and P nodes.
    return !(['#text', 'P'].includes(node.nodeName)
      && node.textContent.replace(/\s/g, '').length === 0);
  });
  let wordCount = 0;
  let boundary = nodes.find((node, index) => {
    wordCount += countWords(node);

    let currentTag = node.nodeName.toLowerCase();
    let nextNode = nodes[index+1];
    let nextTag =  nextNode && nextNode.nodeName.toLowerCase();

    if (wordCount >= wordBoundary
      && !dontInsertAfter.includes(currentTag)
      && !dontInsertBefore.includes(nextTag)) {
      return node;
    }
  })
  if (boundary) {
    let target = document.createElement('DIV');
    target.id = id;
    let parent = boundary.parentNode;
    let next = boundary.nextSibling;
    if (next) {
      parent.insertBefore(target, next);
    } else {
      parent.appendChild(target);
    }
  }
}

export default functionalModifier(insertTarget);
