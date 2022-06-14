
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

// const treeToList = (tree, depth = 0) => {
// 	const indent0 = "  ".repeat(depth);
// 	const indent1 = "  ".repeat(depth + 1);
// 	const hasChildren = tree.staticChildren || tree.instanceChildren;
// 	// console.log("hasChildren", hasChildren);
// 	if (!hasChildren) {
// 		return `${indent0}<li>${tree.key}</li>\n`;
// 	}
// 	const children = [tree.staticChildren, tree.instanceChildren]
// 		.filter(a => a !== undefined)
// 		.reduce((a, b) => a.concat(b), []);
// 	const start = depth === 0
// 		? `${indent0}<ul id="tree-start">\n${indent1}<li><span class="caret">${tree.key}</span>\n`
// 		: `${indent0}<ul class="nested">\n${indent1}<li><span class="caret">${tree.key}</span>\n`;
// 	const end = `${indent1}</li>\n${indent0}</ul>\n`;
// 	return `${start}${children.map(el => treeToList(el, depth+1)).join("")}${end}`;
// };

const treeToList = (tree, path=[], depth = 0) => {
	const indent0 = "  ".repeat(depth * 2);
	const indent1 = "  ".repeat(depth * 2 + 1);
	const hasChildren = tree.staticChildren || tree.instanceChildren;
	// console.log("hasChildren", hasChildren);
	const itemName = hasChildren
		? `<a href="${[...path, tree.key].join(".")}.html">${tree.key}</a>`
		: `<a href="${path.join(".")}.html#${tree.key}">${tree.key}</a>`;
	if (!hasChildren) {
		return `${indent0}<li>${itemName}</li>`;
	}
	const children = [tree.staticChildren, tree.instanceChildren]
		.filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []);
	const liStart = depth === 0
		? `${indent0}<li><span class="caret caret-down">${itemName}</span>`
		: `${indent0}<li><span class="caret">${itemName}</span>`;
	const liEnd = `${indent0}</li>`;
	const ulStart = depth === 0
		? `${indent1}<ul class="nested active">`
		: `${indent1}<ul class="nested">`;
	const ulEnd = `${indent1}</ul>`;
	const childrenList = children.map(el => treeToList(el, [...path, tree.key], depth+1)).join("\n")
	return [liStart, ulStart, childrenList, ulEnd, liEnd].join("\n");
};

const makeList = (tree) => {
	const ulStart = `<ul id="tree-start">`
	const ulEnd = `</ul>`
	return [ulStart, treeToList(tree), ulEnd].join("\n");
}


module.exports = makeList;