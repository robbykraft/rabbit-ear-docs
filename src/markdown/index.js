const fs = require("fs");
const ear = require("rabbit-ear");
const findMatch = require("../find-match");
const {
	makeParamsSection,
	makeReturnSection,
	makeExamplesSection,
	makeTypedefDefinition,
	makeConstantDefinition,
	makeFunctionDefinition,
	makeExamplesDefinition,
} = require("./methods");

const tsCodeBlock = str => `\`\`\`typescript
${str}
\`\`\``;

const textCodeBlock = (str) => `\`\`\`text
${typeof str === "string" ? str : JSON.stringify(str, null, 1)}
\`\`\``;

const jsonCodeBlock = (str) => `\`\`\`json
${typeof str === "string" ? str : JSON.stringify(str, null, 1)}
\`\`\``;

const getLiteralValue = (key, longPath) => {
	let obj = ear;
	let value;
	try {
		longPath.slice(1).forEach(level => obj = obj[level]);
		return obj[key];
	} catch (err) {}
};

const makeDebugSection = (tree) => {
	const simple = ["key", "staticType", "instanceType"];
	const joinThese = ["staticPrototypeNameChain", "instancePrototypeNameChain"];
	const lengths = ["staticChildren", "instanceChildren"];
	const text = [
		...simple.map(key => `${key}: ${tree[key]}`),
		...joinThese.map(key => `${key}: ${tree[key] ? tree[key].join(".") : ""}`),
		...lengths.map(key => `${key}: ${tree[key] ? tree[key].length : 0}`),
	].join("\n");
	return `\`\`\`text\n${text}\n\`\`\``;
};

