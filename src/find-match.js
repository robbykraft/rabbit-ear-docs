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

const matchDepth = (memberOf, path) => {
	const earliestMatch = path
		.map((p, i) => p.toLowerCase() === memberOf ? i : undefined)
		.filter(a => a !== undefined)
		.shift();
	return earliestMatch === undefined ? Infinity : earliestMatch;
}

const findMatch = (docsEntries, tree, path, targetProperties) => {
	if (!tree.key) { return; }
	const treeKeyLowercase = tree.key.toLowerCase();
	const hasKey = docsEntries[tree.key] !== undefined;
	const keyInDocs = hasKey
		? tree.key
		: Object.keys(docsEntries)
			.map(key => ({ key, lower: key.toLowerCase() }))
			.filter(el => el.lower === treeKeyLowercase)
			.map(el => el.key)
			.shift();
	if (keyInDocs === undefined) {
		console.log(`find-match: no match for ${tree.key}`);
		return undefined;
	}
	const list = docsEntries[keyInDocs];
	if (!list) { console.log(`!!! should not be here`); return undefined; }
	if (list.length === 1) { return list[0]; }
	// there are two or more possible matches. we have to consult the target properties
	// no properties were offered. just get one of the global ones...
	if (!targetProperties) {
		const memberLength = list.map(el => el.memberof).filter(a => a !== undefined).length;
		if (memberLength === 0) {
			const globalItems = list.filter(el => el.scope === "global");
			if (globalItems.length === 1) {
				console.log(`find-match: no "memberof" for ${tree.key}. found one global instance`);
				return globalItems[0];
			}
			console.log(`find-match: no "memberof" for ${tree.key}. choosing one of many possible options`);
			return list[0];
		}
		const bestMatch = list
			.map(item => ({ item, rank: matchDepth(item.memberof, [...path, tree.key]) }))
			.sort((a, b) => a.rank - b.rank)
			.map(el => el.item)
			.shift();
		if (bestMatch) {
			return bestMatch;
		}
		console.log(`find-match: "memberof" info given for ${tree.key}, but no match was found.`);
		return list[0];
	}
	let matchIndex = 0;
	const matchCount = list
		.map(el => Object.keys(targetProperties)
			.map(key => targetProperties[key] === el[key] ? 1 : 0)
			.reduce((a, b) => a + b, 0));
	matchCount.forEach((sum, i) => { if (sum > matchCount[matchIndex]) { matchIndex = i; } });
	console.log(`find-match: target properties for ${tree.key} found index ${matchIndex} of ${list.length}`);
	return list[matchIndex];
};

module.exports = findMatch;
