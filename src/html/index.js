const fs = require("fs");
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const makeSidebarList = require("./sidebar-list");

const indexHTML = `<!DOCTYPE html>
<html>
<title>.</title>
<script type="text/javascript">
window.location.href = "/docs/ear.html"
</script>
</html>`;

const makeSidebar = (topLevelTrees, path, libraryVersion = "") => `<div class="sidebar">
	<h3>Rabbit Ear</h3>
	${makeSidebarList(topLevelTrees, path, libraryVersion)}
</div>`;

const makeHTMLFiles = (topLevelTrees, libraryVersion = "") => {
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
		const sidebar = makeSidebar(topLevelTrees, path, libraryVersion);
		const name = filename.substr(0, filename.length - 3);
		const customDefinition = fs.existsSync(`./template/custom/${filename}`);
		if (customDefinition) { console.log(`using custom definition for ${filename}`); }
		const markdown = customDefinition
			? fs.readFileSync(`./template/custom/${filename}`, "utf8")
			: fs.readFileSync(`./tmp/${filename}`, "utf8");
		const html = `${header}\n${sidebar}\n<div class="body">\n${converter.makeHtml(markdown)}\n</div>\n${footer}`;
		fs.writeFileSync(`./docs/${name}.html`, html);
	});
	fs.writeFileSync("./docs/index.html", indexHTML);
};

module.exports = makeHTMLFiles;
