const fs = require("fs");
const { exec } = require("child_process");
const jsdoc2md = require("jsdoc-to-markdown");
const ear = require("rabbit-ear");
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const {
	makeMarkdownConstant,
	makeMarkdownObject,
	makeMarkdownFunction,
} = require("./json-to-markdown");
const makeObjectTree = require("./make-object-tree");
const makeList = require("./tree-to-list");

// const earCategories = ["math", "diagram", "layer", "vertex", "text", "webgl"];
// const earCategoryObjects = ["graph", "cp", "origami", "svg"];
// const earObjects = ["vector", "circle", "ellipse", "rect", "polygon", "line", "ray", "segment", "matrix"];
// const earCategoryFunctions = ["intersect", "overlap", "axiom"];
// const earFunctions = ["typeof"];

// const clearTmp = () => {
// 	fs.readdir("./tmp", (err, files) => {
// 	  if (err) throw err;
// 	  for (const file of files) {
// 	    fs.unlink(`./tmp/${file}`, err => {
// 	      if (err) throw err;
// 	    });
// 	  }
// 	});
// };

const clearTmp = () => {
	const tmpFiles = fs.readdirSync("./tmp");
	for (const file of tmpFiles) {
		fs.unlinkSync(`./tmp/${file}`);
	}
};
const clearAll = () => {
	clearTmp();
	const docsFiles = fs.readdirSync("./docs");
	for (const file of docsFiles) {
		fs.unlinkSync(`./docs/${file}`);
	}
};

const checkDuplicates = (kinds) => {
	Object.keys(kinds)
		.filter(kind => kind !== "constant" && kind !== "member")
		.forEach(kind => {
			const dict = {};
			kinds[kind].forEach(el => {
				if (dict[el.name]) { console.log("found duplicate", el.name); }
				dict[el.name] = true;
			})
		});
};

// ['constant', 'member', 'function', 'typedef', 'package']
const sortKinds = (json) => {
	const kinds = {};
	json.forEach(el => { kinds[el.kind] = true; });
	Object.keys(kinds)
		.forEach(kind => { kinds[kind] = json.filter(el => el.kind === kind); });
	// too many constants. includes constants inside functions. filter them. global only.
	// if (kinds.constant) {
	// 	kinds.constant = kinds.constant.filter(el => el.scope === "global");
	// }
	// if (kinds.member) {
	// 	kinds.member = kinds.member.filter(el => el.scope === "global");
	// }
	return kinds;
};

const writeJSONS = (kinds) => Object.keys(kinds)
	.forEach(kind => fs.writeFileSync(`./tmp/kinds.${kind}.json`, JSON.stringify(kinds[kind], null, 2)));

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
			return makeMarkdownConstant(match, pathString, "number");
		})
		.filter(a => a !== undefined);

	const markdownStrings = children
		.filter(el => el.type === "string")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["constant"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownConstant(match, pathString, "string");
		})
		.filter(a => a !== undefined);

	const markdownFunctions = children
		.filter(el => el.type === "function")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["function"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownFunction(match, pathString);
		})
		.filter(a => a !== undefined);

	const markdownObjects = children
		.filter(el => el.type === "object")
		.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
		.map(el => {
			const match = kinds["member"].filter(elem => elem.name === el.key).shift();
			if (!match) { console.log(el.key, "not found"); return; }
			return makeMarkdownObject(match, pathString);
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

const createMarkdownString = (kinds, tree, path) => {
	const pathString = path.join(".");
	let markdown = `# ${pathString}\n\n\`\`\`javascript\n${pathString}\n\`\`\`\n\n`;
	if (tree.type === "function") {
		const match = kinds["function"]
			.filter(elem => elem.name === tree.key)
			.shift();
		if (match) {
			const prePathString = path.slice(0, path.length-1).join(".");
			markdown += makeMarkdownFunction(match, prePathString);
		}
	}
	if (tree.staticChildren) {
		markdown += writeChildren(kinds, pathString, tree.staticChildren, "static");
	}
	if (tree.instanceChildren) {
		markdown += writeChildren(kinds, pathString, tree.instanceChildren, "instance");
	}
	return markdown;
};

const writeMarkdownFiles = (kinds, tree, path = []) => {
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
	children.forEach(el => writeMarkdownFiles(kinds, el, [...path, tree.key]));
};

const makeSidebar = (mdFilenames, libraryTree) => {
	const filenames = mdFilenames
		.map(str => str.substr(0, str.length - 3));
	const links = filenames.map(str => `<li><a href="./${str}.html">${str}</a></li>`);
	const htmlList = makeList(libraryTree);
	fs.writeFileSync(`./template/sidebar.html`, htmlList);
	return `<div>
	<h2>Rabbit Ear</h2>
	${htmlList}
</div>`;
};

const makeHTMLFiles = (libraryTree) => {
	const header = fs.readFileSync(`./template/header.html`, "utf8");
	const footer = fs.readFileSync(`./template/footer.html`, "utf8");
	const converter = new showdown.Converter({
		rawHeaderId: true,
		literalMidWordUnderscores: true,
		extensions: [showdownHighlight({ pre: true })],
	});
	const markdownFiles = fs.readdirSync("./tmp/")
		.filter(str => str.substr(-3) === ".md");
	const sidebar = makeSidebar(markdownFiles, libraryTree)
	markdownFiles.forEach(filename => {
		const name = filename.substr(0, filename.length - 3);
		const markdown = fs.readFileSync(`./tmp/${filename}`, "utf8");
		const html = `${header}\n${sidebar}\n<div>\n${converter.makeHtml(markdown)}\n</div>\n${footer}`;
		fs.writeFileSync(`./docs/${name}.html`, html);
	});
};
/**
 * @description main
 */
const processJSON = (json) => {
	clearAll();
	if (json.constructor !== Array) { return; }
	const kinds = sortKinds(json);
	writeJSONS(kinds);
	const libraryTree = makeObjectTree(ear, "ear");
	fs.writeFileSync(`./tmp/directory-tree.json`, JSON.stringify(libraryTree, null, 2));
	// checkDuplicates(kinds);

	writeMarkdownFiles(kinds, libraryTree);
	makeHTMLFiles(libraryTree);
	// move these from the templates folder
	fs.readdirSync("./template/")
		.filter(str => str.substr(-4) === ".css" || str.substr(-4) === ".svg")
		.forEach(filename => fs.copyFileSync(`./template/${filename}`, `./docs/${filename}`, fs.constants.COPYFILE_FICLONE));
	clearTmp();
	console.log("...done. documentation located in docs/");
};

// starts here
["./tmp", "./docs"]
	.filter(dir => !fs.existsSync(dir))
	.forEach(dir => fs.mkdirSync(dir))

jsdoc2md.getJsdocData({ files: './input/rabbit-ear.comments.js' })
	.then(processJSON);
