const formatType = (str) => {
	if (str.substr(0, 6) === "Array.") {
		const rest = str.substr(6);
		// hack
		if (rest.substr(0, 7) === "<Array.") {
			const rest2 = rest.substr(7);
			if (rest2.substr(0, 7) === "<Array.") {
				const rest3 = rest2.substr(7);
				if (rest3.substr(0, 7) === "<Array.") {
					const rest4 = rest3.substr(7);
					const inside4 = rest4.replace(/[<>]/gi, "");
					return `${inside4}[][][][]`;
				}
				const inside3 = rest3.replace(/[<>]/gi, "");
				return `${inside3}[][][]`;
			}
			const inside2 = rest2.replace(/[<>]/gi, "");
			return `${inside2}[][]`;
		}
		// hack over.
		// rest.replace(/[^\w\s]/gi, '')
		const inside = rest.replace(/[<>]/gi, "");
		return `${inside}[]`;
	}
	return str;
};

const linkType = (str, customTypes) => {
	const link = customTypes
		.filter(type => type === str.substring(0, type.length))
		.shift();
	return link
		// ? `<a href="/docs/types.html#${link.toLowerCase()}">${str}</a>`
		? `[\`${str}\`](types.html#${link.toLowerCase()})`
		: `\`${str}\``;
		// : `<span class="hljs-built_in">\`${str}\`</span>`;
}

const fnParam = (param, i, customTypes) => {
	const name = param.name ? param.name : alphabet[i];
	const optional = param.optional ? "?" : "";
	const defaultvalue = param.defaultvalue === undefined ? "" : `=${param.defaultvalue}`;
	return param.type && param.type.names
		? `${name}${optional}: ${param.type.names
			.map(formatType)
			// .map(s => linkType(s, customTypes))
			.join(" | ")}${defaultvalue}`
		: undefined;
};

const fnReturnValue = (el, customTypes) => el.type && el.type.names
	? `${el.type.names
		.map(formatType)
		// .map(s => linkType(s, customTypes))
		.join(" | ")}`
	: undefined;

const makeTypeListString = (el, customTypes) => el.type && el.type.names && el.type.names.length
	? el.type.names
			.map(formatType)
			.map(s => linkType(s, customTypes))
			// .map(str => `\`${str}\``)
			.join(" | ")
	: undefined;

// we know name exists
const formatAttrName = (el) => el.optional
	// ? `**<span class="hljs-attr">${el.name} ?</span>:**`
	? `**<span class="hljs-attr">${el.name}</span> ?:**`
	: `**<span class="hljs-attr">${el.name}</span> :**`;

const makeAttrName = (el) => el.name ? formatAttrName(el) : undefined;

const makeTypeDescriptionEntryString = (el, customTypes) => [
		makeAttrName(el),
		makeTypeListString(el, customTypes),
		el.description,
	]
	.filter(a => a !== undefined)
	.join(" ");

const makeTypeDescriptionUnorderedList = (arr, customTypes) => arr
	.map(el => makeTypeDescriptionEntryString(el, customTypes))
	.map(str => `- ${str}`)
	.join("\n");

const makeTypeDescriptionOrderedList = (arr, customTypes) => arr
	.map(el => makeTypeDescriptionEntryString(el, customTypes))
	.map((str, i) => `${i+1}. ${str}`)
	.join("\n");

const makeParamsSection = (data, customTypes) => data.params && data.params.length
	// ? `params\n\n${makeTypeDescriptionOrderedList(data.params, customTypes)}`
	? [`##### params`, makeTypeDescriptionOrderedList(data.params, customTypes)]
		.join("\n\n")
	: undefined;

const makeReturnSection = (data, customTypes) => data.returns && data.returns.length
	? [`##### returns`, makeTypeDescriptionUnorderedList(data.returns, customTypes)]
		.join("\n\n")
	: undefined;

const exampleLanguage = "typescript";
// const exampleLanguage = "text";
const makeExamplesCodeBlock = (el) => el.examples
	? el.examples
		.map(example => `\`\`\`${exampleLanguage}\n${example}\n\`\`\``)
		.join("\n\n")
	: undefined;
const makeExamplesSection = (el) => el && el.examples
	? [`##### examples`, makeExamplesCodeBlock(el)]
		.join("\n\n")
	: undefined;

const makeTypedefProperties = (tree, customTypes) => tree.properties && tree.properties.length
	? makeTypeDescriptionOrderedList(tree.properties, customTypes)
	: undefined;

const makeTypedefDefinition = (tree, customTypes) => [
		// `${path.join(".")}.${tree.key}:${tree.staticType.toLowerCase()}`,
		makeTypedefProperties(tree, customTypes),
		makeExamplesSection(tree)
	].filter(a => a !== undefined)
	.join("\n\n");

const makeConstantDefinition = (data, tree, path) => `${path.join(".")}.${tree.key}:${tree.staticType.toLowerCase()}`;

const makeFunctionDefinition = (data, tree, customTypes, path) => {
	if (!data) { return ""; }
	// console.log("tree", tree);
	const functionCall = [...path, tree.key].join(".");
	// const functionCall = path.join(".");
	const params = data.params == null
		? ""
		: data.params.map((param, i) => fnParam(param, i, customTypes))
			.filter(a => a !== undefined)
			.join(", ");
	const returnvalue = data.returns
		? data.returns.map(el => fnReturnValue(el, customTypes)).join(", ")
		: undefined;
	return returnvalue ? `${functionCall}(${params}): ${returnvalue}` : `${functionCall}(${params})`;
};

module.exports = {
	makeParamsSection,
	makeReturnSection,
	makeExamplesSection,
	makeTypedefDefinition,
	makeConstantDefinition,
	makeFunctionDefinition,
};
