
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
					return `${inside4}[][]`;
				}
				const inside3 = rest3.replace(/[<>]/gi, "");
				return `${inside3}[][]`;
			}
			const inside2 = rest2.replace(/[<>]/gi, "");
			return `${inside2}[][]`;
		}
		// hack done

		// rest.replace(/[^\w\s]/gi, '')
		const inside = rest.replace(/[<>]/gi, "");
		return `${inside}[]`;
	}
	return str;
};

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

const makeConstantDefinition = (data, tree, path) => `${tree.key}:${tree.staticType.toLowerCase()}`;

const makeFunctionDefinition = (data, tree, path) => {
	if (!data) { return ""; }
	// console.log("tree", tree);
	// const functionCall = tree.key;
	const functionCall = path.join(".");
	const params = data.params == null
		? ""
		: data.params.map((param, i) => tsParam(param, i))
			.filter(a => a !== undefined)
			.join(", ");
	const returnvalue = data.returns
		? data.returns.map(tsReturnValue).join(", ")
		: undefined;
	return returnvalue ? `${functionCall}(${params}): ${returnvalue}` : `${functionCall}(${params})`;
};

module.exports = {
	makeParamsSection,
	makeReturnSection,
	makeConstantDefinition,
	makeFunctionDefinition,
};