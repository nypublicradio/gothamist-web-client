import { Modifier } from 'ember-oo-modifiers';

const countWords = function(node) {
  const text = node.textContent
  return text.replace(/[^\w ]/g, "").split(/\s+/).length;
}

const inline = ['a', 'b', 'i', 'em', 'strong'];
const embeds = ['iframe', 'embed', 'video', 'twitter-widget', 'center', 'div'];
const dontInsertBefore = ['blockquote', ...embeds, ...inline];
const dontInsertAfter = ['h1', 'h2', 'h3', 'h4', 'h5', ...embeds, ...inline];

const InsertTargetModifier = Modifier.extend({
  didInsertElement([id], {wordBoundary=300, containerSelector, classNames=[]}) {
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
