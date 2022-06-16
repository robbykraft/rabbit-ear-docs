const fs = require("fs");
const {
	makeMarkdownConstant,
	makeMarkdownObject,
	makeMarkdownFunction,
} = require("./json-to-markdown");

const writeChildren = (kinds, pathString, children, childrenName) => {
	let markdown = "";
	const markdownBooleans = children
		.filter(el => el.type === "boolean")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["constant"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownConstant(match, pathString, "boolean");
		})
		.filter(a => a !== undefined);

	const markdownNumbers = children
		.filter(el => el.type === "number")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["constant"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownConstant(match, el, pathString, "number");
		})
		.filter(a => a !== undefined);

	const markdownStrings = children
		.filter(el => el.type === "string")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["constant"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownConstant(match, el, pathString, "string");
		})
		.filter(a => a !== undefined);

	const markdownFunctions = children
		.filter(el => el.type === "function")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["function"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownFunction(match, el, pathString);
		})
		.filter(a => a !== undefined);

	const markdownObjects = children
		.filter(el => el.type === "object")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["member"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownObject(match, el, pathString);
		})
		.filter(a => a !== undefined);

	if (markdownBooleans.length || markdownNumbers.length || markdownStrings.length || markdownObjects.length) {
		markdown += `## ${childrenName} properties\n\n`;
	}
	markdown += markdownBooleans.join("\n");
	markdown += markdownNumbers.join("\n");
	markdown += markdownStrings.join("\n");
	markdown += markdownObjects.join("\n");
	if (markdownFunctions.length) {
		markdown += `## ${childrenName} methods\n\n`;
	}
	markdown += markdownFunctions.join("\n");
	return markdown;
};

const createMarkdownString = (kinds, tree, path = []) => {
	const pathString = path.join(".");
	let markdown = `# ${pathString}\n\n\`\`\`javascript\n${pathString}\n\`\`\`\n\n`;
	if (tree.type === "function") {
		const match = kinds["function"]
			.filter(elem => elem.name === tree.key)
			.shift();
		if (match) {
			const prePathString = path.slice(0, path.length-1).join(".");
			markdown += makeMarkdownFunction(match, tree, prePathString) + "\n\n";
		}
	}
	if (tree.staticChildren) {
		markdown += writeChildren(kinds, pathString, tree.staticChildren, "static") + "\n\n";
	}
	if (tree.instanceChildren) {
		markdown += writeChildren(kinds, pathString, tree.instanceChildren, "instance") + "\n\n";
	}
	return markdown;
};

const makeMarkdownFiles = (kinds, tree, path = []) => {
	const hasChildren = tree.staticChildren || tree.instanceChildren;
	if (!hasChildren) { return; }
	const children = [tree.staticChildren, tree.instanceChildren]
		.filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []);
	let shouldWriteFile = false;
	const thisPath = [...path, tree.key];
	const thisPathString = thisPath.join(".");
	const markdown = createMarkdownString(kinds, tree, thisPath);
	fs.writeFileSync(`./tmp/${thisPathString}.md`, markdown);
	children.forEach(el => makeMarkdownFiles(kinds, el, [...path, tree.key]));
};

module.exports = makeMarkdownFiles;
