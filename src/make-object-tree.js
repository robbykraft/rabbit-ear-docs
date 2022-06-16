const ear = require("rabbit-ear");

const getPrototypeChain = (obj, chain = []) => {
	if (obj == null || obj.constructor == null) { return chain; }
	const name = obj.constructor.name
	return name === "Object"
		? [...chain, name]
		: getPrototypeChain(Object.getPrototypeOf(obj), [...chain, name]);
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
const getChildKeys = (obj) => Object.keys(obj)
	.filter(key => !(/^-?\d+\.?\d*$/).test(key));

/**
 * @description sorted list of an object's children's type
 * (type meaning the name of the constructor)
 */
const getChildrenTypes = (obj) => {
	const hash = {};
	getChildKeys(obj)
		.map(key => getObjectType(obj[key]))
		.forEach(type => { hash[type] = true; });
	return Object.keys(hash).sort();
};

const getChildren = (level) => {
	if (level == null) { return []; }
	// const structure = { constants: [], functions: [], categories: [] };
	// sort children keys by 1.type 2.key
	const childKeys = getChildKeys(level)
		.map(key => ({ key, type: getObjectType(level[key]) }))
		.sort((a, b) => a.type.localeCompare(b.type) === 0
			? a.key.localeCompare(b.key)
			: a.type.localeCompare(b.type))
		.map(el => el.key);
	if (childKeys.length) { console.log("childKeys", childKeys); }

	return childKeys.map(key => {
		const staticType = getObjectType(level[key]);
		const staticChildren = getChildren(level[key]);
		const res = { key, staticType };
		if (staticChildren.length) { res.staticChildren = staticChildren; }
		const staticPrototypeChain = getPrototypeChain(Object.getPrototypeOf(level[key]));
		if (staticPrototypeChain) { res.staticPrototypeChain = staticPrototypeChain; }

		if (staticType === "Function") {
			try {
				const instance = level[key]();
				res.instanceType = getObjectType(instance);
				const instanceChildren = getChildren(instance);
				if (instanceChildren.length) { res.instanceChildren = instanceChildren; }
				const instancePrototypeChain = getPrototypeChain(Object.getPrototypeOf(instance));
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
 * @param {object} the object to build the tree.
 * @param {string} the name of the variable, the name of the top level object as a string.
 */
const makeObjectTree = (obj, objName) => {
	const res = { key: objName, type: getObjectType(obj), staticChildren: getChildren(obj) };
	console.log(`${catchCount} instance functions threw and failed to gather data.`, catchFnNames);
	return res;
};

module.exports = makeObjectTree;
