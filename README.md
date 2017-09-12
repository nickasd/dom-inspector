# DOM Inspector
A DOM Inspector that runs in the browser.

## Usage

Visualizing the DOM:

```javascript
var DOMInspector = require('dom-inspector');

// initialize the DOM observer
var DOMObserver = new DOMInspector.Observer(document);

// initialize the vDOM
var tree = DOMObserver.tree();
var vDOM = new DOMInspector.VDOM(tree);

// visualize the vDOM in an iframe or another document
// otherwise mutations will trigger an infinite recursion
var view = vDOM.view();
var iframe = document.getElementById('iframe').contentDocument;
iframe.body.appendChild(view);

// start observing the DOM
DOMObserver.initMutationObserver((updates) => {
	vDOM.ingestUpdates(updates);
});
DOMObserver.startMutationObserver();
```

Selecting a node in the vDOM and highlighting the corresponding node in the DOM:

```javascript
var selectedNode;
function selectNode(node) {
	// select the node in the vDOM
	if (selectedNode) {
		selectedNode.view.classList.remove('selected');
	}
	node.view.classList.add('selected');
	selectedNode = node;

	// highlight the corresponding node in the DOM
	var path = vDOM.pathForNode(node);
	DOMObserver.highlightElement(path);
}

// listen to clicks in the outline
view.addEventListener('click', (event) => {
	var node = vDOM.nodeForView(event.target);
	selectNode(node);
	// expand the node
	node.view.classList.toggle('expanded');
});

// listen to clicks in the document
document.addEventListener('click', (event) => {
	var path = DOMObserver.pathForNode(event.target);
	var node = vDOM.nodeAtPath(path);
	selectNode(node);
	// expand the node and its ancestors
	while (node) {
		node.view.classList.add('expanded');
		node = node.parentNode;
	}
});
```

A full
example is available at [example](https://github.com/nickasd/dom-inspector/tree/master/example).

## Install with NPM

```
npm install https://github.com/nickasd/dom-inspector
```

## Try it out

```
npm install
npm start
// in the browser
open http://localhost:8080
```

Try clicking somewhere in the document (left) or selecting a node from the outline (right): the corresponding node will be selected/highlighted.
