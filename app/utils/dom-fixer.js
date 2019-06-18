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
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawText, 'text/html');

    this.nodes = doc.body;
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

    function splitGraf(graf) {

      // get all the pairs of line breaks
      // filter out any breaks preceded by a `#text` node
      // `br + br` will match on <br> foo <br>
      const BREAKS = [
        graf.querySelector('br + br')
      ].filter(Boolean) // remove null values
      .filter(br => br.previousSibling.nodeName === 'BR') // make sure there aren't any text nodes in between
      .map(br => ([br.previousSibling, br])) // grab the previous break
      .reduce((breaks, br) => breaks.concat(br), []); // flatten

      // recursion ended, return given graf, prepped for concatenation
      if (BREAKS.length === 0) {
        return [graf];
      }

      let whereIsBreak1 = [...graf.childNodes].indexOf(BREAKS[0]);
      let whereIsBreak2 = [...graf.childNodes].indexOf(BREAKS[1]);

      const DEEP_CLONE = true;
      const CLEANED_GRAF = document.createElement('p');
      const THE_REST = document.createElement('p');

      // get all the nodes leading up to first break, wrap them in a p tag
      for (let i = 0; i < whereIsBreak1; i++) {
        let node = graf.childNodes[i];
        // append a clone so the `childNodes` we're iterating over isn't mutated
        CLEANED_GRAF.appendChild(node.cloneNode(DEEP_CLONE));
      }

      // get all the nodes after the second break, wrap them in a p tag
      // this will be the new `graf` in the next recursive call
      for (let i = whereIsBreak2 + 1; i < graf.childNodes.length; i ++) {
        let node = graf.childNodes[i];
        // append a clone so the `childNodes` NodeList isn't mutated
        THE_REST.appendChild(node.cloneNode(DEEP_CLONE));
      }

      // hold onto the paragraph w/o no known breaks
      // send the rest of the captured nodes down the recursive path
      return [CLEANED_GRAF].concat(splitGraf(THE_REST));
    }

    root.childNodes.forEach(child => {
      if (child.nodeName !== 'P') {
        return;
      }
      const TARGET_GRAF = child;

      // start with the current paragraph
      // recursively split it at any pair of line breaks found
      const SPLIT_GRAFS = splitGraf(TARGET_GRAF);

      // if there's only 1 graf, nothing was split, so nothing to replace
      if (SPLIT_GRAFS.length > 1) {
        SPLIT_GRAFS.forEach(p => root.insertBefore(p, TARGET_GRAF));
        root.removeChild(TARGET_GRAF);
      }
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

  static removeHTML(string) {
    return string.replace(/(<([^>]+)>)/ig,"");
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
const ORPHAN_NODES = ['SPAN', 'A', 'BR', '#text', 'B', 'I', 'EM', 'STRONG'];

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
