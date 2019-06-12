import { Modifier } from 'ember-oo-modifiers';

const countWords = function(node) {
  const text = node.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
}

const inline = ['a', 'b', 'i', 'em', 'strong'];
const headers = ['h1', 'h2', 'h3', 'h4', 'h5']
const embeds = ['iframe', 'embed', 'video',
                'twitter-widget', 'center', 'div'];
// a `div` tag in MT article markup is probably from an embed
const dontInsertBefore = ['blockquote', ...inline];
const dontInsertAfter = [...headers, ...inline];
const dontInsertBetween = embeds.map(embed => ['p', embed]);

const shouldntInsertBetween = function(current, next) {
  return dontInsertBetween
    .some(([first, second]) => current === first && next === second);
};

const InsertTargetModifier = Modifier.extend({
  /**
    Inserts a div inside the modified element.
    Uses the following rules:
    - Iterate the direct children of the container element.
    - After each child ask:
      - Have i seen at least {wordBoundary} words?
      - Is this element not in the `dontInsertAfter` list?
      - Is the next element not in the `dontInsertBefore` list?
    - If all of these are true, insert the div after the current elementand stop iterating.

    @param {String} [id] An HTML id to apply to
    the created div.

    @param {Number} [wordBoundary=150] Minimum number of
    words before inserting the div.

    @param  {String} [containerSelector] CSS selector
    of the container element to attach the div to,
    if not the top level modified element.

    @param  {String[]} [classNames=[]] A list of CSS classes
    to apply to the inserted div.

    @param {String} [contentsId='0'] Whenever this string changes
    the div is removed and reinserted.

    @param  {Function} [afterInsert] A callback that fires each time
    the div is inserted successfully.
  */
  didInsertElement([id='inserted-target'], {wordBoundary=150, containerSelector, classNames=[], afterInsert, contentsId='0'}) {
    this._insertDiv(id, {wordBoundary, containerSelector, classNames});
    if (afterInsert && this.target) {
      afterInsert(this.target);
    }
    this.contentsId = contentsId
  },

  didReceiveArguments([id='inserted-target'], {wordBoundary=150, containerSelector, classNames=[], afterInsert, contentsId='0'}) {
    this._insertDiv(id, {wordBoundary, containerSelector, classNames});
    if (afterInsert && this.target && contentsId !== this.contentsId) {
      afterInsert(this.target);
    }

    if (classNames && this.target) {
      this.target.className = '';
      this.target.classList.add(...classNames);
    }

    this.contentsId = contentsId;
  },

  _insertDiv(id, {wordBoundary, containerSelector, classNames}) {
    let container = document.querySelector(containerSelector) || this.element;
    let nodes = [...container.childNodes].filter(node => {
      // ignore whitespace only text and P nodes.
      return !(['#text', 'P'].includes(node.nodeName)
        && node.textContent.replace(/\s/g, '').length === 0);
    });
    let wordCount = 0;
    let boundary = nodes.find((node, index) => {
      let currentTag = node.nodeName.toLowerCase();
      let nextNode = nodes[index+1];
      let nextTag =  nextNode && nextNode.nodeName.toLowerCase();

      let wordWeight = countWords(node);
      // count embeds as at least 50 words.
      if (wordWeight < 50 && embeds.includes(currentTag)) {
        wordWeight = 50;
      }
      wordCount += wordWeight;

      if (wordCount >= wordBoundary
        && !dontInsertAfter.includes(currentTag)
        && !dontInsertBefore.includes(nextTag)
        && !shouldntInsertBetween(currentTag, nextTag)) {
        return node;
      }
    })
    let target = this.target || document.createElement('div');
    target.id = id;
    target.className = '';
    target.classList.add(...classNames)
    if (boundary && boundary.nextSibling) {
      container.insertBefore(target, boundary.nextSibling);
    } else {
      container.appendChild(target);
    }
    this.target = target;
    return target;
  }
});

export default Modifier.modifier(InsertTargetModifier);