const makeStaticConstant = (match, tree, customTypes, path) => {
	if (!match) { return undefined; }
	const markdown = [];
	markdown.push(`### ${tree.key}`);
	markdown.push(match.description);
	markdown.push(tsCodeBlock(makeConstantDefinition(match, tree, path)));
	markdown.push("value");
	if (match.meta && match.meta.code) {
		switch (match.meta.code.type) {
			case "Literal":
			case "ArrayExpression": markdown.push(tsCodeBlock(match.meta.code.value)); break;
			case "CallExpression":  markdown.push(tsCodeBlock(JSON.stringify(getLiteralValue(tree.key, path)))); break;
			case "BinaryExpression": markdown.push(tsCodeBlock(getLiteralValue(tree.key, path))); break;
			default: markdown.push(tsCodeBlock("undefined type for " + match.meta.code.type)); break;
		}
	}
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeStaticSimpleObject = (match, tree, customTypes, path) => {
	if (!match) { return undefined; }
	const markdown = [];
	markdown.push(`### ${tree.key}`);
	markdown.push(match.description);
	const value = getLiteralValue(tree.key, path);
	const simpleString = JSON.stringify(value);
	const string = simpleString.length < 400 ? simpleString : JSON.stringify(value, null, 1);
	markdown.push(tsCodeBlock(makeConstantDefinition(match, tree, path)));
	markdown.push("value");
	markdown.push(jsonCodeBlock(string));
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeStaticContainerObject = (match, tree, customTypes, path) => {
	if (!match) { return undefined; }
	const markdown = [];
	markdown.push(`### ${tree.key}`);
	markdown.push(match.description);
	markdown.push(tsCodeBlock([...path, tree.key].join(".")));
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeStaticObject = (match, tree, customTypes, path) => tree.simpleObject
	? makeStaticSimpleObject(match, tree, customTypes, path)
	: makeStaticContainerObject(match, tree, customTypes, path);

const makeStaticFunction = (match, tree, customTypes, path) => {
	if (!match) { return undefined; }
	const instancePrototypes = tree.instancePrototypeNameChain
		? tsCodeBlock("prototype: " + tree.instancePrototypeNameChain
			.map(a => a.toLowerCase()).join(" → "))
		: undefined

	const markdown = [];
	markdown.push(`### ${tree.key}`);
	markdown.push(instancePrototypes);
	markdown.push(match.description);
	markdown.push(tsCodeBlock(makeFunctionDefinition(match, tree, customTypes, path)));
	markdown.push(makeParamsSection(match, customTypes));
	markdown.push(makeReturnSection(match, customTypes));
	markdown.push(makeExamplesSection(match));
	// staticPrototypeNameChain: [ 'Number', 'Object' ],
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeTypedef = (match, tree, customTypes, path) => {
	const markdown = [];
	// console.log(tree);
	const typeName = tree.type && tree.type.names && tree.type.names.length
		? `\`${tree.type.names.join(" ")}\``
		: undefined;
	markdown.push(`### ${tree.key}`);
	markdown.push(typeName);
	markdown.push(tree.description);
	markdown.push(makeTypedefDefinition(tree, customTypes));
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeStaticEntry = (docsEntries, tree, customTypes, path) => {
	const match = findMatch(docsEntries, tree, path);
	const markdown = [];
	// const markdown = [`### ${tree.key}`];
	if (!match) { return markdown.join("\n\n"); }
	switch (tree.staticType) {
		case "Boolean":
		case "Number":
		case "String":
		case "Array": markdown.push(makeStaticConstant(match, tree, customTypes, path)); break;
		case "Object": markdown.push(makeStaticObject(match, tree, customTypes, path)); break;
		case "Function": markdown.push(makeStaticFunction(match, tree, customTypes, path)); break;
		case "undefined": markdown.push(`### ${tree.key}`, "todo: undefined static type"); break;
		case "typedef": markdown.push(makeTypedef(match, tree, customTypes, path)); break;
		default: markdown.push(`### ${tree.key}`, "TODO default (unknown) static type"); break;
	}
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeInstancePageSection = (docsEntries, tree, customTypes, path) => {
	const matchStatic = findMatch(docsEntries, tree, path);
	const matchInstance = matchStatic; //findMatch(docsEntries, tree, path);
	const markdown = [];
	// this is a function. make its function call
	switch (tree.staticType) {
		case "Boolean": markdown.push("TODO Boolean"); break;
		case "Number": markdown.push("TODO Number"); break;
		case "String": markdown.push("TODO String"); break;
		case "Object": markdown.push(makeStaticObject(matchStatic, tree, customTypes, path)); break;
		case "Array": markdown.push("TODO Array"); break;
		case "Function": markdown.push(makeStaticFunction(matchStatic, tree, customTypes, path)); break;
		case "undefined": markdown.push(makeStaticContainerObject(matchInstance, tree, customTypes, path)); break;
		case "typedef": markdown.push("todo: instance typedef"); break;
		default: markdown.push("TODO default (unknown) instance type"); break;
	}
	// if (tree.instanceType) { }
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeStaticPageSection = (docsEntries, tree, customTypes, path) => {
	const match = findMatch(docsEntries, tree, path);
	// console.log("Found match", tree.key, match);
	const markdown = ["## static properties/methods"];
	// tree.staticChildren.forEach(child => console.log(child));
	markdown.push(...tree.staticChildren
		.map(child => makeStaticEntry(docsEntries, child, customTypes, path)));

	// if (match && match.kind === "function") {
	// 	markdown.push(match.description);
	// 	markdown.push(makeParamsSection(match));
	// 	markdown.push(makeReturnSection(match));
	// }
	return markdown.filter(a => a !== undefined).join("\n\n");
};

const makeMarkdownFile = (docsEntries, tree, customTypes, path = []) => {
	// console.log("building", tree.key);
	const pathString = path.join(".");
	// const mdTitle = `# ${pathString}`;
	const mdTitle = `# ${tree.key}`;
	// const staticPrototypes = tree.staticType
	// 	? tsCodeBlock(`${pathString}:${tree.staticType.toLowerCase()}`)
	// 	: tsCodeBlock(pathString)
	// console.log("proto", tree.instancePrototypeNameChain);
	// const instancePrototypes = tree.instancePrototypeNameChain
	// 	? tsCodeBlock("prototype: " + tree.instancePrototypeNameChain
	// 		.map(a => a.toLowerCase()).join(" → "))
	// 	: undefined

	const markdown = [];
	// markdown.push(makeDebugSection(tree));
	markdown.push(mdTitle);
	// markdown.push(instancePrototypes);
	markdown.push(makeInstancePageSection(docsEntries, tree, customTypes, path.slice(0, -1)));
	if (tree.staticChildren && tree.staticChildren.length) {
		markdown.push(makeStaticPageSection(docsEntries, tree, customTypes, path));
	}

	// debug section, the matched jsdocs entries
	// markdown.push(...(docsEntries[tree.key] || [])
	// 	.map(match => textCodeBlock(match, tree)));
	// join sections with carriage returns
	return markdown.filter(a => a !== undefined).join("\n\n");
};

/**
 * recursive method to iterate through tree's children, writing each file along the way
 */
const makeAllMarkdownFiles = (docsEntries, tree, customTypes = [], path = []) => {
	// const hasChildren = (tree.staticChildren || tree.instanceChildren) && !tree.simpleObject;
	// if (!hasChildren) { return; }
	if (!tree.hasOwnPage) { return; }
	const children = [tree.staticChildren, tree.instanceChildren]
		.filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []);
	// let shouldWriteFile = false;
	const thisPath = [...path, tree.key];
	const thisPathString = thisPath.join(".");
	const markdown = makeMarkdownFile(docsEntries, tree, customTypes, thisPath);
	fs.writeFileSync(`./tmp/${thisPathString}.md`, markdown);
	children.forEach(el => makeAllMarkdownFiles(docsEntries, el, customTypes, [...path, tree.key]));
};

const makeAllTrees = (docsEntries, topLevelTrees, customTypes = []) => topLevelTrees
	.forEach(tree => makeAllMarkdownFiles(docsEntries, tree, customTypes));

module.exports = makeAllTrees;
