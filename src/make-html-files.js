const fs = require("fs");
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const makeTreeHTMLList = require("./make-html-tree-list");

const makeSidebar = (libraryTree, path) => `<div>
	<h2>Rabbit Ear</h2>
	${makeTreeHTMLList(libraryTree, path)}
</div>`;

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
	markdownFiles.forEach(filename => {
		const path = filename.substr(0, filename.length - 3).split(".");
		const sidebar = makeSidebar(libraryTree, path);
		const name = filename.substr(0, filename.length - 3);
		const markdown = fs.readFileSync(`./tmp/${filename}`, "utf8");
		const html = `${header}\n${sidebar}\n<div>\n${converter.makeHtml(markdown)}\n</div>\n${footer}`;
		fs.writeFileSync(`./docs/${name}.html`, html);
	});
};

module.exports = makeHTMLFiles;
