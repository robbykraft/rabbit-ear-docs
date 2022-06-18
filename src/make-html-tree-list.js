const makeFlair = (node) => [
		node.simpleObject ? `<img src="./C.svg" />` : "",
		// node.staticType === "Boolean" || node.staticType === "Number" || node.staticType === "String" || node.staticType === "Array" ? `<img src="./C.svg" />` : "",
		node.staticType === "Function" ? `<img src="./F.svg" />` : "",
		node.staticType === "Function" && node.staticChildren ? `<img src="./S.svg" />` : ""
	].join("");

const treeToList = (tree, expandPath = [], path=[], depth = 0) => {
	// const hasChildren = (tree.staticChildren || tree.instanceChildren) && !tree.simpleObject;
	const pathNext = tree.hasOwnPage ? [...path, tree.key] : path;
	const isExpanded = expandPath.length >= pathNext.length && pathNext
		.map((p, i) => p === expandPath[i])
		.reduce((a, b) => a && b, true);
	const indent0 = "  ".repeat(depth * 2);
	const indent1 = "  ".repeat(depth * 2 + 1);
	const itemName = tree.hasOwnPage
		? `<a href="${pathNext.join(".")}.html">${tree.key}</a>`
		: `<a href="${pathNext.join(".")}.html#${tree.key.toLowerCase()}">${tree.key}</a>`;
	if (!tree.isExpandable) {
		return `${indent0}<li>${itemName}${makeFlair(tree)}</li>`;
	}
	const children = [tree.staticChildren, tree.instanceChildren]
		.filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []);
	const liStart = isExpanded
		? `${indent0}<li><span class="caret caret-down">${itemName}</span>${makeFlair(tree)}`
		: `${indent0}<li><span class="caret">${itemName}</span>${makeFlair(tree)}`;
	const liEnd = `${indent0}</li>`;
	const ulStart = isExpanded
		? `${indent1}<ul class="nested active">`
		: `${indent1}<ul class="nested">`;
	const ulEnd = `${indent1}</ul>`;
	const childrenList = children.map(el => treeToList(el, expandPath, pathNext, depth+1)).join("\n")
	return [liStart, ulStart, childrenList, ulEnd, liEnd].join("\n");
};

const makeHTMLTreeList = (tree, expandPath) => {
	const ulStart = `<ul id="tree-start">`
	const ulEnd = `</ul>`
	return [ulStart, treeToList(tree, expandPath), ulEnd].join("\n");
};

module.exports = makeHTMLTreeList;

// <ul id="tree-start">
// 	<li><span class="caret">ear</span>
// 		<ul class="nested">
// 			<li><span class="caret">ear.math</span>
// 				<ul class="nested">
// 					<li>add</li>
// 					<li>add2</li>
// 					<li><span class="caret">average</span>
// 						<ul class="nested">
// 							<li>inside</li>
// 						</ul>
// 					</li>
// 					<li>bounding_box</li>
// 				</ul>
// 			</li>
// 		</ul>
// 	</li>
// </ul>
