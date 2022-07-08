const fs = require("fs");
const { exec } = require("child_process");
const jsdoc2md = require("jsdoc-to-markdown");
const ear = require("rabbit-ear");
const makeObjectTree = require("./make-object-tree");
const makeMarkdownFiles = require("./markdown/index");
const makeHTMLFiles = require("./html/index");

const getRabbitEarVersion = () => {
	// this rule will take the following line, skip 2 words after the /* and
	// match until the next space (getting the version number). if anything changes
	// in this formatting, this regex needs to be updated.
	/* Rabbit Ear 0.9.31 alpha 2022-07-07 (c) Kraft, MIT License */
	const rule = /(?<=^(\/\*\s)+([^ ]+\s){2})([^ ]+)/g;
	const libraryFile = fs.readFileSync("./input/rabbit-ear.comments.js", "utf-8");
	const version = libraryFile.match(rule).shift();
	return version;
};

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

// // ['constant', 'member', 'function', 'typedef', 'package']
// const sortKinds = (json) => {
// 	const kinds = {};
// 	json.forEach(el => { kinds[el.kind] = true; });
// 	Object.keys(kinds)
// 		.forEach(kind => { kinds[kind] = json.filter(el => el.kind === kind); });
// 	// too many constants. includes constants inside functions. filter them. global only.
// 	if (kinds.function) {
// 		kinds.function = kinds.function.filter(el => el.scope === "global");
// 	}
// 	if (kinds.constant) {
// 		kinds.constant = kinds.constant.filter(el => el.scope === "global");
// 	}
// 	if (kinds.member) {
// 		kinds.member = kinds.member.filter(el => el.scope === "global");
// 	}
// 	return kinds;
// };

const filterJSDocs = (jsdocs) => jsdocs
	.filter(el => !el.undocumented);
	// .filter(el => el.scope === "global");

const sortJSDocs = (jsdocs) => {
	const names = {};
	jsdocs.forEach(el => { names[el.name] = true; });
	const res = {};
	const sorted = Object.keys(names).sort();
	sorted.forEach(name => { res[name] = []; });
	jsdocs.forEach(el => {
		if (res[el.name].push === undefined) {
			console.log("ERROR", el.name, res[el.name], el);
		} else {
			res[el.name].push(el)
		}
	});
	return res;
};

const makeErrorsTree = () => ({
	"key": "errors",
	// "staticType": "Array",
	// "simpleObject": true,
	"hasOwnPage": true
});

// {
// 	comment: "",
// 	meta: {
//     filename: 'rabbit-ear.comments.js',
//     lineno: 17366,
//     columnno: 0,
//     path: '/Users/robby/Code/RabbitEarJS/docgen/input',
//     code: {}
//   },
//   description: 'The definition for the FOLD file format, as a Javascript object.',
//   kind: 'typedef',
//   name: 'FOLD',
//   type: { names: [Array] },
//   properties: [
//     [Object], [Object],
//     [Object], [Object],
//     [Object], [Object],
//     [Object]
//   ],
//   longname: 'FOLD',
//   scope: 'global'
// }

const makeLibraryObject = (doc) => Object.assign(doc, {
	key: doc.name,
	staticType: doc.kind,
	hasOwnPage: false,
	isExpandable: false,
});

const makeTypesTree = (jsdocs) => ({
  key: "types",
  type: "undefined",
  staticChildren: jsdocs
		.filter(el => el.kind === "typedef")
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(makeLibraryObject),
  hasOwnPage: true,
  isExpandable: true,
  prototypes: [],
});
/**
 * @description the main function.
 * @param {object} jsdocs the JSON result from calling jsdoc2md get JSON subprocess.
 */
const buildDocs = (jsdocs) => {
	clearAll();
	if (jsdocs.constructor !== Array) { return; }
	const rabbitearTree = makeObjectTree(ear, "ear");
	const errorsTree = makeErrorsTree();
	const typesTree = makeTypesTree(jsdocs);
	const filtered = filterJSDocs(jsdocs);
	const docsEntries = sortJSDocs(filtered);
	fs.writeFileSync(`./tmp/docs.json`, JSON.stringify(docsEntries, null, 2));
	fs.writeFileSync(`./tmp/tree-rabbit-ear.json`, JSON.stringify(rabbitearTree, null, 2));
	fs.writeFileSync(`./tmp/tree-errors.json`, JSON.stringify(errorsTree, null, 2));
	fs.writeFileSync(`./tmp/tree-types.json`, JSON.stringify(typesTree, null, 2));
	const customTypes = typesTree.staticChildren
		? typesTree.staticChildren.map(el => el.name)
		: [];
	console.log("customTypes", customTypes);
	// build docs. first markdown, then convert that into HTML
	// console.log(JSON.stringify(makeTypesTree(filtered)));
	// const topLevelTrees = [rabbitearTree, errorsTree()];
	const topLevelTrees = [rabbitearTree, errorsTree, typesTree];
	makeMarkdownFiles(docsEntries, topLevelTrees, customTypes);
	makeHTMLFiles(topLevelTrees, getRabbitEarVersion());
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
