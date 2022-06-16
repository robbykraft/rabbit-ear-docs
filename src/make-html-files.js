const fs = require("fs");
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const makeList = require("./tree-to-list");

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

module.exports = makeHTMLFiles;
