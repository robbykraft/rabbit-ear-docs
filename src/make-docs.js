/*
// jsdoc2md --json docs/math.docs.js > docs/docs.json
const fs = require("fs");
const jsdoc2md = require("jsdoc-to-markdown");
const { exec } = require("child_process");
const { makeMarkdownFunction } = require("./json-to-markdown");
const { fnKeys } = require("./earKeys");

fnKeys.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0));

const processJSON = (json) => {
	if (json.constructor !== Array) { return; }
	const functionEntries = json
		.filter(el => el.kind === "function" && el.description && el.name)
		.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
	functionEntries.forEach(el => { el.markdown = makeMarkdownFunction(el); });
	const markdown = functionEntries
		.map(el => el.markdown)
		.filter(a => a !== undefined)
		.join("\n\n");
	fs.writeFile("./docgen/math.docs.json", JSON.stringify(functionEntries, null, 2), err => {});
	fs.writeFile("./docgen/math.docs.md", markdown, err => {});
};

const compileCommand = "rollup -c";

exec(compileCommand, (error, stdout, stderr) => {
	if (error) { console.error(error); }
	if (stderr) { console.log(stderr); }
	if (stdout) { console.log(stdout); }
	jsdoc2md.getJsdocData({ files: './docgen/math.docs.js' })
		.then(processJSON);
	console.log(fnKeys);
});
*/