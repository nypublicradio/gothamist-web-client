// Tag types
const inline = ['a', 'b', 'i', 'em', 'strong'];
const headers = ['h1', 'h2', 'h3', 'h4', 'h5']
const embeds = ['iframe', 'embed', 'video',
                'twitter-widget', 'center', 'div'];
// a `div` tag in MT article markup is probably from an embed

// Rules for where to avoid inserting ads
const dontInsertBefore = ['blockquote', ...inline];
const dontInsertAfter = [...headers, ...inline];
const dontInsertBetween = embeds.map(embed => ['p', embed]);
const shouldntInsertBetween = function(current, next) {
  return dontInsertBetween
    .some(([first, second]) => current === first && next === second);
};
const isValidInsertLocation = function(currentTag, nextTag) {
  return !dontInsertAfter.includes(currentTag)
  && !dontInsertBefore.includes(nextTag)
  && !shouldntInsertBetween(currentTag, nextTag)
}

// Word count helpers
const countWords = function(node) {
  const text = node.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
}
const getWordWeight = function(node) {
  let wordWeight = countWords(node);
  // count embeds as at least 50 words.
  if (wordWeight < 50 && embeds.includes(node.nodeName.toLowerCase())) {
    wordWeight = 50;
  }
  return wordWeight;
}

// Get top level "text" nodes
const getChildNodes = function(container) {
  return [...container.childNodes].filter(node => {
    // ignore whitespace only text and P nodes.
    return !(['#text', 'P'].includes(node.nodeName)
      && node.textContent.replace(/\s/g, '').length === 0);
  });
}

let target = undefined;

/**
  Inserts a div into a story's DOM based on the following rules.

  For each top level text node(a P tag or #text node) child of 
  the first container identified by `containerSelector`, count 
  the words. When the total word count exceeds the value of
  `wordBoundary`, insert the div right after that node, unless...

  Unless one of the dontInsertBefore, dontInsertAfter, 
  dontInsertBetween, rules applies. Then continue to the 
  next node and try again.

  If all else fails, insert the div at the very end.

  @function insertAdDiv
  @param divId {String} An id to apply to the inserted div
  @param container {Element} The top level element to insert the 
  ad into
  @param options {Object}
  @param options.wordBoundary {number}  The minimum number of words 
  before inserting the div
  @param options.classNames {string[]}  A list of classes to apply 
  to the inserted Div 
  @return {Element} The inserted div
*/

const insertAdDiv = function(divId, container, { wordBoundary=150, classNames=[] } = {}) {
  let nodes = getChildNodes(container)
  let wordCount = 0;
  let boundary = nodes.find((node, index) => {
    let currentTag = node.nodeName.toLowerCase();
    let nextNode = nodes[index+1];
    let nextTag = nextNode && nextNode.nodeName.toLowerCase();

    wordCount = wordCount += getWordWeight(node);

    if (wordCount >= wordBoundary && isValidInsertLocation(currentTag, nextTag)) {
      return node;
    }
  })
  target = target || document.createElement('div');
  target.id = divId;
  target.className = '';
  target.classList.add(...classNames)
  if (boundary && boundary.nextSibling) {
    container.insertBefore(target, boundary.nextSibling);
  } else {
    container.appendChild(target);
  }
  return target;
}

export default insertAdDiv;
