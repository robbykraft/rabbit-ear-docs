const ear = require("rabbit-ear");
const xmldom = require("@xmldom/xmldom");

ear.window = xmldom;

const getPrototypeChain = (obj, chain = []) => {
	if (obj == null) { return chain; }
	const proto = Object.getPrototypeOf(obj);
	return proto == null
		? chain
		: getPrototypeChain(proto, [...chain, proto]);
};

const getPrototypeNameChain = (obj, chain = []) => {
	if (obj == null || obj.constructor == null) { return chain; }
	const name = obj.constructor.name
	return name === "Object"
		? [...chain, name]
		: getPrototypeNameChain(Object.getPrototypeOf(obj), [...chain, name]);
};

/**
 * we use obj.constructor.name to get the name of the "type",
 * if constructor doesn't exist, it defaults to "typeof obj"
 */
const getObjectType = (obj) => obj.constructor
	? obj.constructor.name
	: "undefined";
	// : typeof obj

/**
 * filter out the numeric-only keys
 */
const getNonNumericKeys = (obj) => Object.keys(obj)
	.filter(key => !(/^-?\d+\.?\d*$/).test(key));

/**
 * @description sorted list of an object's children's type
 * (type meaning the name of the constructor)
 */
const getChildrenTypes = (obj) => {
	const hash = {};
	getNonNumericKeys(obj)
		.map(key => getObjectType(obj[key]))
		.forEach(type => { hash[type] = true; });
	return Object.keys(hash).sort();
};

// when we encounter a new prototype, add it here.
const prototypes = [];

// we need to get the DOM Element prototype
const ElementInstance = ear.svg();
const Element = ElementInstance.constructor;
const ElementParentPrototype = Object.getPrototypeOf(Element.prototype);

const isUniquePrototype = (proto) => proto !== Function.prototype
	&& proto !== Array.prototype
	&& proto !== Object.prototype
	&& proto !== String.prototype
	&& proto !== Number.prototype
	&& proto !== Boolean.prototype
	&& proto !== Element.prototype
	&& proto !== ElementParentPrototype;


const containsUniquePrototype = (protos = []) => protos
	.map(p => isUniquePrototype(p))
	.reduce((a, b) => a || b, false);
/**
 * @description sort by Constructor type, if they are already equal, by name (key)
 * type sort is not purely alphabetical. it is custom:
 * "undefined"
 * then "Boolean", "Number", "String", "Array" in one group,
 * then "Object",
 * then "Function"
 */
// custom sort
// const typeGroups = {
// 	undefined: "A",
// 	Boolean: "B",
// 	Number: "B",
// 	String: "B",
// 	Array: "B",
// 	Object: "C",
// 	Function: "D",
// };
// unsorted
const typeGroups = {
	undefined: "B", Boolean: "A", Number: "A", String: "A", Array: "A", Object: "A", Function: "B",
};

const sortByTypeAndName = (a, b) => {
	return typeGroups[a.type] === typeGroups[b.type]
		? a.key.localeCompare(b.key)
		: typeGroups[a.type].localeCompare(typeGroups[b.type]);
	// return a.type.localeCompare(b.type) === 0
	// 	? a.key.localeCompare(b.key)
	// 	: a.type.localeCompare(b.type);
};

const removeInvalids = (tree) => {
	if (tree.instanceChildren) {
		tree.instanceChildren = tree.instanceChildren.filter(el => !el.invalid);
	}
	if (tree.staticChildren) {
		tree.staticChildren = tree.staticChildren.filter(el => !el.invalid);
	}
	[...(tree.instanceChildren || []), ...(tree.staticChildren || [])]
		.forEach(child => removeInvalids(child));
};

let catchCount = 0;
const catchFnNames = [];
// todo: dictionary with key:fn-name and value:array of fn-pointers
// prevent duplicate visits to the same function, called from the same object
/**
 * @description keys are fn-names (tree.key) and value is an array.
 * the array contains objects with keys:
 * - depth: {int} the recursive depth at which this was found
 * - obj: the pointer (in memory) to the function/any object
 */
let visited = [];

const hasVisitedAlready = (tree, depth) => {
	const found = visited.filter(el => el.obj === tree).shift();
	// does not yet exist in the history.
	if (!found) { return false; }
	// yes, it exists and it has a depth that outranks this one
	if (found.depth <= depth) { return true; }
	// yes, it exists, but this new depth outranks the old one. remove the previous save
	// set a key "invalid", these will be crawled and removed later
	found.invalid = true;
	// update the visited history to remove the old one.
	visited = visited.filter(el => el.obj !== tree);
	return false;
};

const setVisited = (tree, depth) => {
	visited.push({
		obj: tree,
		depth,
	});
};

