// two examples of parameters to target similarly named functions
//
// {
//   "name": "add",
//   "longname": "add",
//   "kind": "function",
//   "scope": "global"
// }
//
// {
//   "name": "add",
//   "longname": "table.vector.add",
//   "kind": "function",
//   "memberof": "table.vector",
//   "scope": "static"
// }

const findMatch = (docsEntries, tree, path, targetProperties) => {
	const list = docsEntries[tree.key];
	if (!list) { return undefined; }
	if (list.length === 1) { return list[0]; }
	// there are two or more possible matches. we have to consult the target properties
	// no properties were offered. just get one of the global ones...
	if (!targetProperties) {
		const globalItem = list.filter(el => el.scope === "global").shift();
		console.log("findMatch multiple matches. no target properties. global item found?", globalItem != null);
		return globalItem ? globalItem : list[0];
	}
	let matchIndex = 0;
	const matchCount = list
		.map(el => Object.keys(targetProperties)
			.map(key => targetProperties[key] === el[key] ? 1 : 0)
			.reduce((a, b) => a + b, 0));
	matchCount.forEach((sum, i) => { if (sum > matchCount[matchIndex]) { matchIndex = i; } });
		console.log("findMatch multiple matches. target properties found best match:", matchCount, matchIndex);
	return list[matchIndex];
};

module.exports = findMatch;
