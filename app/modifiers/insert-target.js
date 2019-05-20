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
const dontInsertBefore = ['blockquote', ...embeds, ...inline];
const dontInsertAfter = [...headers, ...embeds, ...inline];

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

    @param id:string An html id to apply to
    the created div.

    @param wordBoundary:number Minimum number of
    words before inserting the div.
    @default 150
    @optional

    @param  containerSelector:string CSS selector
    of the container element to attach the div to,
    if not the top level modified element.
    @optional

    @param  classNames:string[] A list of CSS classes
    to apply to the inserted div.
    @default
    @optional
  */
  didInsertElement([id], {wordBoundary=150, containerSelector, classNames=[]}) {
    let container = document.querySelector(containerSelector) || this.element;
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
    let target = this.target = document.createElement('DIV');
    target.id = id;
    classNames.forEach(className => target.classList.add(className));
    if (boundary) {
      let parent = this.parent = boundary.parentNode;
      let next = boundary.nextSibling;
      if (next) {
        parent.insertBefore(target, next);
      } else {
        parent.appendChild(target);
      }
    } else {
      container.appendChild(target);
    }
  },

  willDestroyElement() {
    if (this.parent && this.target) {
      this.parent.removeChild(this.target)
    }
  },

  didReceiveArguments(_,{classNames}) {
    if (classNames) {
      this.target.className = '';
      classNames.forEach(className => this.target.classList.add(className));
    }
  }
});

export default Modifier.modifier(InsertTargetModifier);
