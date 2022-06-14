const ear = require("rabbit-ear");

let catchCount = 0;
// todo: dictionary with key:fn-name and value:array of fn-pointers
// prevent duplicate visits to the same function, called from the same object

const getChildren = (level, depth) => {
	if (depth != null && depth <= 0) { return []; }
	if (level == null) { return []; }
	// const structure = { constants: [], functions: [], categories: [] };
	const types = ["boolean", "number", "string", "object", "function"];
	const levelKeys = Object.keys(level)
		.filter(key => !(/^-?\d+\.?\d*$/).test(key));
	const typesKeys = types.map(type => levelKeys
		.filter(key => typeof level[key] === type))
		.map(group => group.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0)))
		.flat();
	// const instanceChildren = [];
	const tree = typesKeys.map(key => {
		const type = typeof level[key];
		const staticChildren = getChildren(level[key], depth === undefined ? undefined : depth-1);
		const res = { key, type };
		if (staticChildren.length) { res.staticChildren = staticChildren; }
		if (type === "function") {
			try {
				if (key === "svg" && depth === undefined) { depth = 2; }
				const instanceChildren = getChildren(level[key](), depth === undefined ? undefined : depth-1);
				if (instanceChildren.length) { res.instanceChildren = instanceChildren; }
				// console.log("instancing", key);
			} catch(error) { catchCount++; }
		}
		return res;
	});
	return tree;
};

/**
 * @param {object} the object to build the tree.
 * @param {string} the name of the variable, the name of the top level object as a string.
 */
const makeObjectTree = (obj, objName) => {
	return { key: objName, type: typeof obj, staticChildren: getChildren(obj) };
};

module.exports = makeObjectTree;
