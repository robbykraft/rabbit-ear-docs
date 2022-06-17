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

const getChildren = (level) => {
	if (level == null) { return []; }
	// const structure = { constants: [], functions: [], categories: [] };
	// sort children keys by 1.type 2.key
	const childKeys = getNonNumericKeys(level)
		.map(key => ({ key, type: getObjectType(level[key]) }))
		.sort((a, b) => a.type.localeCompare(b.type) === 0
			? a.key.localeCompare(b.key)
			: a.type.localeCompare(b.type))
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
 * @param {object} the object to build the tree.
 * @param {string} the name of the variable, the name of the top level object as a string.
 */
const makeObjectTree = (obj, objName) => {
	const res = { key: objName, type: getObjectType(obj), staticChildren: getChildren(obj) };
	// console.log(`${catchCount} instance functions threw and failed to gather data.`, catchFnNames);
	return res;
};

module.exports = makeObjectTree;
