// Tag types
const INLINE_TAGS = ['a', 'b', 'i', 'em', 'strong'];
const HEADER_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5']
const EMBED_TAGS = ['iframe', 'embed', 'video',
                'twitter-widget', 'center', 'div'];
// a `div` tag in MT article markup is probably from an embed
const EMBED_WEIGHT = 50;

// Rules for where to avoid inserting ads
const DONT_INSERT_BEFORE = ['blockquote', ...INLINE_TAGS];
const DONT_INSERT_AFTER = [...HEADER_TAGS, ...INLINE_TAGS];
const DONT_INSERT_BETWEEN = EMBED_TAGS.map(embed => ['p', embed]);
function _shouldntInsertBetween(current, next) {
  return DONT_INSERT_BETWEEN
    .some(([first, second]) => current === first && next === second);
}
function _canInsertHere(current, next) {
  return !DONT_INSERT_AFTER.includes(current)
  && !DONT_INSERT_BEFORE.includes(next)
  && !_shouldntInsertBetween(current, next)
}

// Word count helpers
function _countWords(node) {
  const text = node.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
}
function _getWordWeight(node) {
  let tagType = node.nodeName.toLowerCase();
  let wordWeight = _countWords(node);
  if (EMBED_TAGS.includes(tagType)) {
    wordWeight = Math.max(wordWeight, EMBED_WEIGHT);
  }
  return wordWeight;
}

// return false for whitespace only text and P nodes.
function _isNotWhitespaceOnly(node) {
  return !(['#text', 'P'].includes(node.nodeName)
  && node.textContent.replace(/\s/g, '').length === 0);
}

// Insert next to insertLocation, or append the end.
function _insertAtLocation(element, container, insertLocation) {
  if (insertLocation && insertLocation.nextSibling) {
    container.insertBefore(element, insertLocation.nextSibling);
  } else {
    container.appendChild(element);
  }
}

let target = undefined;

/**
  Inserts a div into a story's DOM based on the following rules.

  For each top level child node of `container`, count the words 
  (embeds count as at least 50 words).  When the total word count 
  exceeds the value of `wordsBeforeAd`, insert the div right after that node, unless...

  Unless one of the dontInsertBefore, dontInsertAfter, 
  dontInsertBetween, rules applies. Then continue to the 
  next node and try again.

  If all else fails, insert the div at the very end.

  @function insertAdDiv
  @param divId {String} An id to apply to the inserted div
  @param container {Element} The top level element to insert the 
  ad into
  @param options {Object}
  @param options.wordsBeforeAd {number}  The minimum number of words 
  before inserting the div
  @param options.classNames {string[]}  A list of classes to apply 
  to the inserted Div 
  @return {Element} The inserted div
*/
const insertAdDiv = function(divId, container, { wordsBeforeAd=150, classNames=[] } = {}) {
  let nodes = [...container.childNodes].filter(_isNotWhitespaceOnly)
  let wordCount = 0;

  // Loop through nodes, return the first valid insert location
  let insertLocation = nodes.find((node, index) => {
    let currentTag = node.nodeName.toLowerCase();
    let nextTag = nodes[index+1] && nodes[index+1].nodeName.toLowerCase();

    // Increment the word count
    wordCount = wordCount += _getWordWeight(node);

    // Check if this is a valid insert location
    if (wordCount >= wordsBeforeAd && _canInsertHere(currentTag,nextTag)) {
      return node;
    }
  })
  // Create the target div (or reuse it)
  target = target || document.createElement('div');
  target.id = divId;
  target.className = '';
  target.classList.add(...classNames);

  _insertAtLocation(target, container, insertLocation);
  return target;
}

export default insertAdDiv;
