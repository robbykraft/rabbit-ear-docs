const fs = require("fs");
const { exec } = require("child_process");
const jsdoc2md = require("jsdoc-to-markdown");
const ear = require("rabbit-ear");
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const { makeMarkdownFunction } = require("./json-to-markdown");
const makeObjectTree = require("./make-object-tree");
const makeList = require("./tree-to-list");

const earCategories = ["math", "diagram", "layer", "vertex", "text", "webgl"];
const earCategoryObjects = ["graph", "cp", "origami", "svg"];
const earObjects = ["vector", "circle", "ellipse", "rect", "polygon", "line", "ray", "segment", "matrix"];
const earCategoryFunctions = ["intersect", "overlap", "axiom"];
const earFunctions = ["typeof"];

const clearTmp = () => {
	fs.readdir("./tmp", (err, files) => {
	  if (err) throw err;
	  for (const file of files) {
	    fs.unlink(`./tmp/${file}`, err => {
	      if (err) throw err;
	    });
	  }
	});
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

const sortKinds = (json) => {
	const kinds = {};
	json.forEach(el => { kinds[el.kind] = true; });
	Object.keys(kinds)
		.forEach(kind => { kinds[kind] = json.filter(el => el.kind === kind); });
	return kinds;
};

const writeJSONS = (kinds) => Object.keys(kinds)
	.forEach(kind => fs.writeFileSync(`./tmp/ear.${kind}.json`, JSON.stringify(kinds[kind], null, 2)));


const writeMarkdownFile = (kinds, subdir) => {
	const markdownFunctions = Object.keys(ear[subdir])
		.filter(key => typeof ear[subdir][key] === "function")
		.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
		.map(key => {
			const match = kinds.function.filter(el => el.name === key).shift();
			if (!match) { console.log(key, "not found"); return; }
			return makeMarkdownFunction(match, `ear.${subdir}`);
		})
		.filter(a => a !== undefined)
		.join("\n\n");
	const markdown = `# ear.${subdir}\n\n\`\`\`javascript\near.${subdir}\n\`\`\`\n\n${markdownFunctions}`;
	fs.writeFileSync(`./tmp/ear.${subdir}.md`, markdown);
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

// 	return `<div>
// 	<h2>Rabbit Ear</h2>
// 	<ul id="tree-start">
// 		<li><span class="caret"><a href="./ear.html">ear</a></span>
// 			<ul class="nested">
// 				${links.join("\n")}
// 				<li><span class="caret">ear.math</span>
// 					<ul class="nested">
// 						<li>add</li>
// 						<li>add2</li>
// 						<li>average</li>
// 						<li>bounding_box</li>
// 					</ul>
// 				</li>
// 			</ul>
// 		</li>
// 	</ul>
// </div>`;
};

const makeHTMLFiles = (libraryTree) => {
	const header = fs.readFileSync(`./template/header.html`, "utf8");
	const footer = fs.readFileSync(`./template/footer.html`, "utf8");
	const converter = new showdown.Converter({
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
	if (json.constructor !== Array) { return; }
	const kinds = sortKinds(json);
	writeJSONS(kinds);
	const libraryTree = makeObjectTree(ear, "ear");
	fs.writeFileSync(`./tmp/directory-tree.json`, JSON.stringify(libraryTree, null, 2));
	// checkDuplicates(kinds);
	earCategories.forEach(key => writeMarkdownFile(kinds, key));
	makeHTMLFiles(libraryTree);
	// move these from the templates folder
	const cssFiles = fs.readdirSync("./template/")
		.filter(str => str.substr(-4) === ".css")
		.forEach(cssFile => fs.copyFileSync(`./template/${cssFile}`, `./docs/${cssFile}`, fs.constants.COPYFILE_FICLONE));
	clearTmp();
	console.log("... done. documentation in ./docs/");
};

// const compileCommand = "../build.sh";

// exec(compileCommand, (error, stdout, stderr) => {
// 	if (error) { console.error(error); }
// 	if (stderr) { console.log(stderr); }
// 	if (stdout) { console.log(stdout); }
// 	jsdoc2md.getJsdocData({ files: './tmp/rabbit-ear.comments.js' })
// 		.then(processJSON);
// });

// starts here
["./tmp", "./docs"]
	.filter(dir => !fs.existsSync(dir))
	.forEach(dir => fs.mkdirSync(dir))

jsdoc2md.getJsdocData({ files: './input/rabbit-ear.comments.js' })
	.then(processJSON);
