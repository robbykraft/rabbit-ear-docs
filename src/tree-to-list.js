
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

const treeToList = (tree, path=[], depth = 0) => {
	const indent0 = "  ".repeat(depth * 2);
	const indent1 = "  ".repeat(depth * 2 + 1);
	const hasChildren = tree.staticChildren || tree.instanceChildren;
	const itemName = hasChildren
		? `<a href="${[...path, tree.key].join(".")}.html">${tree.key}</a>`
		: `<a href="${path.join(".")}.html#${tree.key.toLowerCase()}">${tree.key}</a>`;
	const flair = [
		tree.type === "boolean" || tree.type === "number" || tree.type === "string" ? `<img src="./C.svg" />` : "",
		tree.type === "function" ? `<img src="./F.svg" />` : "",
		tree.staticChildren ? `<img src="./S.svg" />` : ""
	].join("");
	if (!hasChildren) {
		return `${indent0}<li>${itemName}${flair}</li>`;
	}
	const children = [tree.staticChildren, tree.instanceChildren]
		.filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []);
	const liStart = depth === 0
		? `${indent0}<li><span class="caret caret-down">${itemName}</span>${flair}`
		: `${indent0}<li><span class="caret">${itemName}</span>${flair}`;
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
};

module.exports = makeList;