const getChildren = (tree, depth = 0) => {
	if (tree == null) { return []; }
	// if (hasVisitedAlready(tree, depth)) {
	// 	console.log("already seen this tree item", typeof tree);
	// 	return [];
	// }
	// setVisited(tree, depth);
	// const structure = { constants: [], functions: [], categories: [] };
	// sort children keys by 1.type 2.key
	const childKeys = getNonNumericKeys(tree)
		.map(key => ({ key, type: getObjectType(tree[key]) }))
		.sort(sortByTypeAndName)
		.map(el => el.key);
	// console.log("childKeys", childKeys.map(key => typeof tree[key]));

	return childKeys.map(key => {
		const staticType = getObjectType(tree[key]);
		const staticChildren = getChildren(tree[key], depth+1);
		const res = { key, staticType };
		if (staticChildren.length) { res.staticChildren = staticChildren; }
		const staticPrototypeNameChain = getPrototypeNameChain(Object.getPrototypeOf(tree[key]));
		if (staticPrototypeNameChain) { res.staticPrototypeNameChain = staticPrototypeNameChain; }
		const staticPrototypeChain = getPrototypeChain(tree[key]);
		if (staticPrototypeChain) { res.staticPrototypeChain = staticPrototypeChain; }

		// if (staticType === "Function") {
		// 	try {
		// 		if (hasVisitedAlready(tree[key], depth)) {
		// 			console.log("already seen this instance constructor", tree[key]);
		// 			throw "already found. error";
		// 		}
		// 		setVisited(tree[key], depth);
		// 		const instance = tree[key]();
		// 		res.instanceType = getObjectType(instance);
		// 		const instancePrototypeNameChain = getPrototypeNameChain(Object.getPrototypeOf(instance));
		// 		if (instancePrototypeNameChain) { res.instancePrototypeNameChain = instancePrototypeNameChain; }
		// 		const instancePrototypeChain = getPrototypeChain(instance);
		// 		instancePrototypeChain.map(proto => {
		// 			const match = prototypes.map(p => p === proto).reduce((a, b) => a || b, false);
		// 			if (!match) { prototypes.push(proto); }
		// 		});
		// 		if (instancePrototypeChain) { res.instancePrototypeChain = instancePrototypeChain; }
		// 		// finally, we get the children, because this could potentially throw an error
		// 		const instanceChildren = getChildren(instance, depth+1);
		// 		if (instanceChildren.length) { res.instanceChildren = instanceChildren; }
		// 	} catch(error) {
		// 		catchCount++;
		// 		catchFnNames.push(key);
		// 	}
		// }
		return res;
	});
};
/**
 * because everything in Javascript is an object, we need to differentiate between
 * - container objects which contain methods at some depth (any depth)
 * - objects which contain no methods (simpleObject)
 * the reason is that simpleObjects need to not contribute to the tree structure,
 * the side bar should not contain an expandable triangle for every single entry
 * in this object which is meant to be a constant (like a lookup table)
 */
/**
 * @description preemptively set all objects to be "simpleObject"
 */
const recursivelyLabel = (tree) => {
	tree.simpleObject = true;
	[...(tree.instanceChildren || []), ...(tree.staticChildren || [])]
		.forEach(child => recursivelyLabel(child));
};
/**
 * @description recurse to each leaf, if a function is found, crawl up the parent chain
 * and remove the label "simpleObject" from every parent.
 */
const labelSimpleObjects = (tree, chain = []) => {
	const nextChain = [...chain, tree];
	if (tree.staticType === "Function") { nextChain.forEach(el => delete el.simpleObject); }
	const children = [...(tree.instanceChildren || []), ...(tree.staticChildren || [])];
	children.forEach(child => labelSimpleObjects(child, nextChain));
};
const makeHasOwnPage = (tree, depth = 0) => {
	// const hasChildren = tree.staticChildren || tree.instanceChildren;
	tree.hasOwnPage = !tree.simpleObject && tree.staticChildren;
	if (containsUniquePrototype(tree.instancePrototypeChain)) {
		tree.hasOwnPage = true;
	}
	if (depth < 2) { tree.hasOwnPage = true; }
	[...(tree.instanceChildren || []), ...(tree.staticChildren || [])]
		.forEach(child => makeHasOwnPage(child, depth + 1));
};
const makeIsExpandable = (tree) => {
	if (tree.staticChildren && !tree.simpleObject) { tree.isExpandable = true; }
	[...(tree.instanceChildren || []), ...(tree.staticChildren || [])]
		.forEach(child => makeIsExpandable(child));
};
/**
 * @param {object} the object to build the tree.
 * @param {string} the name of the variable, the name of the top level object as a string.
 */
const makeObjectTree = (obj, objName) => {
	const tree = { key: objName, type: getObjectType(obj), staticChildren: getChildren(obj) };
	recursivelyLabel(tree);
	labelSimpleObjects(tree);
	makeHasOwnPage(tree);
	makeIsExpandable(tree);
	removeInvalids(tree);
	// custom
	tree.prototypes = prototypes;
	// console.log("these methods failed to execute and gather instance() information", catchFnNames);
	return tree;
};

module.exports = makeObjectTree;
