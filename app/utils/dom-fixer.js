/**
  Encapsulates some common DOM repairs

  @class DomFixer
  @param rawText {String}
  @export default
*/
export default class DomFixer {
  constructor(rawText) {
    if (typeof rawText === 'undefined') {
      throw new Error("Must provide a string when initializing");
    }
    const range = document.createRange();
    const nodes = range.createContextualFragment(rawText);

    this.nodes = nodes;
  }

  querySelector(selector) {
    return this.nodes.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.nodes.querySelectorAll(selector);
  }

  /**
    Removes all the empty `#text` nodes found within the DOM tree

    @method removeEmptyNodes
    @return void
  */
  removeEmptyNodes() {
    const whiteWalker = getWhiteWalker(this.nodes);
    const empties = [];

    while(whiteWalker.nextNode()) {
      empties.push(whiteWalker.currentNode);
    }

    empties.forEach(n => n.parentNode.removeChild(n));

    this.emptied = true;
  }

  /**
    Finds all the `#text` nodes that are direct children of the given `root` selector. Gathers adjacent nodes and wraps them under a new `<p/>` tag and inserts it into the tree.

    @method rescueOrphans
    @param root {Node|String} `root` can be a `Node` or a `String`. If it's a string, this will be used as a `querySelectorAll` argument, and the method will run recursively on the result set.
    @param options {Object} `orphanRoot` tag name to serve as a wrapping element for gathered `#text` nodes.
    @return {void}
  */
  rescueOrphans(root = this.nodes, options = {}) {
    if (typeof root === 'string') {
      this.querySelectorAll(root).forEach(this.rescueOrphans.bind(this));
      return;
    }

    if (typeof root === 'object' && arguments.length === 1) {
      options = root;
      root = this.nodes;
    }
    options = {...options, ...DEFAULT_ORPHAN_OPTIONS};
    const orphanWalker = getOrphanWalker(root);

    while(orphanWalker.nextNode()) {
      let node = orphanWalker.currentNode;
      const adjacentOrphans = [];

      while(node && ORPHAN_NODES.includes(node.nodeName)) {
        adjacentOrphans.push(node);
        node = node.nextSibling;
      }

      const orphanRoot = document.createElement(options.orphanRoot);
      // get sibling of final orphan as an insert target
      const target = adjacentOrphans.slice(-1)[0].nextSibling;

      adjacentOrphans.forEach(orphan => orphanRoot.appendChild(orphan));
      root.insertBefore(orphanRoot, target);
    }
  }

  /**
    Finds all paragraphs that contain adjacent line breaks (`<br/>`) and splits it into two paragraphs. Double line breaks are intended to be a new paragraph.

    @method unbreakParagraphs
    @param root {Node} Root node at which to start looking for paragraphs containing double line breaks
    @return {void}
  */
  unbreakParagraphs(root = this.nodes) {
    if (!this.emptied) {
      throw new Error('Empty nodes must be removed before paragraphs can be split.');
    }

    root.childNodes.forEach(child => {
      if (child.nodeName !== 'P') {
        return;
      }
      const GRAF = child;

      // get all the pairs of line breaks
      // filter out any breaks preceded by a `#text` node
      // `br + br` will match on <br> foo <br>
      const adjacentBreaks = [
        ...GRAF.querySelectorAll('br + br')
      ].filter(br => br.previousSibling.nodeName === 'BR')
      .map(br => ([br.previousSibling, br]));

      // for each break boundary
      adjacentBreaks.forEach(([break1, break2]) => {
        let whereIsBreak1 = [...GRAF.childNodes].indexOf(break1);
        let whereIsBreak2 = [...GRAF.childNodes].indexOf(break2);

        const DEEP_CLONE = true;
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');

        // get all the nodes leading up to first break, wrap them in a p tag
        for (let i = 0; i < whereIsBreak1; i++) {
          let node = GRAF.childNodes[i];
          // append a clone so the `childNodes` NodeList isn't mutated
          p1.appendChild(node.cloneNode(DEEP_CLONE));
        }
        // get all the nodes after the second break, wrap them in a p tag
        for (let i = whereIsBreak2 + 1; i < GRAF.childNodes.length; i ++) {
          let node = GRAF.childNodes[i];
          // append a clone so the `childNodes` NodeList isn't mutated
          p2.appendChild(node.cloneNode(DEEP_CLONE));
        }

        // insert them before the graf and remove the graf
        root.insertBefore(p2, GRAF);
        root.insertBefore(p1, p2);
        root.removeChild(GRAF);
      });
    });
  }

  /**
    Finds all matches for given selector and updates any `src` attributes that start with `http://` to `https://`.

    @param selector {String} CSS selector
    @return {void}
  */
  secureSrc(selector) {
    this.querySelectorAll(selector).forEach(node => {
      if (node.src) {
        node.src = node.src.replace(/^http?:/, 'https:');
      }
    })
  }

  /**
    Finds all anchor links within current DOM tree and updates them to open in a new window if they point to a different domain.

    @method externalizeAnchors
    @return {void}
  */
  externalizeAnchors() {
    this.querySelectorAll('a').forEach(anchor => {
      let targetDomain = anchor.host;
      let currentDomain = window.location.host;
      if (targetDomain !== currentDomain) {
        // open in a new window
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener');
      }
    });
  }
}

/**
  Default options for `DomFixer.rescueOrphans` method.

  @const DEFAULT_ORPHAN_OPTIONS
  @type {Object}
*/
const DEFAULT_ORPHAN_OPTIONS = {
  orphanRoot: 'p'
};

/**
  Any node found in this list to be adjacent to an orphan will be included with the orphan when it is given a new root.

  @const ORPHAN_NODES
  @type {Array}
*/
const ORPHAN_NODES = ['SPAN', 'A', 'BR', '#text'];

/**
  Creates a TreeWalker configured to find `#text` nodes that contain only whitespace.

  @function getWhiteWalker
  @param root {Node} root node from which to look below
  @return tree {TreeWalker}
*/
const getWhiteWalker = root =>
  document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node =>
      node.textContent.trim() === '' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  });

/**
  Creates a TreeWalker configured to find `#text` nodes that are one level below the given `root` node, nodes considered to be orphaned.

  @function getOrphanWalker
  @param root {Node}
  @return tree {TreeWalker}
*/
const getOrphanWalker = root =>
  document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => [...root.childNodes].includes(node),
  });
