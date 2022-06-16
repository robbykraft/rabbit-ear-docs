const fs = require("fs");
const { exec } = require("child_process");
const jsdoc2md = require("jsdoc-to-markdown");
const ear = require("rabbit-ear");
const makeObjectTree = require("./make-object-tree");
const makeMarkdownFiles = require("./make-markdown-files");
const makeHTMLFiles = require("./make-html-files");

/**
 * clear tmp/ folder only
 */
const clearTmp = () => {
	const tmpFiles = fs.readdirSync("./tmp");
	for (const file of tmpFiles) {
		fs.unlinkSync(`./tmp/${file}`);
	}
};
/**
 * clear tmp/ and docs/, the build folder. run this before re-building
 */
const clearAll = () => {
	clearTmp();
	const docsFiles = fs.readdirSync("./docs");
	for (const file of docsFiles) {
		fs.unlinkSync(`./docs/${file}`);
	}
};

const checkDuplicates = (kinds) => Object.keys(kinds)
	.filter(kind => kind !== "constant" && kind !== "member")
	.forEach(kind => {
		const dict = {};
		kinds[kind].forEach(el => {
			if (dict[el.name]) { console.log("found duplicate", el.name); }
			dict[el.name] = true;
		})
	});

// ['constant', 'member', 'function', 'typedef', 'package']
const sortKinds = (json) => {
	const kinds = {};
	json.forEach(el => { kinds[el.kind] = true; });
	Object.keys(kinds)
		.forEach(kind => { kinds[kind] = json.filter(el => el.kind === kind); });
	// too many constants. includes constants inside functions. filter them. global only.
	if (kinds.function) {
		kinds.function = kinds.function.filter(el => el.scope === "global");
	}
	if (kinds.constant) {
		kinds.constant = kinds.constant.filter(el => el.scope === "global");
	}
	if (kinds.member) {
		kinds.member = kinds.member.filter(el => el.scope === "global");
	}
	return kinds;
};
/**
 * @description the main function.
 * @param {object} jsdocs the JSON result from calling jsdoc2md get JSON subprocess.
 */
const buildDocs = (jsdocs) => {
	clearAll();
	if (jsdocs.constructor !== Array) { return; }
	const libraryTree = makeObjectTree(ear, "ear");
	const kinds = sortKinds(jsdocs);
	// write jsdocs files, sorted by kinds
	Object.keys(kinds).forEach(kind => fs
		.writeFileSync(`./tmp/jsdocs.${kind}.json`, JSON.stringify(kinds[kind], null, 2)));
	fs.writeFileSync(`./tmp/directory-tree.json`, JSON.stringify(libraryTree, null, 2));
	// checkDuplicates(kinds);
	// build docs. first markdown, then convert that into HTML
	makeMarkdownFiles(kinds, libraryTree);
	makeHTMLFiles(libraryTree);
	// these template files are copied over to the build folder
	const copyFileTypes = [".css", ".svg"];
	fs.readdirSync("./template/")
		.filter(str => copyFileTypes.includes(str.substr(-4)))
		.forEach(filename => fs.copyFileSync(`./template/${filename}`, `./docs/${filename}`, fs.constants.COPYFILE_FICLONE));
	// clearTmp();
	console.log("...done. documentation located in docs/");
};

// start here
["./tmp", "./docs"]
	.filter(dir => !fs.existsSync(dir))
	.forEach(dir => fs.mkdirSync(dir))

jsdoc2md.getJsdocData({ files: './input/rabbit-ear.comments.js' })
	.then(buildDocs);
