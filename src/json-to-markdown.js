// jsdoc2md --json docs/math.docs.js > docs/docs.json
const fs = require("fs");
const jsdoc2md = require("jsdoc-to-markdown");
const { exec } = require("child_process");

const formatType = (str) => {
	if (str.substr(0, 6) === "Array.") {
		const rest = str.substr(6);
		rest.replace(/[^\w\s]/gi, '')
		const inside = rest.replace(/[<>]/gi, "");
		return `${inside}[]`;
	}
	return str;
};

const alphabet = "abcdefghijklmnopqrstuvwxyz";

// optional
// defaultvalue

const tsParam = (param, i) => {
	const name = param.name ? param.name : alphabet[i];
	const optional = param.optional ? "?" : "";
	const defaultvalue = param.defaultvalue ? `=${param.defaultvalue}` : "";
	return param.type && param.type.names
		? `${name}${optional}: ${param.type.names.map(formatType).join("|")}${defaultvalue}`
		: undefined;
};

const tsReturnValue = (val) => val.type && val.type.names
	? `${val.type.names.map(formatType).join("|")}`
	: undefined;

const makeTSDefinition = (el, functionCall) => {
	const params = el.params == null
		? ""
		: el.params.map((param, i) => tsParam(param, i))
			.filter(a => a !== undefined)
			.join(", ");
	const returnvalue = el.returns
		? el.returns.map(tsReturnValue).join(", ")
		: undefined;
	return returnvalue ? `${functionCall}(${params}): ${returnvalue}` : `${functionCall}(${params})`;
};

const tsCodeBlock = str => `\`\`\`typescript
${str}
\`\`\``;

const makeTypeListString = el => el.type && el.type.names && el.type.names.length
		? `\`${el.type.names.map(formatType).join("|")}\``
		: undefined;

const makeTypeDescriptionEntryString = (el) => [makeTypeListString(el), el.description]
	.filter(a => a !== undefined)
	.join(" ");

const makeTypeDescriptionUnorderedList = (arr) => arr
	.map(makeTypeDescriptionEntryString)
	.map(str => `- ${str}`)
	.join("\n");

const makeTypeDescriptionOrderedList = (arr) => arr
	.map(makeTypeDescriptionEntryString)
	.map((str, i) => `${i+1}. ${str}`)
	.join("\n");

const makeParamsSection = (data) => data.params && data.params.length
	? `params\n\n${makeTypeDescriptionOrderedList(data.params)}`
	: undefined;

const makeReturnSection = (data) => data.returns && data.returns.length
	? `returns\n\n${makeTypeDescriptionUnorderedList(data.returns)}`
	: undefined;

const prototypeChain = (def) => {
	if (!def.instanceConstructor) { return ""; }
	// console.log("def.instanceConstructor", def.instanceConstructor);
	let contents = "prototype chain\n\n```text\n";
	for (let i = 0; i < def.instanceConstructor.length; i++) {
		contents += def.instanceConstructor[i] + "\n";
		if (i === def.instanceConstructor.length - 1) { continue; }
		contents += " ".repeat(i*4) + "|\n";
		contents += " ".repeat(i*4) + "|-- ";
	}
	contents += "```";
	return contents;
};

// ```
// instance
// |
// |-- Vector
//     |
//     |-- Array
//         |
//         |-- Object
// ```


// const prototypeChain = (def) => {
// 	const chains = [];
// 	// if (def.staticConstructor) {
// 	// 	chains.push("static prototype chain:" + def.staticConstructor.join(", "));
// 	// }
// 	if (def.instanceConstructor) {
// 		const list = def.instanceConstructor
// 			.map(str => `\`${str}\``)
// 			.join(" ");
// 		chains.push("instance prototypes: " + list);
// 	}
// 	return chains.join("\n\n");
// };

exports.makeMarkdownConstant = (data, def, pathString, type) => {
	// const title = pathString ? `### ${pathString}.${data.name}` : `### ${data.name}`;
	const title = `### ${data.name}`;
	const tsDefString = type ? `${[pathString, data.name].join(".")}:${type}` : undefined;
	const tsDef = tsDefString ? tsCodeBlock(tsDefString) : undefined;
	const body = [data.description]
		.filter(a => a !== undefined)
		.join("\n\n");
	return [title, tsDef, body].join("\n\n");
};

exports.makeMarkdownObject = (data, def, pathString) => {
	return exports.makeMarkdownConstant(data, def, pathString, "object");
};

exports.makeMarkdownFunction = (data, def, pathString) => {
	// if (!data.returns) { return; }
	// const title = pathString ? `### ${pathString}.${data.name}` : `### ${data.name}`;
	const title = `### ${data.name}`;
	const tsDefString = makeTSDefinition(data, [pathString, data.name].join("."));
	const tsDef = tsDefString ? tsCodeBlock(tsDefString) : undefined;
	const body = [data.description, makeParamsSection(data), makeReturnSection(data)]
		.filter(a => a !== undefined)
		.join("\n\n");
	const chain = prototypeChain(def);
	return [title, tsDef, body, chain].join("\n\n");
};
