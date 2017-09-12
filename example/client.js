var DOMInspector = require('../dom-inspector');

var iframe = document.getElementById('iframe').contentDocument;
iframe.body.innerHTML = `
<html>
	<head>
		<link href="iframe.css" rel="stylesheet">
	</head>
	<body>
	</body>
</html>
`;
var DOMObserver = new DOMInspector.Observer(document, {highlightClass: '_highlighted_'});
var tree = DOMObserver.tree();
var vDOM = new DOMInspector.VDOM(tree, {validateView: (node) => {
	if (node.nodeName === '#text') {
		if (node.nodeValue.trim().length === 0) {
			node.view.classList.add('hidden');
		}
	}
}});
var view = vDOM.view();
iframe.body.appendChild(view);
DOMObserver.initMutationObserver((updates) => {
	vDOM.ingestUpdates(updates);
});
DOMObserver.startMutationObserver();

var selectedNode;
function selectNode(node) {
	if (selectedNode) {
		selectedNode.view.classList.remove('selected');
	}
	node.view.classList.add('selected');
	selectedNode = node;

	var path = vDOM.pathForNode(node);
	DOMObserver.highlightElement(path);
}

view.addEventListener('click', (event) => {
	var node = vDOM.nodeForView(event.target);
	selectNode(node);
	node.view.classList.toggle('expanded');
});

document.addEventListener('click', (event) => {
	var path = DOMObserver.pathForNode(event.target);
	var node = vDOM.nodeAtPath(path);
	selectNode(node);
	while (node) {
		node.view.classList.add('expanded');
		node = node.parentNode;
	}
});
