const ear = require("rabbit-ear");

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

let catchCount = 0;
const catchFnNames = [];
// todo: dictionary with key:fn-name and value:array of fn-pointers
// prevent duplicate visits to the same function, called from the same object
const visited = [];

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

/**
 * @description sort by Constructor type, if they are already equal, by name (key)
 * type sort is not purely alphabetical. it is custom:
 * "undefined"
 * then "Boolean", "Number", "String", "Array" in one group,
 * then "Object",
 * then "Function"
 */
const typeGroups = {
	"undefined": "A",
	"Boolean": "B",
	"Number": "B",
	"String": "B",
	"Array": "B",
	"Object": "C",
	"Function": "D",
};
const sortByTypeAndName = (a, b) => {
	return typeGroups[a.type] === typeGroups[b.type]
		? a.key.localeCompare(b.key)
		: typeGroups[a.type].localeCompare(typeGroups[b.type]);
	// return a.type.localeCompare(b.type) === 0
	// 	? a.key.localeCompare(b.key)
	// 	: a.type.localeCompare(b.type);
};

const getChildren = (level) => {
	if (level == null) { return []; }
	// const structure = { constants: [], functions: [], categories: [] };
	// sort children keys by 1.type 2.key
	const childKeys = getNonNumericKeys(level)
		.map(key => ({ key, type: getObjectType(level[key]) }))
		.sort(sortByTypeAndName)
		.map(el => el.key);

	return childKeys.map(key => {
		const staticType = getObjectType(level[key]);
		const staticChildren = getChildren(level[key]);
		const res = { key, staticType };
		if (staticChildren.length) { res.staticChildren = staticChildren; }
		const staticPrototypeNameChain = getPrototypeNameChain(Object.getPrototypeOf(level[key]));
		if (staticPrototypeNameChain) { res.staticPrototypeNameChain = staticPrototypeNameChain; }
		const staticPrototypeChain = getPrototypeChain(level[key]);
		if (staticPrototypeChain) { res.staticPrototypeChain = staticPrototypeChain; }

		if (staticType === "Function") {
			try {
				const instance = level[key]();
				res.instanceType = getObjectType(instance);
				const instanceChildren = getChildren(instance);
				if (instanceChildren.length) { res.instanceChildren = instanceChildren; }
				const instancePrototypeNameChain = getPrototypeNameChain(Object.getPrototypeOf(instance));
				if (instancePrototypeNameChain) { res.instancePrototypeNameChain = instancePrototypeNameChain; }
				const instancePrototypeChain = getPrototypeChain(instance)
				// 	.filter(el => el !== Function.prototype)
				// 	.filter(el => el !== Array.prototype)
				// 	.filter(el => el !== Object.prototype)
				// 	.filter(el => el !== String.prototype)
				// 	.filter(el => el !== Number.prototype)
				// 	.filter(el => el !== Boolean.prototype);
				if (instancePrototypeChain) { res.instancePrototypeChain = instancePrototypeChain; }
			} catch(error) {
				catchCount++;
				catchFnNames.push(key);
			}
		}
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
/**
 * @param {object} the object to build the tree.
 * @param {string} the name of the variable, the name of the top level object as a string.
 */
const makeObjectTree = (obj, objName) => {
	const tree = { key: objName, type: getObjectType(obj), staticChildren: getChildren(obj) };
	recursivelyLabel(tree);
	labelSimpleObjects(tree);
	// hardcod preferences here:
	// tree.staticChildren.filter(el => el.key === "text").forEach(el => delete el.simpleObject);
	return tree;
};

module.exports = makeObjectTree;
