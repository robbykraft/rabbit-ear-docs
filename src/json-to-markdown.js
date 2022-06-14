// jsdoc2md --json docs/math.docs.js > docs/docs.json
const fs = require("fs");
const jsdoc2md = require("jsdoc-to-markdown");
const { exec } = require("child_process");

// {
//   "id": "magnitude2",
//   "longname": "magnitude2",
//   "name": "magnitude2",
//   "kind": "function",
//   "scope": "global",
//   "description": "compute the magnitude a 2D vector",
//   "params": [
//     {
//       "type": {
//         "names": [
//           "Array.<number>"
//         ]
//       },
//       "description": "one 2D vector",
//       "name": "v"
//     }
//   ],
//   "returns": [
//     {
//       "type": {
//         "names": [
//           "number"
//         ]
//       },
//       "description": "one scalar"
//     }
//   ],
//   "meta": {
//     "lineno": 417,
//     "filename": "math.docs.js",
//     "path": "/Users/robby/Code/RabbitEarJS/Math/docs"
//   },
//   "order": 23
// };

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

const makeTSDefinition = (el) => {
	const params = el.params
		.map((param, i) => tsParam(param, i))
		.filter(a => a !== undefined)
		.join(", ");
	const returnvalue = el.returns.map(tsReturnValue).join(", ");
	return returnvalue ? `(${params}): ${returnvalue}` : `(${params})`;
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

exports.makeMarkdownFunction = (data, subdir) => {
	if (!data.description || !data.params || !data.returns) { return; }
	// const title = subdir ? `### ${subdir}.${data.name}` : `### ${data.name}`;
	const title = `### ${data.name}`;
	const tsDefString = makeTSDefinition(data);
	const tsDef = tsDefString ? tsCodeBlock(tsDefString) : undefined;
	const body = [data.description, makeParamsSection(data), makeReturnSection(data)]
		.filter(a => a !== undefined)
		.join("\n\n");
	return [title, tsDef, body].join("\n\n");
};
