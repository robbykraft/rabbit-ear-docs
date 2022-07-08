/* Rabbit Ear 0.9.31 alpha 2022-07-08 (c) Kraft, MIT License */

/**
 * Rabbit Ear (c) Kraft
 */
// this is a really verbose way of coding this but so far this is the best
// way i can find to compress references in the minified .js file
const _undefined = "undefined";
const _number = "number";
const _object = "object";
const _index = "index";

const _vertices = "vertices";
const _edges = "edges";
const _faces = "faces";
const _boundaries = "boundaries";
const _vertices_coords = "vertices_coords";
const _edges_vertices = "edges_vertices";
const _faces_vertices = "faces_vertices";
const _faces_edges = "faces_edges";
const _edges_assignment = "edges_assignment";
const _edges_foldAngle = "edges_foldAngle";
const _faces_layer = "faces_layer";

const _boundary = "boundary";
const _front = "front";
const _back = "back";
const _foldedForm = "foldedForm";
const _black = "black";
const _white = "white";
const _none = "none";

/**
 * Rabbit Ear (c) Kraft
 */

// compare to "undefined", the string
const isBrowser$1 = typeof window !== _undefined
	&& typeof window.document !== _undefined;

typeof process !== _undefined
	&& process.versions != null
	&& process.versions.node != null;

const isWebWorker = typeof self === _object
	&& self.constructor
	&& self.constructor.name === "DedicatedWorkerGlobalScope";

// // for debugging, uncomment to log system on boot
// const operating_systems = [
//   isBrowser ? "browser" : undefined,
//   isWebWorker ? "web-worker" : undefined,
//   isNode ? "node" : undefined,
// ].filter(a => a !== undefined).join(" ");
// console.log(`RabbitEar [${operating_systems}]`);

const errorMessages = [];

errorMessages[10] = "\"error 010: window\" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )";

/**
 * Rabbit Ear (c) Kraft
 */

const windowContainer = { window: undefined };

const buildDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");

const setWindow$1 = (newWindow) => {
	// make sure window has a document. xmldom does not, and requires it be built.
	if (!newWindow.document) { newWindow.document = buildDocument(newWindow); }
	windowContainer.window = newWindow;
	return windowContainer.window;
};
// if we are in the browser, by default use the browser's "window".
if (isBrowser$1) { windowContainer.window = window; }
/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
const RabbitEarWindow = () => {
	if (windowContainer.window === undefined) {
		throw errorMessages[10];
	}
	return windowContainer.window;
};

/**
 * Rabbit Ear (c) Kraft
 */
var root = Object.create(null);

/**
 * @typedef AxiomParams
 * @type {object}
 * @description The input to one of the seven axiom calculations. Depending on which axiom,
 * this will include up to two points and up to two lines, each inside their
 * respectively named arrays, where the order matters.
 * @property {RayLine[]} [lines] an array of lines
 * @property {number[][]} [points] an array of points
 * @example
 * {
 *   points: [[0.8, 0.5], [0.1, 0.15]],
 *   lines: [{vector: [0,1], origin: [0.5, 0.5]}]
 * }
 */

/**
 * @typedef FOLD
 * @type {object}
 * @description A Javascript object representation of a FOLD file which follows the FOLD
 * specification in that it contains any number of the geometry arrays.
 * @property {number[][]} [vertices_coords] xy or xyz coordinates of the vertices
 * @property {number[][]} [vertices_vertices] for each vertex, all of its edge-adjacent vertices
 * @property {number[][]} [edges_vertices] each edge connects two vertex indices
 * @property {string[]} [edges_assignment] single-character fold assignment of each edge
 * @property {number[]} [edges_foldAngle] in degrees, the fold angle of each edge
 * @property {number[][]} [faces_vertices] each face defined by a sequence of vertex indices
 * @property {number[][]} [faces_edges] each face defined by a sequence of edge indices
 * @property {number[][]} [faces_faces] for each face, a list of faces which
 * are edge-adjacent neighbors.
 * @property {FOLD[]} [file_frames] array of embedded FOLD objects, good for representing
 * a linear sequence like diagram steps for example.
 * @example
 * {
 *   vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
 *   edges_vertices: [[0,1], [1,2], [2,3], [3,0], [0,2]],
 *   edges_assignment: ["B", "B", "B", "B", "V"],
 *   edges_foldAngle: [0, 0, 0, 0, 180],
 *   faces_vertices: [[0,1,2], [0,2,3]],
 * }
 */

/**
 * @typedef BoundingBox
 * @type {object}
 * @description An n-dimensional axis-aligned bounding box that ecloses a space.
 * @property {number[]} min the corner point of the box that is a minima along all axes.
 * @property {number[]} max the corner point of the box that is a maxima along all axes.
 * @property {number[]} span the lengths of the box along all dimensions,
 * the difference between the maxima and minima.
 * @example
 * {
 *   min: [-3, -10],
 *   max: [5, -1],
 *   span: [8, 9],
 * }
 */

/**
 * @typedef RayLine
 * @type {object}
 * @description an object with a vector and an origin, representing a line or a ray.
 * @property {number[]} vector - the line's direction vector
 * @property {number[]} origin - one point that intersects with the line
 * @example
 * {
 *   vector: [0.0, 1.0],
 *   origin: [0.5, 0.5]
 * }
 */

/**
 * @typedef UniqueLine
 * @type {object}
 * @description This is a parameterization of an infinite line which gives each line a
 * unique parameterization, making checking for duplicates easily.
 * @property {number[]} normal - the line's normal vector
 * @property {number} distance - the shortest distance from the origin to the line
 */

/* Math (c) Kraft, MIT License */
/**
 * Math (c) Kraft
 */
/**
 * type checking
 */
/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */
/**
 * @description get the type of an object, which includes the custom types in this library.
 * @param {any} any object
 * @returns {string} the type name
 * @linkcode Math ./src/types/typeof.js 17
 */
const typeOf = function (obj) {
	switch (obj.constructor.name) {
	case "vector":
	case "matrix":
	case "segment":
	case "ray":
	case "line":
	case "circle":
	case "ellipse":
	case "rect":
	case "polygon": return obj.constructor.name;
	}
	if (typeof obj === "object") {
		if (obj.radius != null) { return "circle"; }
		if (obj.width != null) { return "rect"; }
		if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
		// line ray segment
		if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
		if (obj.vector != null && obj.origin != null) { return "line"; } // or ray
	}
	return undefined;
};

/**
 * Math (c) Kraft
 */
/**
 * sort two vectors by their lengths, returning the shorter one first
 *
 */
// export const lengthSort = (a, b) => [a, b].sort((m, n) => m.length - n.length);
/**
 * force a vector into N-dimensions by adding 0s if they don't exist.
 */
const resize = (d, v) => (v.length === d
	? v
	: Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
/**
 * this makes the two vectors match in dimension.
 * the smaller array will be filled with 0s to match the length of the larger
 */
const resizeUp = (a, b) => {
	const size = a.length > b.length ? a.length : b.length;
	return [a, b].map(v => resize(size, v));
};
/**
 * this makes the two vectors match in dimension.
 * the larger array will be shrunk to match the length of the smaller
 */
const resizeDown = (a, b) => {
	const size = a.length > b.length ? b.length : a.length;
	return [a, b].map(v => resize(size, v));
};

const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!m) { return 0; }
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
/**
 * @description clean floating point numbers, where 15.0000000000000002 becomes 15,
 * this method involves encoding and parsing so it is relatively expensive.
 * @param {number} num the floating point number to clean
 * @param {number} [places=15] the whole number of decimal places to
 * keep, beyond this point can be considered to be noise.
 * @returns {number} the cleaned floating point number
 */
const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};

const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns always an array
 */
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
/**
 * totally flatten, recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns an array, always.
 */
const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).reduce((a, b) => a.concat(b), []);
	}
};

var resizers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	resize: resize,
	resizeUp: resizeUp,
	resizeDown: resizeDown,
	cleanNumber: cleanNumber,
	semiFlattenArrays: semiFlattenArrays,
	flattenArrays: flattenArrays
});

/**
 * Math (c) Kraft
 */
// because an object may contain an operation that returns a copy of itself,
// or any other primitive for that matter, all primitive
// contructors will be assigned here to prevent circular dependencies
//
// this file should import no other file

var Constructors = Object.create(null);

/**
 * Math (c) Kraft
 */
/**
 * @description this epsilon is used throughout the library
 * @linkcode Math ./src/algebra/constants.js 6
 */
const EPSILON = 1e-6;
/**
 * @description radians to degrees
 * @linkcode Math ./src/algebra/constants.js 11
 */
const R2D = 180 / Math.PI;
/**
 * @description degrees to radians
 * @linkcode Math ./src/algebra/constants.js 16
 */
const D2R = Math.PI / 180;
/**
 * @description pi x 2
 * @linkcode Math ./src/algebra/constants.js 21
 */
const TWO_PI = Math.PI * 2;

var constants = /*#__PURE__*/Object.freeze({
	__proto__: null,
	EPSILON: EPSILON,
	R2D: R2D,
	D2R: D2R,
	TWO_PI: TWO_PI
});

/**
 * Math (c) Kraft
 */
/**
 * common functions that get reused, especially inside of map/reduce etc...
 */
/**
 * @description trivial method, returns true
 * @returns {boolean} true
 * @linkcode Math ./src/algebra/functions.js 11
 */
const fnTrue = () => true;
/**
 * @description multiply a parameter by itself
 * @param {number} n a number
 * @returns {number} a number
 * @linkcode Math ./src/algebra/functions.js 18
 */
const fnSquare = n => n * n;
/**
 * @description add two parameters
 * @param {number} a a number
 * @param {number} b a number
 * @returns {number} a number
 * @linkcode Math ./src/algebra/functions.js 26
 */
const fnAdd = (a, b) => a + (b || 0);
/**
 * @description is an input not undefined? using Javascript's triple equals !==
 * @param {any} a any input
 * @returns {boolean} true if the input is not undefined
 * @linkcode Math ./src/algebra/functions.js 33
 */
const fnNotUndefined = a => a !== undefined;
/**
 * @description boolean AND the two inputs
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} the AND of both inputs
 * @linkcode Math ./src/algebra/functions.js 41
 */
const fnAnd = (a, b) => a && b;
/**
 * @description concat the two arrays, resulting in one joined array
 * @param {Array} a any array input
 * @param {Array} b any array input
 * @returns {Array} one joined array
 * @linkcode Math ./src/algebra/functions.js 49
 */
const fnCat = (a, b) => a.concat(b);
/**
 * @description Convert a 2D vector to an angle in radians.
 * @param {number[]} v an input vector
 * @returns {number} the angle in radians
 * @linkcode Math ./src/algebra/functions.js 56
 */
const fnVec2Angle = v => Math.atan2(v[1], v[0]);
/**
 * @description Convert an angle in radians to a 2D vector.
 * @param {number} a the angle in radians
 * @returns {number[]} a 2D vector
 * @linkcode Math ./src/algebra/functions.js 63
 */
const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
/**
 * @description Are two inputs equal using Javascript's triple equals?
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} true if the inputs are equal
 * @linkcode Math ./src/algebra/functions.js 71
 */
const fnEqual = (a, b) => a === b;
/**
 * @description Are two inputs equal within an epsilon of each other?
 * @param {number} a any number input
 * @param {number} b any number input
 * @returns {boolean} true if the numbers are near each other
 * @linkcode Math ./src/algebra/functions.js 79
 */
const fnEpsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
/**
 * @description Sort two numbers within an epsilon of each other, so that "1": a < b,
 * "-1": a > b, and "0": a ~= b (epsilon equal).
 * @param {number} a any number
 * @param {number} b any number
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number} -1, 0, +1
 * @linkcode Math ./src/algebra/functions.js 89
 */
const fnEpsilonSort = (a, b, epsilon = EPSILON) => (
	fnEpsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
/**
 * @description are two vectors equal to each other within an epsilon. This method
 * uses a fast rectangle-area around each vector.
 * @param {number[]} a an array of numbers
 * @param {number[]} b an array of numbers
 * @returns {boolean} true if the vectors are similar within an epsilon
 * @linkcode Math ./src/algebra/functions.js 100
 */
const fnEpsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!fnEpsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
/**
 * @description the inclusive test used in intersection algorithms, returns
 * true if the number is positive, including the epsilon between -epsilon and 0.
 * @returns {boolean} -Infinity...{false}...-epsilon...{true}...+Infinity
 * @linkcode Math ./src/algebra/functions.js 112
 */
const include = (n, epsilon = EPSILON) => n > -epsilon;
/**
 * @description the exclusive test used in intersection algorithms, returns
 * true if the number is positive, excluding the epsilon between 0 and +epsilon.
 * @returns {boolean} -Infinity...{false}...+epsilon...{true}...+Infinity
 * @linkcode Math ./src/algebra/functions.js 119
 */
const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * @description the function parameter for an inclusive line
 * @linkcode Math ./src/algebra/functions.js 124
 */
const includeL = fnTrue;
/**
 * @description the function parameter for an exclusive line
 * @linkcode Math ./src/algebra/functions.js 129
 */
const excludeL = fnTrue;
/**
 * @description the function parameter for an inclusive ray
 * @linkcode Math ./src/algebra/functions.js 134
 */
const includeR = include;
/**
 * @description the function parameter for an exclusive ray
 * @linkcode Math ./src/algebra/functions.js 139
 */
const excludeR = exclude;
/**
 * @description the function parameter for an inclusive segment
 * @linkcode Math ./src/algebra/functions.js 144
 */
const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
/**
 * @description the function parameter for an exclusive segment
 * @linkcode Math ./src/algebra/functions.js 149
 */
const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The line method allows all values.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 157
 */
const lineLimiter = dist => dist;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The ray method clamps values below -epsilon to be 0.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 165
 */
const rayLimiter = dist => (dist < -EPSILON ? 0 : dist);
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The segment method clamps values below -epsilon to be 0 and above 1+epsilon to 1.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/algebra/functions.js 173
 */
const segmentLimiter = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};

var functions = /*#__PURE__*/Object.freeze({
	__proto__: null,
	fnTrue: fnTrue,
	fnSquare: fnSquare,
	fnAdd: fnAdd,
	fnNotUndefined: fnNotUndefined,
	fnAnd: fnAnd,
	fnCat: fnCat,
	fnVec2Angle: fnVec2Angle,
	fnToVec2: fnToVec2,
	fnEqual: fnEqual,
	fnEpsilonEqual: fnEpsilonEqual,
	fnEpsilonSort: fnEpsilonSort,
	fnEpsilonEqualVectors: fnEpsilonEqualVectors,
	include: include,
	exclude: exclude,
	includeL: includeL,
	excludeL: excludeL,
	includeR: includeR,
	excludeR: excludeR,
	includeS: includeS,
	excludeS: excludeS,
	lineLimiter: lineLimiter,
	rayLimiter: rayLimiter,
	segmentLimiter: segmentLimiter
});

/**
 * Math (c) Kraft
 */

/**
 * algebra operations on vectors (mostly).
 *
 * vectors are assumed to be Javascript Arrays objects /
 * contain the Javascript Array prototype, as these methods depend
 * on the use of "map", "reduce" and other Array functions.
 *
 * ({x: y:} vectors as Javascript Objects will not work)
 *
 * many of these operations can handle vectors of arbitrary dimension
 * in which case there are two vectors as input, it will be noted that
 * "dimensions match first parameter", you should verify that the second
 * parameter is at least as long as the first (okay if it is longer)
 *
 * when a function name ends with a number (magnitude2) the input vector's
 * dimension is assumed to be this number.
 */

/**
 * @description compute the magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 32
 */
const magnitude = v => Math.sqrt(v
	.map(fnSquare)
	.reduce(fnAdd, 0));
/**
 * @description compute the magnitude a 2D vector
 * @param {number[]} v one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 41
 */
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
/**
 * @description compute the square-magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 48
 */
const magSquared = v => v
	.map(fnSquare)
	.reduce(fnAdd, 0);
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching the input vector
 * @linkcode Math ./src/algebra/vectors.js 57
 */
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 67
 */
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} s one scalar
 * @returns {number[]} one vector
 * @linkcode Math ./src/algebra/vectors.js 78
 */
const scale = (v, s) => v.map(n => n * s);
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one 2D vector
 * @param {number} s one scalar
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 86
 */
const scale2 = (v, s) => [v[0] * s, v[1] * s];
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 95
 */
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 104
 */
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 112
 */
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 120
 */
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
/**
 * @description compute the dot product of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 128
 */
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(fnAdd, 0);
/**
 * @description compute the dot product of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 138
 */
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
/**
 * @description compute the midpoint of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 146
 */
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * @description compute the midpoint of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 154
 */
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
/**
 * @description the average of N number of vectors, similar to midpoint,
 * but can accept more than 2 inputs
 * @param {number[]} ...args any number of input vectors
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 162
 */
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
/**
 * @description linear interpolate between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 178
 */
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
/**
 * @description the determinant of the matrix of the 2 vectors
 * (possible bad name, 2D cross product is undefined)
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar; the determinant; the magnitude of the vector
 * @linkcode Math ./src/algebra/vectors.js 190
 */
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
/**
 * @description the 3D cross product of two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 198
 */
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
/**
 * @description compute the distance between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 210
 */
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(fnAdd, 0));
/**
 * @description compute the distance between two 2D vectors
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 220
 */
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
/**
 * @description compute the distance between two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 232
 */
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
/**
 * @description return a copy of the input vector where each element's sign flipped
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimensions matching input parameter
 * @linkcode Math ./src/algebra/vectors.js 244
 */
const flip = v => v.map(n => -n);
/**
 * @description return a copy of the input vector rotated 90 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 251
 */
const rotate90 = v => [-v[1], v[0]];
/**
 * @description return a copy of the input vector rotated 270 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 258
 */
const rotate270 = v => [v[1], -v[0]];
/**
 * @description check if a vector is degenerate, meaning its magnitude is below an epsilon limit.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the magnitude of the vector smaller than the epsilon?
 * @linkcode Math ./src/algebra/vectors.js 266
 */
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(fnAdd, 0) < epsilon;
/**
 * @description check if two vectors are parallel to each other within an epsilon
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 277
 */
const parallel = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(normalize(v), normalize(u))) < epsilon;
/**
 * @description check if two 2D vectors are parallel to each other within an epsilon
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 287
 */
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;

var algebra = /*#__PURE__*/Object.freeze({
	__proto__: null,
	magnitude: magnitude,
	magnitude2: magnitude2,
	magSquared: magSquared,
	normalize: normalize,
	normalize2: normalize2,
	scale: scale,
	scale2: scale2,
	add: add,
	add2: add2,
	subtract: subtract,
	subtract2: subtract2,
	dot: dot,
	dot2: dot2,
	midpoint: midpoint,
	midpoint2: midpoint2,
	average: average,
	lerp: lerp,
	cross2: cross2,
	cross3: cross3,
	distance: distance,
	distance2: distance2,
	distance3: distance3,
	flip: flip,
	rotate90: rotate90,
	rotate270: rotate270,
	degenerate: degenerate,
	parallel: parallel,
	parallel2: parallel2
});

/**
 * Math (c) Kraft
 */
/**
 * @description the identity matrix for 3x3 matrices
 * @linkcode Math ./src/algebra/matrix3.js 14
 */
const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
/**
 * @description the identity matrix for 3x4 matrices (zero translation)
 * @linkcode Math ./src/algebra/matrix3.js 19
 */
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
/**
 * @description test if a 3x4 matrix is the identity matrix within an epsilon
 * @param {number[]} matrix a 3x4 matrix
 * @returns {boolean} true if the matrix is the identity matrix
 * @linkcode Math ./src/algebra/matrix3.js 26
 */
const isIdentity3x4 = m => identity3x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
/**
 * @description multiply one 3D vector by a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @param {number[]} vector in array form
 * @returns {number[]} the transformed vector
 * @linkcode Math ./src/algebra/matrix3.js 36
 */
const multiplyMatrix3Vector3 = (m, vector) => [
	m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11],
];
/**
 * @description multiply one 3D line by a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin the origin of the line
 * @returns {object} transformed line in point-vector form
 * @linkcode Math ./src/algebra/matrix3.js 49
 */
const multiplyMatrix3Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
		m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
		m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
		m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
		m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11],
	],
});
/**
 * @description multiply two 3x4 matrices together
 * @param {number[]} matrix the first matrix
 * @param {number[]} matrix the second matrix
 * @returns {number[]} one matrix, the product of the two
 * @linkcode Math ./src/algebra/matrix3.js 68
 */
const multiplyMatrices3 = (m1, m2) => [
	m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
	m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
	m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
	m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
	m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
	m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
	m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
	m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
	m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
	m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
	m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
	m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11],
];
/**
 * @description calculate the determinant of a 3x4 or 3x3 matrix.
 * in the case of 3x4, the translation component is ignored.
 * @param {number[]} matrix one matrix in array form
 * @returns {number} the determinant of the matrix
 * @linkcode Math ./src/algebra/matrix3.js 89
 */
const determinant3 = m => (
	m[0] * m[4] * m[8]
	- m[0] * m[7] * m[5]
	- m[3] * m[1] * m[8]
	+ m[3] * m[7] * m[2]
	+ m[6] * m[1] * m[5]
	- m[6] * m[4] * m[2]
);
/**
 * @description invert a 3x4 matrix
 * @param {number[]} matrix one matrix in array form
 * @returns {number[]|undefined} the inverted matrix, or undefined if not possible
 * @linkcode Math ./src/algebra/matrix3.js 103
 */
const invertMatrix3 = (m) => {
	const det = determinant3(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[9]) || !Number.isFinite(m[10]) || !Number.isFinite(m[11])) {
		return undefined;
	}
	const inv = [
		m[4] * m[8] - m[7] * m[5],
		-m[1] * m[8] + m[7] * m[2],
		m[1] * m[5] - m[4] * m[2],
		-m[3] * m[8] + m[6] * m[5],
		m[0] * m[8] - m[6] * m[2],
		-m[0] * m[5] + m[3] * m[2],
		m[3] * m[7] - m[6] * m[4],
		-m[0] * m[7] + m[6] * m[1],
		m[0] * m[4] - m[3] * m[1],
		-m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
			- m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
		m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
			+ m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
		-m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
			- m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4],
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
/**
 * @description make a 3x4 matrix representing a translation in 3D
 * @param {number} [x=0] the x component of the translation
 * @param {number} [y=0] the y component of the translation
 * @param {number} [z=0] the z component of the translation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 137
 */
const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);

// i0 and i1 direct which columns and rows are filled
// sgn manages right hand rule
const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
	const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 3 + i0] = cos;
	mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 3 + i1] = cos;
	return mat;
};

/**
 * @description make a 3x4 matrix representing a rotation in 3D around the x-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 160
 */
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
/**
 * @description make a 3x4 matrix representing a rotation in 3D around the y-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 170
 */
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
/**
 * @description make a 3x4 matrix representing a rotation in 3D around the z-axis
 * (allowing you to specify the center of rotation if needed).
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 180
 */
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
/**
 * @description make a 3x4 matrix representing a rotation in 3D
 * around a given vector and around a given center of rotation.
 * @param {number} angle the angle of rotation in radians
 * @param {number[]} [vector=[0,0,1]] the axis of rotation
 * @param {number[]} [origin=[0,0,0]] the center of rotation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 191
 */
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	return multiplyMatrices3(trans_inv, multiplyMatrices3([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c,
		0, 0, 0], trans));
};
// leave this in for legacy, testing. eventually this can be removed.
// const makeMatrix3RotateOld = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
// 	// normalize inputs
// 	const vec = resize(3, normalize(vector));
// 	const pos = [0, 1, 2].map(i => origin[i] || 0);
// 	const [a, b, c] = vec;
// 	const cos = Math.cos(angle);
// 	const sin = Math.sin(angle);
// 	const d = Math.sqrt((vec[1] * vec[1]) + (vec[2] * vec[2]));
// 	const b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
// 	const c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
// 	const t     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
// 	const t_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
// 	const rx     = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
// 	const rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
// 	const ry     = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
// 	const ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
// 	const rz     = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
// 	return multiplyMatrices3(t_inv,
// 		multiplyMatrices3(rx_inv,
// 			multiplyMatrices3(ry_inv,
// 				multiplyMatrices3(rz,
// 					multiplyMatrices3(ry,
// 						multiplyMatrices3(rx, t))))));
// };
/**
 * @description make a 3x4 matrix representing a uniform scale.
 * @param {number} [scale=1] the uniform scale value
 * @param {number[]} [origin=[0,0,0]] the center of transformation
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 237
 */
const makeMatrix3Scale = (scale = 1, origin = [0, 0, 0]) => [
	scale,
	0,
	0,
	0,
	scale,
	0,
	0,
	0,
	scale,
	scale * -origin[0] + origin[0],
	scale * -origin[1] + origin[1],
	scale * -origin[2] + origin[2],
];
/**
 * @description make a 3x4 representing a reflection across a line in the XY plane
 * This is a 2D operation, assumes everything is in the XY plane.
 * @param {number[]} vector one 2D vector specifying the reflection axis
 * @param {number[]} [origin=[0,0]] 2D origin specifying a point of reflection
 * @returns {number[]} one 3x4 matrix
 * @linkcode Math ./src/algebra/matrix3.js 259
 */
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	// the line of reflection passes through origin, runs along vector
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, 0, c, d, 0, 0, 0, 1, tx, ty, 0];
};

/**
 * 2D operation, assuming everything is 0 in the z plane
 * @param line in vector-origin form
 * @returns matrix3
 */
// export const make_matrix3_reflect = (vector, origin = [0, 0, 0]) => {
//   // the line of reflection passes through origin, runs along vector
//   return [];
// };

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/

var matrix3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	identity3x3: identity3x3,
	identity3x4: identity3x4,
	isIdentity3x4: isIdentity3x4,
	multiplyMatrix3Vector3: multiplyMatrix3Vector3,
	multiplyMatrix3Line3: multiplyMatrix3Line3,
	multiplyMatrices3: multiplyMatrices3,
	determinant3: determinant3,
	invertMatrix3: invertMatrix3,
	makeMatrix3Translate: makeMatrix3Translate,
	makeMatrix3RotateX: makeMatrix3RotateX,
	makeMatrix3RotateY: makeMatrix3RotateY,
	makeMatrix3RotateZ: makeMatrix3RotateZ,
	makeMatrix3Rotate: makeMatrix3Rotate,
	makeMatrix3Scale: makeMatrix3Scale,
	makeMatrix3ReflectZ: makeMatrix3ReflectZ
});

/**
 * Math (c) Kraft
 */
/**
 * @returns {object} in form { point:[], vector:[] }
*/
const vectorOriginForm = (vector, origin) => ({
	vector: vector || [],
	origin: origin || [],
});
/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const getVector = function () {
	// todo, incorporate constructors.vector check to all indices. and below
	if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
	let list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};

/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};

/**
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
const getSegment = function () {
	if (arguments[0] instanceof Constructors.segment) {
		return arguments[0];
	}
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
const getLine$1 = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0] instanceof Constructors.line
		|| args[0] instanceof Constructors.ray
		|| args[0] instanceof Constructors.segment) { return args[0]; }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};

const getRay = getLine$1;

const getRectParams = (x = 0, y = 0, width = 0, height = 0) => ({
	x, y, width, height,
});

const getRect = function () {
	if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
	const list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].width)) {
		return getRectParams(...["x", "y", "width", "height"]
			.map(c => list[0][c])
			.filter(fnNotUndefined));
	}
	const numbers = list.filter(n => typeof n === "number");
	const rectParams = numbers.length < 4
		? [, , ...numbers]
		: numbers;
	return getRectParams(...rectParams);
};

/**
 * radius is the first parameter so that the origin can be N-dimensional
 * ...args is a list of numbers that become the origin.
 */
const getCircleParams = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});

const getCircle = function () {
	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
	const vectors = getVectorOfVectors(arguments);
	const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
	if (arguments.length === 2) {
		if (vectors[1].length === 1) {
			return getCircleParams(vectors[1][0], ...vectors[0]);
		}
		if (vectors[0].length === 1) {
			return getCircleParams(vectors[0][0], ...vectors[1]);
		}
		if (vectors[0].length > 1 && vectors[1].length > 1) {
			return getCircleParams(distance2(...vectors), ...vectors[0]);
		}
	} else {
		switch (numbers.length) {
		case 0: return getCircleParams(1, 0, 0, 0);
		case 1: return getCircleParams(numbers[0], 0, 0, 0);
		default: return getCircleParams(numbers.pop(), ...numbers);
		}
	}
	return getCircleParams(1, 0, 0, 0);
};

const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);

const matrixMap3x4 = len => {
	let i;
	if (len < 8) i = 0;
	else if (len < 13) i = 1;
	else i = 2;
	return maps3x4[i];
};

/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
const getMatrix3x4 = function () {
	const mat = flattenArrays(arguments);
	const matrix = [...identity3x4];
	matrixMap3x4(mat.length)
		// .filter((_, i) => mat[i] != null)
		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	return matrix;
};

/**
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
// export const get_matrix2 = function () {
//   const m = getVector(arguments);
//   if (m.length === 6) { return m; }
//   if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
//   if (m.length < 6) {
//     return identity2x3.map((n, i) => m[i] || n);
//   }
// };

var getters = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getVector: getVector,
	getVectorOfVectors: getVectorOfVectors,
	getSegment: getSegment,
	getLine: getLine$1,
	getRay: getRay,
	getRectParams: getRectParams,
	getRect: getRect,
	getCircle: getCircle,
	getMatrix3x4: getMatrix3x4
});

/**
 * Math (c) Kraft
 */
/**
 * @notes in Robert Lang's U-D parameterization definition, U is defined
 * to be any vector made from an angle constrained between [0...180), meaning
 * the y component will never be negative.
 * The D component is allowed to be any number between -Infinity...Infinity
 *
 * The constraint on the normal-angle causes issues when converting back
 * and forth between vector-origin and UD parameterization. Lang's intention
 * is that lines do not have a directionality, whereas this library does,
 * (see: Axiom folding, which face to fold is decided by the line's vector).
 *
 * Therefore, this library modifies the paramterization slightly to allow
 * unconstrained normals, where the angle can be anywhere [0...360).
 * The cost is when testing equality, the normal and its flip must be checked,
 * or, U normals can be flipped (and the sign of D flipped) ahead of time.
 *  return d < 0
 *    ? { u: scale(u, -1/mag), d: -d }
 *    : { u: scale(u, 1/mag), d };
 */

/**
 * @description convert a line from one parameterization into another.
 * convert vector-origin into u-d (normal, distance-to-origin)
 * @linkcode Math ./src/types/parameterize.js 34
 */
// export const vectorOriginToUD = ({ vector, origin }) => {
// export const makeNormalDistanceLine = ({ vector, origin }) => {
const rayLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
/**
 * @description convert a line from one parameterization into another.
 * convert u-d (normal, distance-to-origin) into vector-origin
 * @linkcode Math ./src/types/parameterize.js 47
 */
// export const UDToVectorOrigin = ({ u, d }) => ({
// export const makeVectorOriginLine = ({ normal, distance }) => ({
const uniqueLineToRayLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});

var parameterize = /*#__PURE__*/Object.freeze({
	__proto__: null,
	rayLineToUniqueLine: rayLineToUniqueLine,
	uniqueLineToRayLine: uniqueLineToRayLine
});

/**
 * Math (c) Kraft
 */
/**
 * @description find the one item in the set which minimizes the
 * function when compared against another object provided in the arguments.
 * @param {any} obj the single item to test against the set
 * @param {any[]} array the set of items to test against
 * @param {function} compare_func a function which takes two items (which match
 * the type of the first parameter), execution of this function should return a scalar.
 * @returns {number[]} the index from the set which minimizes the compare function
 * @linkcode Math ./src/algebra/nearest.js 28
 */
const smallestComparisonSearch = (obj, array, compare_func) => {
	const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
/**
 * @description Find the indices from an array of vectors which all have
 * the smallest value within an epsilon.
 * @param {number[][]} vectors array of vectors
 * @returns {number[]} array of indices which all have the lowest X value.
 * @linkcode Math ./src/algebra/nearest.js 47
 */
const minimumXIndices = (vectors, compFn = fnEpsilonSort, epsilon = EPSILON) => {
	// find the set of all vectors that share the smallest X value within an epsilon
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][0], vectors[smallSet[0]][0], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
/**
 * @description Get the index of the point in an array considered the absolute minimum.
 * First check the X values, and in the case of multiple minimums, check the Y values.
 * @param {number[][]} points array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number} the index of the point in the array with the smallest component values
 * @linkcode Math ./src/algebra/nearest.js 67
 */
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	// find the set of all points that share the smallest X value
	const smallSet = minimumXIndices(points, fnEpsilonSort, epsilon);
	// from this set, find the point with the smallest Y value
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};

/**
 * @description find the one point in an array of 2D points closest to a 2D point.
 * @param {number[]} point the 2D point to test nearness to
 * @param {number[][]} array_of_points an array of 2D points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 85
 */
const nearestPoint2 = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the one point in an array of points closest to a point.
 * @param {number[]} point the point to test nearness to
 * @param {number[][]} array_of_points an array of points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 97
 */
const nearestPoint = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the nearest point on a line, ray, or segment.
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin a point that the line passes through
 * @param {number[]} point the point to test nearness to
 * @param {function} limiterFunc a clamp function to bound a calculation between 0 and 1
 * for segments, greater than 0 for rays, or unbounded for lines.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 113
 */
const nearestPointOnLine = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	// limit depending on line, ray, segment
	const d = limiterFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
/**
 * @description given a polygon and a point, in 2D, find a point on the boundary of the polygon
 * that is closest to the provided point.
 * @param {number[][]} polygon an array of points (which are arrays of numbers)
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 132
 */
const nearestPointOnPolygon = (polygon, point) => {
	const v = polygon
		.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	return polygon
		.map((p, i) => nearestPointOnLine(v[i], p, point, segmentLimiter))
		.map((p, i) => ({ point: p, i, distance: distance(p, point) }))
		.sort((a, b) => a.distance - b.distance)
		.shift();
};
/**
 * @description find the nearest point on the boundary of a circle to another point
 * that is closest to the provided point.
 * @param {number} radius the radius of the circle
 * @param {number[]} origin the origin of the circle as an array of numbers.
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 150
 */
const nearestPointOnCircle = (radius, origin, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));

// todo
// const nearestPointOnEllipse = () => false;

var nearest$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	smallestComparisonSearch: smallestComparisonSearch,
	minimum2DPointIndex: minimum2DPointIndex,
	nearestPoint2: nearestPoint2,
	nearestPoint: nearestPoint,
	nearestPointOnLine: nearestPointOnLine,
	nearestPointOnPolygon: nearestPointOnPolygon,
	nearestPointOnCircle: nearestPointOnCircle
});

/**
 * Math (c) Kraft
 */
/**
 * @description sort an array of 2D points along a 2D vector.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one 2D vector
 * @returns {number[][]} the same points, sorted.
 * @linkcode Math ./src/algebra/sort.js 18
 */
const sortPointsAlongVector2 = (points, vector) => points
	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.point);
/**
 * @description given an array of already-sorted values (so that comparisons only
 * need to happen between neighboring items), cluster the numbers which are similar
 * within an epsilon. isolated values still get put in length-1 arrays. (all values returned)
 * and the clusters contain the indices from the param array, not the values.
 * @param {numbers[]} an array of sorted numbers
 * @param {numbers} [epsilon=1e-6] an optional epsilon
 * @returns {numbers[][]} an array of arrays, each inner array containin indices.
 * each inner array represents clusters of values which lie within an epsilon.
 * @linkcode Math ./src/algebra/sort.js 33
 */
const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		// if this scalar fits inside the current cluster
		if (fnEpsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
/**
 * @description radially sort point indices around the lowest-value point, clustering
 * similarly-angled points within an epsilon. Within these clusters, the points are
 * sorted by distance so the nearest point is listed first.
 * @param {number[][]} points an array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} this returns indices in clusters.
 * @linkcode Math ./src/algebra/sort.js 56
 */
const radialSortPointIndices = (points = [], epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
		// .map((p, i) => Math.atan2(unitVecs[i][1], unitVecs[i][0]));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};

var sort$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	sortPointsAlongVector2: sortPointsAlongVector2,
	clusterIndicesOfSortedNumbers: clusterIndicesOfSortedNumbers,
	radialSortPointIndices: radialSortPointIndices
});

/**
 * Math (c) Kraft
 */
/**
 * @description the identity matrix for 2x2 matrices
 * @linkcode Math ./src/algebra/matrix2.js 6
 */
const identity2x2 = [1, 0, 0, 1];
/**
 * @description the identity matrix for 2x3 matrices (zero translation)
 * @linkcode Math ./src/algebra/matrix2.js 11
 */
const identity2x3 = identity2x2.concat(0, 0);
/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 * @linkcode Math ./src/algebra/matrix2.js 18
 */
const multiplyMatrix2Vector2 = (matrix, vector) => [
	matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5],
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 * @linkcode Math ./src/algebra/matrix2.js 27
 */
const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
	vector: [
		matrix[0] * vector[0] + matrix[2] * vector[1],
		matrix[1] * vector[0] + matrix[3] * vector[1],
	],
	origin: [
		matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
		matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5],
	],
});
/**
 * @param {number[]} matrix, matrix, left/right order matches what you'd see on a page.
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 42
 */
const multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
/**
 * @description calculate the determinant of a 2x3 or 2x2 matrix.
 * in the case of 2x3, the translation component is ignored.
 * @param {number[]} matrix one matrix in array form
 * @returns {number} the determinant of the matrix
 * @linkcode Math ./src/algebra/matrix2.js 57
 */
const determinant2 = m => m[0] * m[3] - m[1] * m[2];
/**
 * @description invert a 2x3 matrix
 * @param {number[]} matrix one matrix in array form
 * @returns {number[]|undefined} the inverted matrix, or undefined if not possible
 * @linkcode Math ./src/algebra/matrix2.js 64
 */
const invertMatrix2 = (m) => {
	const det = determinant2(m);
	if (Math.abs(det) < 1e-6
		|| Number.isNaN(det)
		|| !Number.isFinite(m[4])
		|| !Number.isFinite(m[5])) {
		return undefined;
	}
	return [
		m[3] / det,
		-m[1] / det,
		-m[2] / det,
		m[0] / det,
		(m[2] * m[5] - m[3] * m[4]) / det,
		(m[1] * m[4] - m[0] * m[5]) / det,
	];
};
/**
 * @param {number} x, y
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 86
 */
const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 92
 */
const makeMatrix2Scale = (x, y, origin = [0, 0]) => [
	x,
	0,
	0,
	y,
	x * -origin[0] + origin[0],
	y * -origin[1] + origin[1],
];
/**
 * @param angle of rotation, origin of transformation
 * @returns {number[]} matrix
 * @linkcode Math ./src/algebra/matrix2.js 105
 */
const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		cos,
		sin,
		-sin,
		cos,
		origin[0],
		origin[1],
	];
};
/**
 * remember vector comes before origin. origin comes last, so that it's easy
 * to leave it empty and make a reflection through the origin.
 * @param line in vector-origin form
 * @returns matrix
 * @linkcode Math ./src/algebra/matrix2.js 124
 */
const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
	// the line of reflection passes through origin, runs along vector
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
};

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/

var matrix2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	identity2x2: identity2x2,
	identity2x3: identity2x3,
	multiplyMatrix2Vector2: multiplyMatrix2Vector2,
	multiplyMatrix2Line2: multiplyMatrix2Line2,
	multiplyMatrices2: multiplyMatrices2,
	determinant2: determinant2,
	invertMatrix2: invertMatrix2,
	makeMatrix2Translate: makeMatrix2Translate,
	makeMatrix2Scale: makeMatrix2Scale,
	makeMatrix2Rotate: makeMatrix2Rotate,
	makeMatrix2Reflect: makeMatrix2Reflect
});

/**
 * Math (c) Kraft
 */

/**
 * exclusivity and inclusivity are flipped if the winding is flipped
 * these are intended for counter-clockwise winding.
 * eg: [1,0], [0,1], [-1,0], [0,-1]
 */
/**
 * @description tests if a point is inside a convex polygon
 * @param {number[]} point in array form
 * @param {number[][]} polygon in array of array form
 * @param {function} true for positive numbers, in/exclude near zero
 * @returns {boolean} is the point inside the polygon?
 * @linkcode Math ./src/intersection/overlap-polygon-point.js 23
 */
const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
	.map(side => func(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);

/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 *
 * unfortunately this has inconsistencies for when a point lies collinear along
 * an edge of the polygon, depending on the location or direction of the edge in space
 */
//
// really great function and it works for non-convex polygons
// but it has inconsistencies around inclusive and exclusive points
// when the lie along the polygon edge.
// for example, the unit square, point at 0 and at 1 alternate in/exclusive
// keeping it around in case someone can clean it up.
//
// export const point_in_poly = (point, poly) => {
//   // W. Randolph Franklin
//   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
//   let isInside = false;
//   for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//     if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
//       && point[0] < (poly[j][0] - poly[i][0])
//       * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
//       + poly[i][0]) {
//       isInside = !isInside;
//     }
//   }
//   return isInside;
// };

/**
 * Math (c) Kraft
 */

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize(lineVector), normalize(polyVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
		return t0;
	}
	return undefined;
};

const linePointFromParameter = (vector, origin, t) => add(origin, scale(vector, t));

// get all intersections with polgyon faces using the polyLineFunc:
// - includeS or excludeS
// sort them so we can grab the two most opposite intersections
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	// polygon into array of arrays [vector, origin]
	.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(fnNotUndefined)
	.sort((a, b) => a - b);

// we have already done the test that numbers is a valid array
// and the length is >= 2
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
/**
 * @description find the overlap between one line and one convex polygon and
 * clip the line into a segment (two endpoints) or return undefined if no overlap.
 * The input line can be a line, ray, or segment, as determined by "fnLine".
 * @param {number[][]} poly array of points (which are arrays of numbers)
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin the origin of the line
 * @param {function} [fnPoly=include] include or exclude polygon boundary in clip
 * @param {function} [fnLine=includeL] function to determine line/ray/segment,
 * and inclusive or exclusive.
 * @param {number} [epsilon=1e-6] optional epsilon
 * @linkcode Math ./src/geometry/clip-line-polygon.js 92
 */
const clipLineConvexPolygon = (
	poly,
	vector,
	origin,
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	// ends is now an array, length 2, of the min and max parameter on the line
	// this also verifies the two intersections are not the same point
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	// ends_clip is the intersection between 2 domains, the result
	// and the valid inclusive/exclusive function
	// todo: this line hardcodes the parameterization that segments and rays are cropping
	// their lowest point at 0 and highest (if segment) at 1
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	// if endpoints are the same, exit
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
		return undefined;
	}
	// test if the solution is collinear to an edge by getting the segment midpoint
	// then test inclusive or exclusive depending on user parameter
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};

/**
 * Math (c) Kraft
 */
/**
 * @description clip two polygons and return their union. this works for non-convex
 * poylgons, but both polygons must have counter-clockwise winding; will not work
 * even if both are similarly-clockwise. Sutherland-Hodgman algorithm.
 * Implementation is from Rosetta Code, refactored to include an epsilon.
 * @attribution https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 * @param {number[][]} polygon1 an array of points, where each point is an array of numbers.
 * @param {number[][]} polygon2 an array of points, where each point is an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a polygon as an array of points.
 * @linkcode Math ./src/geometry/clip-polygon-polygon.js 15
 */
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	let cp1;
	let cp2;
	let s;
	let e;
	const inside = (p) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = () => {
		const dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]];
		const dp = [s[0] - e[0], s[1] - e[1]];
		const n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0];
		const n2 = s[0] * e[1] - s[1] * e[0];
		const n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
		// console.log("intersection res", [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3]);
		return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
	};
	let outputList = polygon1;
	cp1 = polygon2[polygon2.length - 1];
	for (let j in polygon2) {
		cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (let i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			} else if (inside(s)) {
				outputList.push(intersection());
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

/**
 * Math (c) Kraft
 */
/**
 * measurements involving vectors and radians
 */
/**
 * @description check if the first parameter is counter-clockwise between A and B.
 * floor and ceiling can be unbounded, this method takes care of 0-2pi wrap around.
 * @param {number} angle angle in radians
 * @param {number} floor angle in radians, lower bound
 * @param {number} ceiling angle in radians, upper bound
 * @returns {boolean} is the angle between floor and ceiling
 * @linkcode Math ./src/geometry/radial.js 38
 */
const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians
 * @linkcode Math ./src/geometry/radial.js 52
 */
const clockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than clockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 71
 */
const counterClockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than counterClockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 90
 */
const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 105
 */
const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * this calculates an angle bisection between the pair of vectors
 * clockwise from the first vector to the second
 *
 *     a  x
 *       /     . bisection
 *      /   .
 *     / .
 *     --------x  b
 */
/**
 * @description calculate the angle bisection clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 129
 */
const clockwiseBisect2 = (a, b) => fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
/**
 * @description calculate the angle bisection counter-clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 137
 */
const counterClockwiseBisect2 = (a, b) => (
	fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2)
);
/**
 * @description subsect into n-divisions the angle clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 148
 */
const clockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 161
 */
const counterClockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 174
 */
const clockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 188
 */
const counterClockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description given two lines, find two lines which bisect the given lines,
 * if the given lines have an intersection, or return one line if they are parallel.
 * @param {number[]} vectorA the vector of the first line, as an array of numbers
 * @param {number[]} originA the origin of the first line, as an array of numbers
 * @param {number[]} vectorB the vector of the first line, as an array of numbers
 * @param {number[]} originB the origin of the first line, as an array of numbers
 * @param {number} [epsilon=1e-6] an optional epsilon for testing parallel-ness.
 * @returns {object[]} an array of objects with "vector" and "origin" keys defining a line
 * @linkcode Math ./src/geometry/radial.js 205
 */
const bisectLines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
	const determinant = cross2(vectorA, vectorB);
	const dotProd = dot(vectorA, vectorB);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(vectorA, vectorB)]
		: [clockwiseBisect2(vectorA, vectorB)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
	const t = numerator / determinant;
	const normalized = [vectorA, vectorB].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(originA, originB)
		: [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
/**
 * @description sort an array of angles in radians by getting an array of
 * reference indices to the input array, instead of an array of angles.
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 238
 */
const counterClockwiseOrderRadians = function () {
	const radians = Array.from(arguments).flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
/**
 * @description sort an array of vectors by getting an array of
 * reference indices to the input array, instead of a sorted array of vectors.
 * @param {number[][]} args array of vectors (which are arrays of numbers)
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 255
 */
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
/**
 * @description given an array of angles, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 267
 */
const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
/**
 * @description given an array of vectors, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[][]} args array of 2D vectors (higher dimensions will be ignored)
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 281
 */
const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		getVectorOfVectors(arguments).map(fnVec2Angle),
	);
};
/**
 * subsect the angle between two lines, can handle parallel lines
 */
// export const subsect = function (divisions, pointA, vectorA, pointB, vectorB) {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < EPSILON) { /* parallel */
//     const solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
//     const array = [solution, solution];
//     const dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dot > 0 ? 1 : 0)];
//     return array;
//   }
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const x = pointA[0] + vectorA[0] * t;
//   const y = pointA[1] + vectorA[1] * t;
//   const bisects = bisect_vectors(vectorA, vectorB);
//   bisects[1] = [-bisects[0][1], bisects[0][0]];
//   return bisects.map(el => [[x, y], el]);
// };
/**
 * @description which turn direction do 3 points make? clockwise or couter-clockwise
 * @param {number[]} p0 the start point
 * @param {number[]} p1 the middle point
 * @param {number[]} p2 the end point
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number|undefined} with 4 possible results:
 * - "0": collinear, no turn, forward
 * - "1": counter-clockwise turn, 0+epsilon < x < 180-epsilon
 * - "-1": clockwise turn, 0-epsilon > x > -180+epsilon
 * - "undefined": collinear but with a 180 degree turn.
 * @linkcode Math ./src/geometry/radial.js 319
 */
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	// not collinear
	const cross = cross2(v, u);
	if (!fnEpsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	// collinear. now we have to ensure the order is 0, 1, 2, and point
	// 1 lies between 0 and 2. otherwise we made a 180 degree turn (return undefined)
	return fnEpsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};

var radial = /*#__PURE__*/Object.freeze({
	__proto__: null,
	isCounterClockwiseBetween: isCounterClockwiseBetween,
	clockwiseAngleRadians: clockwiseAngleRadians,
	counterClockwiseAngleRadians: counterClockwiseAngleRadians,
	clockwiseAngle2: clockwiseAngle2,
	counterClockwiseAngle2: counterClockwiseAngle2,
	clockwiseBisect2: clockwiseBisect2,
	counterClockwiseBisect2: counterClockwiseBisect2,
	clockwiseSubsectRadians: clockwiseSubsectRadians,
	counterClockwiseSubsectRadians: counterClockwiseSubsectRadians,
	clockwiseSubsect2: clockwiseSubsect2,
	counterClockwiseSubsect2: counterClockwiseSubsect2,
	bisectLines2: bisectLines2,
	counterClockwiseOrderRadians: counterClockwiseOrderRadians,
	counterClockwiseOrder2: counterClockwiseOrder2,
	counterClockwiseSectorsRadians: counterClockwiseSectorsRadians,
	counterClockwiseSectors2: counterClockwiseSectors2,
	threePointTurnDirection: threePointTurnDirection
});

/**
 * Math (c) Kraft
 */
/**
 * @description mirror an array and join it at the end, except
 * do not duplicate the final element, it should only appear once.
 */
const mirror = (arr) => arr.concat(arr.slice(0, -1).reverse());
/**
 * @description Convex hull from a set of 2D points, choose whether to include or exclude
 * points which lie collinear inside one of the boundary lines. modified Graham scan algorithm.
 * @param {number[][]} points array of points, each point is an array of numbers
 * @param {boolean} [includeCollinear=false] true to include points collinear along the boundary
 * @param {number} [epsilon=1e-6] undefined behavior when larger than 0.01
 * @returns {number[]} not the points, but the indices of points in your "points" array
 * @linkcode Math ./src/geometry/convex-hull.js 19
 */
const convexHullIndices = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirror(arr)))
		.flat();
	order.push(order[0]);
	const stack = [order[0]];
	let i = 1;
	// threePointTurnDirection returns -1,0,1, with 0 as the collinear case.
	// setup our operation for each case, depending on includeCollinear
	const funcs = {
		"-1": () => stack.pop(),
		1: (next) => { stack.push(next); i += 1; },
		undefined: () => { i += 1; },
	};
	funcs[0] = includeCollinear ? funcs["1"] : funcs["-1"];
	while (i < order.length) {
		if (stack.length < 2) {
			stack.push(order[i]);
			i += 1;
			continue;
		}
		const prev = stack[stack.length - 2];
		const curr = stack[stack.length - 1];
		const next = order[i];
		const turn = threePointTurnDirection(...[prev, curr, next].map(j => points[j]), epsilon);
		funcs[turn](next);
	}
	stack.pop();
	return stack;
};
/**
 * @description Convex hull from a set of 2D points, choose whether to include or exclude
 * points which lie collinear inside one of the boundary lines. modified Graham scan algorithm.
 * @param {number[][]} points array of points, each point is an array of numbers
 * @param {boolean} [includeCollinear=false] true to include points collinear along the boundary
 * @param {number} [epsilon=1e-6] undefined behavior when larger than 0.01
 * @returns {number[][]} the convex hull as a list of points,
 * where each point is an array of numbers
 * @linkcode Math ./src/geometry/convex-hull.js 60
 */
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => (
	convexHullIndices(points, includeCollinear, epsilon)
		.map(i => points[i]));

var convexHull$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	convexHullIndices: convexHullIndices,
	convexHull: convexHull
});

/**
 * Math (c) Kraft
 */
/**
 * @description Find the intersection of two lines. Lines can be lines/rays/segments,
 * and can be inclusve or exclusive in terms of their endpoints and the epsilon value.
 * @param {number[]} vector array of 2 numbers, the first line's vector
 * @param {number[]} origin array of 2 numbers, the first line's origin
 * @param {number[]} vector array of 2 numbers, the second line's vector
 * @param {number[]} origin array of 2 numbers, the second line's origin
 * @param {function} [aFunction=includeL] first line's boolean test normalized value lies collinear
 * @param {function} [bFunction=includeL] second line's boolean test normalized value lies collinear
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|undefined} one 2D point or undefined
 * @linkcode Math ./src/intersection/intersect-line-line.js 26
*/
const intersectLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = includeL,
	bFunction = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize(aVector), normalize(bVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(aVector, bVector);
	const determinant1 = -determinant0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / determinant0;
	const t1 = cross2(b2a, aVector) / determinant1;
	if (aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector))) {
		return add(aOrigin, scale(aVector, t0));
	}
	return undefined;
};

/**
 * Math (c) Kraft
 */

const pleatParallel = (count, a, b) => {
	const origins = Array.from(Array(count - 1))
		.map((_, i) => (i + 1) / count)
		.map(t => lerp(a.origin, b.origin, t));
	const vector = [...a.vector];
	return origins.map(origin => ({ origin, vector }));
};

const pleatAngle = (count, a, b) => {
	const origin = intersectLineLine(a.vector, a.origin, b.vector, b.origin);
	const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
		? clockwiseSubsect2(count, a.vector, b.vector)
		: counterClockwiseSubsect2(count, a.vector, b.vector);
	return vectors.map(vector => ({ origin, vector }));
};
/**
 * @description Between two lines, make a repeating sequence of
 * evenly-spaced lines to simulate a series of pleats.
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {number} the number of faces, the number of lines will be n-1.
 * @returns {line[]} an array of lines, objects which contain "vector" and "origin"
 * @linkcode Math ./src/geometry/pleat.js 39
 */
const pleat = (count, a, b) => {
	const lineA = getLine$1(a);
	const lineB = getLine$1(b);
	return parallel(lineA.vector, lineB.vector)
		? pleatParallel(count, lineA, lineB)
		: pleatAngle(count, lineA, lineB);
};

var pleat$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	pleat: pleat
});

/**
 * Math (c) Kraft
 */

/**
 * the radius parameter measures from the center to the midpoint of the edge
 * vertex-axis aligned
 * todo: also possible to parameterize the radius as the center to the points
 * todo: can be edge-aligned
 */
const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));

const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)])
	.map(pt => pt.map(n => cleanNumber(n, 14))); // this step is costly!
// a = 2r tan(π/n)
/**
 * @description Make a regular polygon from a circumradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 34
 */
const makePolygonCircumradius = (sides = 3, radius = 1) => (
	anglesToVecs(angleArray(sides), radius)
);
/**
 * @description Make a regular polygon from a circumradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 45
 */
const makePolygonCircumradiusSide = (sides = 3, radius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, radius);
};
/**
 * @description Make a regular polygon from a inradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 58
 */
const makePolygonInradius = (sides = 3, radius = 1) => (
	makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a inradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 68
 */
const makePolygonInradiusSide = (sides = 3, radius = 1) => (
	makePolygonCircumradiusSide(sides, radius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 78
 */
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 88
 */
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Remove any collinear vertices from a n-dimensional polygon.
 * @param {number[][]} polygon a polygon as an array of ordered points in array form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a copy of the polygon with collinear points removed
 * @linkcode Math ./src/geometry/polygons.js 97
 */
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	// index map [i] to [i, i+1]
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	// the vertex to be removed. true=valid, false=collinear.
	// ask if an edge is parallel to its predecessor, this way,
	// the edge index will match to the collinear vertex.
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
/**
 * @description Calculates the circumcircle which lies on three points.
 * @param {number[]} a one 2D point as an array of numbers
 * @param {number[]} b one 2D point as an array of numbers
 * @param {number[]} c one 2D point as an array of numbers
 * @returns {circle} one circle with keys "radius" (number) and "origin" (number[])
 * @linkcode Math ./src/geometry/polygons.js 119
 */
const circumcircle = function (a, b, c) {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};
/**
 * @description Calculates the signed area of a polygon.
 * This requires the polygon be non-self-intersecting.
 * @param {number[][]} points an array of 2D points, which are arrays of numbers
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea([ [1,2], [5,6], [7,0] ])
 * @linkcode Math ./src/geometry/polygons.js 154
 */
const signedArea = points => 0.5 * points
	.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		return el[0] * next[1] - next[0] * el[1];
	}).reduce(fnAdd, 0);
/**
 * @description Calculates the centroid or the center of mass of the polygon.
 * @param {number[][]} points an array of 2D points, which are arrays of numbers
 * @returns {number[]} one 2D point as an array of numbers
 * @example
 * var centroid = polygon.centroid([ [1,2], [8,9], [8,0] ])
 * @linkcode Math ./src/geometry/polygons.js 167
 */
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		const mag = el[0] * next[1] - next[0] * el[1];
		return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
	}).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(c => c * sixthArea);
};
/**
 * @description Make an axis-aligned bounding box that encloses a set of points.
 * the optional padding is used to make the bounding box inclusive / exclusive
 * by adding padding on all sides, or inset in the case of negative number.
 * (positive=inclusive boundary, negative=exclusive boundary)
 * @param {number[][]} points an array of unsorted points, in any dimension
 * @param {number} [padding=0] optionally add padding around the box
 * @returns {BoundingBox} an object where "min" and "max" are two points and "span" is the lengths
 * @linkcode Math ./src/geometry/polygons.js 186
 */
const boundingBox = (points, padding = 0) => {
	const min = Array(points[0].length).fill(Infinity);
	const max = Array(points[0].length).fill(-Infinity);
	points.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};

var polygons = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makePolygonCircumradius: makePolygonCircumradius,
	makePolygonCircumradiusSide: makePolygonCircumradiusSide,
	makePolygonInradius: makePolygonInradius,
	makePolygonInradiusSide: makePolygonInradiusSide,
	makePolygonSideLength: makePolygonSideLength,
	makePolygonSideLengthSide: makePolygonSideLengthSide,
	makePolygonNonCollinear: makePolygonNonCollinear,
	circumcircle: circumcircle,
	signedArea: signedArea,
	centroid: centroid,
	boundingBox: boundingBox
});

/**
 * Math (c) Kraft
 */
/**
 * @description check if a point lies collinear along a line, and specify if the
 * line is a line/ray/segment and test whether the point lies within endpoint(s).
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @param {number[]} point one 2D point
 * @parma {function} [func=excludeL] specify line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the point collinear to the line, and in the case of ray/segment,
 * does the point lie within the bounds of the ray/segment?
 * @linkcode Math ./src/intersection/overlap-line-point.js 22
 */
const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	// the line is degenerate
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

/**
 * Math (c) Kraft
 */
/**
 * @description Split a convex polygon by a line and rebuild each half into two convex polygons.
 * @param {number[][]} polygon an array of points, each point is an array of numbers
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @returns {number[][][]} an array of one or two polygons, each polygon is an array of points,
 * each point is an array of numbers.
 * @linkcode Math ./src/geometry/split-polygon.js 19
 */
const splitConvexPolygon = (poly, lineVector, linePoint) => {
	// todo: should this return undefined if no intersection?
	//       or the original poly?

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(lineVector, linePoint, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly.map((v, i, arr) => ({
		point: intersectLineLine(
			lineVector,
			linePoint,
			subtract(v, arr[(i + 1) % arr.length]),
			arr[(i + 1) % arr.length],
			excludeL,
			excludeS,
		),
		at_index: i,
	}))
		.filter(el => el.point != null);

	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);

		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};

/**
 * Math (c) Kraft
 */
/**
 * @description this recursive algorithm works outwards-to-inwards, each repeat
 * decreases the size of the polygon by one point/side. (removes 2, adds 1)
 * and repeating the algorithm on the smaller polygon.
 *
 * @param {number[][]} array of point objects (arrays of numbers, [x, y]). the
 *   counter-clockwise sorted points of the polygon. as we recurse this list shrinks
 *   by removing the points that are "finished".
 *
 * @returns {object[]} array of line segments as objects with keys:
 *   "points": array of 2 points in array form [ [x, y], [x, y] ]
 *   "type": "skeleton" or "kawasaki", the latter being the projected perpendicular
 *   dropped edges down to the sides of the polygon.
 */
const recurseSkeleton = (points, lines, bisectors) => {
	// every point has an interior angle bisector vector, this ray is
	// tested for intersections with its neighbors on both sides.
	// "intersects" is fencepost mapped (i) to "points" (i, i+1)
	// because one point/ray intersects with both points on either side,
	// so in reverse, every point (i) relates to intersection (i-1, i)
	const intersects = points
		// .map((p, i) => math.ray(bisectors[i], p))
		// .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray.vector,
			ray.origin,
			arr[(i + 1) % arr.length].vector,
			arr[(i + 1) % arr.length].origin,
			excludeR,
			excludeR,
		));
	// project each intersection point down perpendicular to the edge of the polygon
	// const projections = lines.map((line, i) => line.nearestPoint(intersects[i]));
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line.vector, line.origin, intersects[i], a => a)
	));
	// when we reach only 3 points remaining, we are at the end. we can return early
	// and skip unnecessary calculations, all 3 projection lengths will be the same.
	if (points.length === 3) {
		return points.map(p => ({ type: "skeleton", points: [p, intersects[0]] }))
			.concat([{ type: "perpendicular", points: [projections[0], intersects[0]] }]);
	}
	// measure the lengths of the projected lines, these will be used to identify
	// the smallest length, or the point we want to operate on this round.
	const projectionLengths = intersects
		.map((intersect, i) => distance(intersect, projections[i]));
	let shortest = 0;
	projectionLengths.forEach((len, i) => {
		if (len < projectionLengths[shortest]) { shortest = i; }
	});
	// we have the shortest length, we now have the solution for this round
	// (all that remains is to prepare the arguments for the next recursive call)
	const solutions = [
		{
			type: "skeleton",
			points: [points[shortest], intersects[shortest]],
		},
		{
			type: "skeleton",
			points: [points[(shortest + 1) % points.length], intersects[shortest]],
		},
		// perpendicular projection
		// we could expand this algorithm here to include all three instead of just one.
		// two more of the entries in "intersects" will have the same length as shortest
		{ type: "perpendicular", points: [projections[shortest], intersects[shortest]] },
		// ...projections.map(p => ({ type: "perpendicular", points: [p, intersects[shortest]] }))
	];
	// our new smaller polygon, missing two points now, but gaining one more (the intersection)
	// this is to calculate the new angle bisector at this new point.
	// we are now operating on the inside of the polygon, the lines that will be built from
	// this bisection will become interior skeleton lines.
	// first, flip the first vector so that both of the vectors originate at the
	// center point, and extend towards the neighbors.
	const newVector = clockwiseBisect2(
		flip(lines[(shortest + lines.length - 1) % lines.length].vector),
		lines[(shortest + 1) % lines.length].vector,
	);
	// delete 2 entries from "points" and "bisectors" and add each array's new element.
	// delete 1 entry from lines.
	const shortest_is_last_index = shortest === points.length - 1;
	points.splice(shortest, 2, intersects[shortest]);
	lines.splice(shortest, 1);
	bisectors.splice(shortest, 2, newVector);
	if (shortest_is_last_index) {
		// in the case the index was at the end of the array,
		// we tried to remove two elements but only removed one because
		// it was the last element. remove the first element too.
		points.splice(0, 1);
		bisectors.splice(0, 1);
		// also, the fencepost mapping of the lines array is off by one,
		// move the first element to the end of the array.
		lines.push(lines.shift());
	}
	return solutions.concat(recurseSkeleton(points, lines, bisectors));
};
/**
 * @description create a straight skeleton inside of a convex polygon
 * @param {number[][]} points counter-clockwise polygon as an array of points
 * (which are arrays of numbers)
 * @returns {object[]} list of objects containing "points" {number[][]}: two points
 * defining a line segment, and "type" {string}: either "skeleton" or "perpendicular"
 *
 * make sure:
 *  - your polygon is convex (todo: make this algorithm work with non-convex)
 *  - your polygon points are sorted counter-clockwise
 * @linkcode Math ./src/geometry/straight-skeleton.js 123
 */
const straightSkeleton = (points) => {
	// first time running this function, create the 2nd and 3rd parameters
	// convert the edges of the polygons into lines
	const lines = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		// .map(side => math.line.fromPoints(...side));
		.map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	// get the interior angle bisectors for every corner of the polygon
	// index map match to "points"
	const bisectors = points
		// each element into 3 (previous, current, next)
		.map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
			.map(j => ar[j]))
		// make 2 vectors, from current point to previous/next neighbors
		.map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
		// it is a little counter-intuitive but the interior angle between three
		// consecutive points in a counter-clockwise wound polygon is measured
		// in the clockwise direction
		.map(v => clockwiseBisect2(...v));
	// points is modified in place. create a copy
	// const points_clone = JSON.parse(JSON.stringify(points));
	// console.log("ss points", points_clone, points);
	return recurseSkeleton([...points], lines, bisectors);
};

/**
 * @description Check if a point is collinear and between two other points.
 * @param {number[]} p0 a segment point
 * @param {number[]} p1 the point to test collinearity
 * @param {number[]} p2 a segment point
 * @param {boolean} [inclusive=false] if the point is the same as the endpoints
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} true if the point lies collinear and between the other two points.
 * @linkcode Math ./src/intersection/general.js 19
 */
const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => fnEpsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return fnEpsilonEqual(1.0, dot(...vectors), epsilon);
};

var generalIntersect = /*#__PURE__*/Object.freeze({
	__proto__: null,
	collinearBetween: collinearBetween
});

/**
 * Math (c) Kraft
 */

const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};

const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
/**
 * @description calculate the intersection of two circles, resulting in either no intersection,
 * or one or two points.
 * @param {number} radius1 the first circle's radius
 * @param {number[]} origin1 the first circle's origin
 * @param {number} radius2 the second circle's radius
 * @param {number[]} origin2 the second circle's origin
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]|undefined} an array of one or two points, or undefined if no intersection
 * @linkcode Math ./src/intersection/intersect-circle-circle.js 28
 */
const intersectCircleCircle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
	// sort by largest-smallest radius
	const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
	const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
	const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
	const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
	// this is also the starting vector to rotate around the big circle
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	// infinite solutions // don't need this because the below case covers it
	// if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
	// no intersection (same center, different size)
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	// kissing circles
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	// circles are contained
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};

/**
 * Math (c) Kraft
 */
/**
 * @description Calculate the intersection of a circle and a line; the line can
 * be a line, ray, or segment.
 * @param {number} circleRadius the circle's radius
 * @param {number[]} circleOrigin the center of the circle
 * @param {number[]} lineVector the vector component of the line
 * @param {number[]} lineOrigin the origin component of the line
 * @param {function} [lineFunc=includeL] set the line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/intersect-circle-line.js 20
 */
const intersectCircleLine = (
	circle_radius,
	circle_origin,
	line_vector,
	line_origin,
	line_func = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract(line_origin, circle_origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
	const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f)) // tangent to circle
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
		.map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => line_func(ts[i], epsilon));
};

/**
 * Math (c) Kraft
 */

// todo, this is copied over in clip/polygon.js
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const intersectConvexPolygonLineInclusive = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
		.map(side => intersectLineLine(
			subtract(side[1], side[0]),
			side[0],
			vector,
			origin,
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		// for two intersection points or more, in the case of vertex-
		// collinear intersections the same point from 2 polygon sides
		// can be returned. we need to filter for unique points.
		// if no 2 unique points found:
		// there was only one unique intersection point after all.
		return getUniquePair(intersections) || [intersections[0]];
	}
};

/**
 * @description generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 *
 * this doubles as the exclusive condition, and the main export since it
 * checks for exclusive/inclusive and can early-return
 * @linkcode Math ./src/intersection/intersect-polygon-line.js 78
 */
const intersectConvexPolygonLine = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		fn_poly,
		fn_line,
		epsilon,
	);
	// const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
	let altFunc; // the opposite func, as far as inclusive/exclusive
	switch (fn_line) {
	// case excludeL: altFunc = includeL; break;
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	// here on, we are only dealing with exclusive tests, parsing issues with
	// vertex-on intersections that still intersect or don't intersect the polygon.
	// repeat the computation but include intersections with the polygon's vertices.
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		includeS,
		altFunc,
		epsilon,
	);
	// const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
	// if there are still no intersections, the line doesn't intersect.
	if (includes === undefined) { return undefined; }
	// if there are intersections, see if the line crosses the entire polygon
	// (gives us 2 unique points)
	const uniqueIncludes = getUniquePair(includes);
	// first, deal with the case that there are no unique 2 points.
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		// if there is one intersection, check if a ray's origin is inside.
		// 1. if the origin is inside, consider the intersection valid
		// 2. if the origin is outside, same as the line case above. no intersection.
		case excludeR:
			// is the ray origin inside?
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, check if either of a segment's points are
		// inside the polygon, same as the ray above. if neither are, consider
		// the intersection invalid for the exclusive case.
		case excludeS:
			return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, an infinite line is intersecting the
		// polygon from the outside touching at just one vertex. this should be
		// considered undefined for the exclusive case.
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	// now that we've covered all the other cases, we know that the line intersects
	// the polygon at two unique points. this should return true for all cases
	// except one: when the line is collinear to an edge of the polygon.
	// to test this, get the midpoint of the two intersects and do an exclusive
	// check if the midpoint is inside the polygon. if it is, the line is crossing
	// the polygon and the intersection is valid.
	return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

/**
 * Math (c) Kraft
 */

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const intersect_param_form = {
	polygon: a => [a],
	rect: a => [a],
	circle: a => [a.radius, a.origin],
	line: a => [a.vector, a.origin],
	ray: a => [a.vector, a.origin],
	segment: a => [a.vector, a.origin],
	// segment: a => [subtract(a[1], a[0]), a[0]],
};

const intersect_func = {
	polygon: {
		// polygon: intersectPolygonPolygon,
		// circle: convex_poly_circle,
		line: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
	},
	circle: {
		// polygon: (a, b) => convex_poly_circle(b, a),
		circle: (a, b, fnA, fnB, ep) => intersectCircleCircle(...a, ...b, ep),
		line: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
	},
	line: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	ray: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
	segment: {
		polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
		circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
		line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
	},
};

// convert "rect" to "polygon"
const similar_intersect_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
};

const default_intersect_domain_function = {
	polygon: exclude, // not used
	rect: exclude, // not used
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
};

/**
 * @name intersect
 * @description get the intersection of two geometry objects, the type of each is inferred.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|number[][]|undefined} the type of the result varies depending on
 * the type of the input parameters, it is always one point, or an array of points,
 * or undefined if no intersection.
 * @linkcode Math ./src/intersection/intersect.js 92
 */
const intersect$1 = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_intersect_types[type_a];
	const bT = similar_intersect_types[type_b];
	const params_a = intersect_param_form[type_a](a);
	const params_b = intersect_param_form[type_b](b);
	const domain_a = a.domain_function || default_intersect_domain_function[type_a];
	const domain_b = b.domain_function || default_intersect_domain_function[type_b];
	return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

/**
 * Math (c) Kraft
 */
/**
 * @description find out if two convex polygons are overlapping by searching
 * for a dividing axis, which should be one side from one of the polygons.
 * @linkcode Math ./src/intersection/overlap-polygons.js 13
 */
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		// for non-overlapping convex polygons, it's possible that only only
		// one edge on one polygon holds the property of being a dividing axis.
		// we must run the algorithm on both polygons
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			// each edge of polygonA will become a line
			const origin = polyA[i];
			const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
			// project each point from the other polygon on to the line's perpendicular
			// also, subtracting the origin (from the first poly) such that the
			// numberline is centered around zero. if the test passes, this polygon's
			// projections will be entirely above or below 0.
			const projected = polyB
				.map(point => subtract(point, origin))
				.map(v => dot(vector, v));
			// is the first polygon on the positive or negative side?
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot(vector, subtract(other_test_point, origin));
			const side = side_a > 0; // use 0. not epsilon
			// is the second polygon on whichever side of 0 that the first isn't?
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			// if true, we found a dividing axis
			if (one_sided) { return false; }
		}
	}
	return true;
};

/**
 * Math (c) Kraft
 */

const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) => (
	func(radius - distance2(origin, point), epsilon)
);

/**
 * Math (c) Kraft
 */
/**
 * @description 2D line intersection function, generalized and works for lines,
 * rays, segments.
 * @param {number[]} array of 2 numbers, the first line's vector
 * @param {number[]} array of 2 numbers, the first line's origin
 * @param {number[]} array of 2 numbers, the second line's vector
 * @param {number[]} array of 2 numbers, the second line's origin
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/

// export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;

const overlapLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(aVector, bVector);
	const denominator1 = -denominator0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	if (Math.abs(denominator0) < epsilon) { // parallel
		if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
		const bPt1 = a2b;
		const bPt2 = add(bPt1, bVector);
		// a will be between 0 and 1
		const aProjLen = dot(aVector, aVector);
		const bProj1 = dot(bPt1, aVector) / aProjLen;
		const bProj2 = dot(bPt2, aVector) / aProjLen;
		const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
		const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
		const bOutside1 = bProjSm > 1 - epsilon;
		const bOutside2 = bProjLg < epsilon;
		if (bOutside1 || bOutside2) { return false; }
		return true;
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / denominator0;
	const t1 = cross2(b2a, aVector) / denominator1;
	return aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector));
};

/**
 * Math (c) Kraft
 */

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const overlap_param_form = {
	polygon: a => [a],
	rect: a => [a],
	circle: a => [a.radius, a.origin],
	line: a => [a.vector, a.origin],
	ray: a => [a.vector, a.origin],
	segment: a => [a.vector, a.origin],
	// segment: a => [subtract(a[1], a[0]), a[0]],
	vector: a => [a],
};

const overlap_func = {
	polygon: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygons(...a, ...b, ep),
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...a, ...b, fnA, ep),
	},
	circle: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapCirclePoint(...a, ...b, exclude, ep),
	},
	line: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	ray: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	segment: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
	},
	vector: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...b, ...a, fnB, ep),
		circle: (a, b, fnA, fnB, ep) => overlapCirclePoint(...b, ...a, exclude, ep),
		line: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => fnEpsilonEqualVectors(...a, ...b, ep),
	},
};

// convert "rect" to "polygon"
const similar_overlap_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
	vector: "vector",
};

const default_overlap_domain_function = {
	polygon: exclude,
	rect: exclude,
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
	vector: excludeL, // not used
};
/**
 * @name overlap
 * @description test whether or not two geometry objects overlap each other.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {boolean} true if the two objects overlap.
 * @linkcode Math ./src/intersection/overlap.js 106
 */
const overlap$1 = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_overlap_types[type_a];
	const bT = similar_overlap_types[type_b];
	const params_a = overlap_param_form[type_a](a);
	const params_b = overlap_param_form[type_b](b);
	const domain_a = a.domain_function || default_overlap_domain_function[type_a];
	const domain_b = b.domain_function || default_overlap_domain_function[type_b];
	return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

/**
 * Math (c) Kraft
 */
/**
 * @description does one polygon (outer) completely enclose another polygon (inner),
 * currently, this only works for convex polygons.
 * @param {number[][]} outer a 2D convex polygon
 * @param {number[][]} inner a 2D convex polygon
 * @param {function} [fnInclusive] by default, the boundary is considered inclusive
 * @returns {boolean} is the "inner" polygon completely inside the "outer"
 *
 * @todo: should one function be include and the other exclude?
 * @linkcode Math ./src/intersection/enclose-polygons.js 17
 */
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	// these points should be *not inside* (false)
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	// these points should be *inside* (true)
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};

/**
 * Math (c) Kraft
 */
/**
 * @description Test if two axis-aligned bounding boxes overlap each other.
 * @param {BoundingBox} box1 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @param {BoundingBox} box2 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @returns {boolean} true if the bounding boxes overlap each other
 * @linkcode Math ./src/intersection/overlap-bounding-boxes.js 9
 */
const overlapBoundingBoxes = (box1, box2) => {
	const dimensions = box1.min.length > box2.min.length
		? box2.min.length
		: box1.min.length;
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
			return false;
		}
	}
	return true;
};

/**
 * Math (c) Kraft
 */

const VectorArgs = function () {
	this.push(...getVector(arguments));
};

/**
 * Math (c) Kraft
 */
const VectorGetters = {
	x: function () { return this[0]; },
	y: function () { return this[1]; },
	z: function () { return this[2]; },
	// magnitude: function () { return magnitude(this); },
};

/**
 * Math (c) Kraft
 */

const table = {
	preserve: { // don't transform the return type. preserve it
		magnitude: function () { return magnitude(this); },
		isEquivalent: function () {
			return fnEpsilonEqualVectors(this, getVector(arguments));
		},
		isParallel: function () {
			return parallel(...resizeUp(this, getVector(arguments)));
		},
		isCollinear: function (line) {
			return overlap$1(this, line);
		},
		dot: function () {
			return dot(...resizeUp(this, getVector(arguments)));
		},
		distanceTo: function () {
			return distance(...resizeUp(this, getVector(arguments)));
		},
		overlap: function (other) {
			return overlap$1(this, other);
		},
	},
	vector: { // return type
		copy: function () { return [...this]; },
		normalize: function () { return normalize(this); },
		scale: function () { return scale(this, arguments[0]); },
		flip: function () { return flip(this); },
		rotate90: function () { return rotate90(this); },
		rotate270: function () { return rotate270(this); },
		cross: function () {
			return cross3(
				resize(3, this),
				resize(3, getVector(arguments)),
			);
		},
		transform: function () {
			return multiplyMatrix3Vector3(
				getMatrix3x4(arguments),
				resize(3, this),
			);
		},
		/**
		 * @description add a vector to this vector.
		 * @param {number[]} vector one vector
		 * @returns {number[]} one vector, the sum of this and the input vector
		 */
		add: function () {
			return add(this, resize(this.length, getVector(arguments)));
		},
		subtract: function () {
			return subtract(this, resize(this.length, getVector(arguments)));
		},
		// todo, can this be improved?
		rotateZ: function (angle, origin) {
			return multiplyMatrix3Vector3(
				getMatrix3x4(makeMatrix2Rotate(angle, origin)),
				resize(3, this),
			);
		},
		lerp: function (vector, pct) {
			return lerp(this, resize(this.length, getVector(vector)), pct);
		},
		midpoint: function () {
			return midpoint(...resizeUp(this, getVector(arguments)));
		},
		bisect: function () {
			return counterClockwiseBisect2(this, getVector(arguments));
		},
	},
};

// the default export
const VectorMethods = {};

Object.keys(table.preserve).forEach(key => {
	VectorMethods[key] = table.preserve[key];
});

Object.keys(table.vector).forEach(key => {
	VectorMethods[key] = function () {
		return Constructors.vector(...table.vector[key].apply(this, arguments));
	};
});

/**
 * Math (c) Kraft
 */

const VectorStatic = {
	fromAngle: function (angle) {
		return Constructors.vector(Math.cos(angle), Math.sin(angle));
	},
	fromAngleDegrees: function (angle) {
		return Constructors.vector.fromAngle(angle * D2R);
	},
};

/**
 * Math (c) Kraft
 */

var Vector = {
	vector: {
		P: Array.prototype, // vector is a special case, it's an instance of an Array
		A: VectorArgs,
		G: VectorGetters,
		M: VectorMethods,
		S: VectorStatic,
	},
};

/**
 * Math (c) Kraft
 */

var Static = {
	fromPoints: function () {
		const points = getVectorOfVectors(arguments);
		return this.constructor({
			vector: subtract(points[1], points[0]),
			origin: points[0],
		});
	},
	fromAngle: function () {
		const angle = arguments[0] || 0;
		return this.constructor({
			vector: [Math.cos(angle), Math.sin(angle)],
			origin: [0, 0],
		});
	},
	perpendicularBisector: function () {
		const points = getVectorOfVectors(arguments);
		return this.constructor({
			vector: rotate90(subtract(points[1], points[0])),
			origin: average(points[0], points[1]),
		});
	},
};

/**
 * Math (c) Kraft
 */

// do not define object methods as arrow functions in here

/**
 * this prototype is shared among line types: lines, rays, segments.
 * it's counting on each type having defined:
 * - an origin
 * - a vector
 * - domain_function which takes one or two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */

const LinesMethods = {
// todo, this only takes line types. it should be able to take a vector
	isParallel: function () {
		const arr = resizeUp(this.vector, getLine$1(arguments).vector);
		return parallel(...arr);
	},
	isCollinear: function () {
		const line = getLine$1(arguments);
		return overlapLinePoint(this.vector, this.origin, line.origin)
			&& parallel(...resizeUp(this.vector, line.vector));
	},
	isDegenerate: function (epsilon = EPSILON) {
		return degenerate(this.vector, epsilon);
	},
	reflectionMatrix: function () {
		return Constructors.matrix(makeMatrix3ReflectZ(this.vector, this.origin));
	},
	nearestPoint: function () {
		const point = getVector(arguments);
		return Constructors.vector(
			nearestPointOnLine(this.vector, this.origin, point, this.clip_function),
		);
	},
	// this works with lines and rays, it should be overwritten for segments
	transform: function () {
		const dim = this.dimension;
		const r = multiplyMatrix3Line3(
			getMatrix3x4(arguments),
			resize(3, this.vector),
			resize(3, this.origin),
		);
		return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
	},
	translate: function () {
		const origin = add(...resizeUp(this.origin, getVector(arguments)));
		return this.constructor(this.vector, origin);
	},
	intersect: function () {
		return intersect$1(this, ...arguments);
	},
	overlap: function () {
		return overlap$1(this, ...arguments);
	},
	bisect: function (lineType, epsilon) {
		const line = getLine$1(lineType);
		return bisectLines2(this.vector, this.origin, line.vector, line.origin, epsilon)
			.map(l => this.constructor(l));
	},
};

/**
 * Math (c) Kraft
 */

var Line = {
	line: {
		P: Object.prototype,

		A: function () {
			const l = getLine$1(...arguments);
			this.vector = Constructors.vector(l.vector);
			this.origin = Constructors.vector(resize(this.vector.length, l.origin));
			const alt = rayLineToUniqueLine({ vector: this.vector, origin: this.origin });
			this.normal = alt.normal;
			this.distance = alt.distance;
			Object.defineProperty(this, "domain_function", { writable: true, value: includeL });
		},

		G: {
			// length: () => Infinity,
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeL; return this; },
			exclusive: function () { this.domain_function = excludeL; return this; },
			clip_function: dist => dist,
			svgPath: function (length = 20000) {
				const start = add(this.origin, scale(this.vector, -length / 2));
				const end = scale(this.vector, length);
				return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
			},
		}),

		S: Object.assign({
			fromNormalDistance: function () {
				return this.constructor(uniqueLineToRayLine(arguments[0]));
			},
		}, Static),

	},
};

/**
 * Math (c) Kraft
 */

// LineProto.prototype.constructor = LineProto;

var Ray = {
	ray: {
		P: Object.prototype,

		A: function () {
			const ray = getLine$1(...arguments);
			this.vector = Constructors.vector(ray.vector);
			this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
			Object.defineProperty(this, "domain_function", { writable: true, value: includeR });
		},

		G: {
			// length: () => Infinity,
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeR; return this; },
			exclusive: function () { this.domain_function = excludeR; return this; },
			flip: function () {
				return Constructors.ray(flip(this.vector), this.origin);
			},
			scale: function (scale) {
				return Constructors.ray(this.vector.scale(scale), this.origin);
			},
			normalize: function () {
				return Constructors.ray(this.vector.normalize(), this.origin);
			},
			// distance is between 0 and 1, representing the vector between start and end. cap accordingly
			clip_function: rayLimiter,
			svgPath: function (length = 10000) {
				const end = this.vector.scale(length);
				return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
			},

		}),

		S: Static,

	},
};

/**
 * Math (c) Kraft
 */

var Segment = {
	segment: {
		P: Array.prototype,

		A: function () {
			const a = getSegment(...arguments);
			this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
			this.vector = Constructors.vector(subtract(this[1], this[0]));
			// the fast way, but i think we need the ability to call seg[0].x
			// this.push(a[0], a[1]);
			// this.vector = subtract(this[1], this[0]);
			this.origin = this[0];
			Object.defineProperty(this, "domain_function", { writable: true, value: includeS });
		},

		G: {
			points: function () { return this; },
			magnitude: function () { return magnitude(this.vector); },
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, LinesMethods, {
			inclusive: function () { this.domain_function = includeS; return this; },
			exclusive: function () { this.domain_function = excludeS; return this; },
			clip_function: segmentLimiter,
			transform: function (...innerArgs) {
				const dim = this.points[0].length;
				const mat = getMatrix3x4(innerArgs);
				const transformed_points = this.points
					.map(point => resize(3, point))
					.map(point => multiplyMatrix3Vector3(mat, point))
					.map(point => resize(dim, point));
				return Constructors.segment(transformed_points);
			},
			translate: function () {
				const translate = getVector(arguments);
				const transformed_points = this.points
					.map(point => add(...resizeUp(point, translate)));
				return Constructors.segment(transformed_points);
			},
			midpoint: function () {
				return Constructors.vector(average(this.points[0], this.points[1]));
			},
			svgPath: function () {
				const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
				return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
					.join("");
			},
		}),

		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},

	},
};

/**
 * Math (c) Kraft
 */
/**
 * circle constructors:
 * circle(1, [4,5]) radius:1, origin:4,5
 * circle([4,5], 1) radius:1, origin:4,5
 * circle(1, 2) radius: 2, origin:1
 * circle(1, 2, 3) radius: 3, origin:1,2
 * circle(1, 2, 3, 4) radius: 4, origin:1,2,3
 * circle([1,2], [3,4]) radius:(dist between pts), origin:1,2
 * circle([1,2], [3,4], [5,6]) circumcenter between 3 points
 */

const CircleArgs = function () {
	const circle = getCircle(...arguments);
	this.radius = circle.radius;
	this.origin = Constructors.vector(...circle.origin);
};

/**
 * Math (c) Kraft
 */
const CircleGetters = {
	x: function () { return this.origin[0]; },
	y: function () { return this.origin[1]; },
	z: function () { return this.origin[2]; },
};

/**
 * Math (c) Kraft
 */

const pointOnEllipse = function (cx, cy, rx, ry, zRotation, arcAngle) {
	const cos_rotate = Math.cos(zRotation);
	const sin_rotate = Math.sin(zRotation);
	const cos_arc = Math.cos(arcAngle);
	const sin_arc = Math.sin(arcAngle);
	return [
		cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc,
		cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc,
	];
};

const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
	let arcStart = arcStart_;
	if (arcStart < 0 && !Number.isNaN(arcStart)) {
		while (arcStart < 0) {
			arcStart += Math.PI * 2;
		}
	}
	const deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
	const start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
	// we need to divide the circle in half and make 2 arcs
	const middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
	const end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
	const fa = ((deltaArc / 2) > Math.PI) ? 1 : 0;
	const fs = ((deltaArc / 2) > 0) ? 1 : 0;
	return {
		x1: start[0],
		y1: start[1],
		x2: middle[0],
		y2: middle[1],
		x3: end[0],
		y3: end[1],
		fa,
		fs,
	};
};

const cln = n => cleanNumber(n, 4);

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) => (
	`A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`
);

/**
 * Math (c) Kraft
 */

// // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
// const circleArcTo = (radius, end) =>
//   `A${radius} ${radius} 0 0 0 ${end[0]} ${end[1]}`;

// const circlePoint = (origin, radius, angle) => [
//   origin[0] + radius * Math.cos(angle),
//   origin[1] + radius * Math.sin(angle),
// ];

// const circlePoints = c => Array.from(Array(count))
//   .map((_, i) => { return })

const CircleMethods = {
	nearestPoint: function () {
		return Constructors.vector(nearestPointOnCircle(
			this.radius,
			this.origin,
			getVector(arguments),
		));
	},

	intersect: function (object) {
		return intersect$1(this, object);
	},

	overlap: function (object) {
		return overlap$1(this, object);
	},

	svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
		const info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
		const arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
		const arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
		return `M${info.x1} ${info.y1}${arc1}${arc2}`;

		// const arcMid = arcStart + deltaArc / 2;
		// const start = circlePoint(this.origin, this.radius, arcStart);
		// const mid = circlePoint(this.origin, this.radius, arcMid);
		// const end = circlePoint(this.origin, this.radius, arcStart + deltaArc);
		// const arc1 = circleArcTo(this.radius, mid);
		// const arc2 = circleArcTo(this.radius, end);
		// return `M${cln(start[0])} ${cln(start[1])}${arc1}${arc2}`;
	},
	points: function (count = 128) {
		return Array.from(Array(count))
			.map((_, i) => ((2 * Math.PI) / count) * i)
			.map(angle => [
				this.origin[0] + this.radius * Math.cos(angle),
				this.origin[1] + this.radius * Math.sin(angle),
			]);
	},
	polygon: function () {
		return Constructors.polygon(this.points(arguments[0]));
	},
	segments: function () {
		const points = this.points(arguments[0]);
		return points.map((point, i) => {
			const nextI = (i + 1) % points.length;
			return [point, points[nextI]];
		}); // .map(a => Constructors.segment(...a));
	},
};

/**
 * Math (c) Kraft
 */

const CircleStatic = {
	fromPoints: function () {
		if (arguments.length === 3) {
			const result = circumcircle(...arguments);
			return this.constructor(result.radius, result.origin);
		}
		return this.constructor(...arguments);
	},
	fromThreePoints: function () {
		const result = circumcircle(...arguments);
		return this.constructor(result.radius, result.origin);
	},
};

/**
 * Math (c) Kraft
 */

var Circle = {
	circle: {
		A: CircleArgs,
		G: CircleGetters,
		M: CircleMethods,
		S: CircleStatic,
	},
};

/**
 * Math (c) Kraft
 */

const getFoci = function (center, rx, ry, spin) {
	const order = rx > ry;
	const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
	const l = Math.sqrt(lsq);
	const trigX = order ? Math.cos(spin) : Math.sin(spin);
	const trigY = order ? Math.sin(spin) : Math.cos(spin);
	return [
		Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
		Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
	];
};

var Ellipse = {
	ellipse: {
		A: function () {
			// const arr = Array.from(arguments);
			const numbers = flattenArrays(arguments).filter(a => !Number.isNaN(a));
			const params = resize(5, numbers);
			this.rx = params[0];
			this.ry = params[1];
			this.origin = Constructors.vector(params[2], params[3]);
			this.spin = params[4];
			this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
			// const numbers = arr.filter(param => !isNaN(param));
			// const vectors = getVector_of_vectors(arr);
			// if (numbers.length === 4) {
			//   // this.origin = Constructors.vector(numbers[0], numbers[1]);
			//   // this.rx = numbers[2];
			//   // this.ry = numbers[3];
			// } else if (vectors.length === 2) {
			//   // two foci
			//   // this.radius = distance2(...vectors);
			//   // this.origin = Constructors.vector(...vectors[0]);
			// }
		},

		// todo, ellipse is not ready to have a Z yet. figure out arguments first
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			// z: function () { return this.origin[2]; },
		},
		M: {
			// nearestPoint: function () {
			//   return Constructors.vector(nearest_point_on_ellipse(
			//     this.origin,
			//     this.radius,
			//     getVector(arguments)
			//   ));
			// },
			// intersect: function (object) {
			//   return Intersect(this, object);
			// },
			svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
				const info = pathInfo(
					this.origin[0],
					this.origin[1],
					this.rx,
					this.ry,
					this.spin,
					arcStart,
					deltaArc,
				);
				const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x2, info.y2);
				const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x3, info.y3);
				return `M${info.x1} ${info.y1}${arc1}${arc2}`;
			},
			points: function (count = 128) {
				return Array.from(Array(count))
					.map((_, i) => ((2 * Math.PI) / count) * i)
					.map(angle => pointOnEllipse(
						this.origin.x,
						this.origin.y,
						this.rx,
						this.ry,
						this.spin,
						angle,
					));
			},
			polygon: function () {
				return Constructors.polygon(this.points(arguments[0]));
			},
			segments: function () {
				const points = this.points(arguments[0]);
				return points.map((point, i) => {
					const nextI = (i + 1) % points.length;
					return [point, points[nextI]];
				}); // .map(a => Constructors.segment(...a));
			},

		},

		S: {
			// static methods
			// fromPoints: function () {
			//   const points = getVector_of_vectors(arguments);
			//   return Constructors.circle(points, distance2(points[0], points[1]));
			// }
		},
	},
};

/**
 * Math (c) Kraft
 */

// a polygon is expecting to have these properties:
// this - an array of vectors in [] form
// this.points - same as above
// this.sides - array edge pairs of points
// this.vectors - non-normalized vectors relating to this.sides.
const PolygonMethods = {
	/**
	 * @description calculate the signed area of this polygon
	 * @returns {number} the signed area
	 */
	area: function () {
		return signedArea(this);
	},
	// midpoint: function () { return average(this); },
	centroid: function () {
		return Constructors.vector(centroid(this));
	},
	boundingBox: function () {
		return boundingBox(this);
	},
	// contains: function () {
	//   return overlap_convex_polygon_point(this, getVector(arguments));
	// },
	straightSkeleton: function () {
		return straightSkeleton(this);
	},
	// scale will return a rect for rectangles, otherwise polygon
	scale: function (magnitude, center = centroid(this)) {
		const newPoints = this
			.map(p => [0, 1].map((_, i) => p[i] - center[i]))
			.map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
		return this.constructor.fromPoints(newPoints);
	},
	rotate: function (angle, centerPoint = centroid(this)) {
		const newPoints = this.map((p) => {
			const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
			const a = Math.atan2(vec[1], vec[0]);
			return [
				centerPoint[0] + Math.cos(a + angle) * mag,
				centerPoint[1] + Math.sin(a + angle) * mag,
			];
		});
		return Constructors.polygon(newPoints);
	},
	translate: function () {
		const vec = getVector(...arguments);
		const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
		return this.constructor.fromPoints(newPoints);
	},
	transform: function () {
		const m = getMatrix3x4(...arguments);
		const newPoints = this
			.map(p => multiplyMatrix3Vector3(m, resize(3, p)));
		return Constructors.polygon(newPoints);
	},
	// sectors: function () {
	//   return this.map((p, i, arr) => {
	//     const prev = (i + arr.length - 1) % arr.length;
	//     const next = (i + 1) % arr.length;
	//     const center = p;
	//     const a = arr[prev].map((n, j) => n - center[j]);
	//     const b = arr[next].map((n, j) => n - center[j]);
	//     return Constructors.sector(b, a, center);
	//   });
	// },
	nearest: function () {
		const point = getVector(...arguments);
		const result = nearestPointOnPolygon(this, point);
		return result === undefined
			? undefined
			: Object.assign(result, { edge: this.sides[result.i] });
	},
	split: function () {
		const line = getLine$1(...arguments);
		// const split_func = this.isConvex ? splitConvexPolygon : split_polygon;
		const split_func = splitConvexPolygon;
		return split_func(this, line.vector, line.origin)
			.map(poly => Constructors.polygon(poly));
	},
	overlap: function () {
		return overlap$1(this, ...arguments);
	},
	intersect: function () {
		return intersect$1(this, ...arguments);
	},
	clip: function (line_type, epsilon) {
		const fn_line = line_type.domain_function ? line_type.domain_function : includeL;
		const segment = clipLineConvexPolygon(
			this,
			line_type.vector,
			line_type.origin,
			this.domain_function,
			fn_line,
			epsilon,
		);
		return segment ? Constructors.segment(segment) : undefined;
	},
	svgPath: function () {
		// make every point a Move or Line command, append with a "z" (close path)
		const pre = Array(this.length).fill("L");
		pre[0] = "M";
		return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
	},
};

/**
 * Math (c) Kraft
 */

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const rectToPoints = r => [
	[r.x, r.y],
	[r.x + r.width, r.y],
	[r.x + r.width, r.y + r.height],
	[r.x, r.y + r.height],
];

const rectToSides = r => [
	[[r.x, r.y], [r.x + r.width, r.y]],
	[[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
	[[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
	[[r.x, r.y + r.height], [r.x, r.y]],
];

var Rect = {
	rect: {
		P: Array.prototype,
		A: function () {
			const r = getRect(...arguments);
			this.width = r.width;
			this.height = r.height;
			this.origin = Constructors.vector(r.x, r.y);
			this.push(...rectToPoints(this));
			Object.defineProperty(this, "domain_function", { writable: true, value: include });
		},
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			center: function () {
				return Constructors.vector(
					this.origin[0] + this.width / 2,
					this.origin[1] + this.height / 2,
				);
			},
		},
		M: Object.assign({}, PolygonMethods, {
			inclusive: function () { this.domain_function = include; return this; },
			exclusive: function () { this.domain_function = exclude; return this; },
			area: function () { return this.width * this.height; },
			segments: function () { return rectToSides(this); },
			svgPath: function () {
				return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
			},
		}),
		S: {
			fromPoints: function () {
				const box = boundingBox(getVectorOfVectors(arguments));
				return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

var Polygon = {
	polygon: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// this.points = semiFlattenArrays(arguments);
			// .map(v => Constructors.vector(v));
			this.sides = this
				.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
			Object.defineProperty(this, "domain_function", { writable: true, value: include });
		},
		G: {
			// todo: convex test
			isConvex: function () {
				return undefined;
			},
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: Object.assign({}, PolygonMethods, {
			inclusive: function () { this.domain_function = include; return this; },
			exclusive: function () { this.domain_function = exclude; return this; },
			segments: function () {
				return this.sides;
			},
		}),
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
			regularPolygon: function () {
				return this.constructor(makePolygonCircumradius(...arguments));
			},
			convexHull: function () {
				return this.constructor(convexHull(...arguments));
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

var Polyline = {
	polyline: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// .map(v => Constructors.vector(v));
			// this.sides = this
			//   .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// this.sides.pop(); // polylines are not closed. remove the last segment
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			// this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
		},
		G: {
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: {
			// segments: function () {
			//   return this.sides;
			// },
			svgPath: function () {
				// make every point a Move or Line command, no closed path at the end
				const pre = Array(this.length).fill("L");
				pre[0] = "M";
				return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}`;
			},

		},
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},
	},
};

/**
 * Math (c) Kraft
 */

/**
 * 3D Matrix (3x4) with translation component in x,y,z. column-major order
 *
 *   x y z translation
 *   | | | |           indices
 * [ 1 0 0 0 ]   x   [ 0 3 6 9 ]
 * [ 0 1 0 0 ]   y   [ 1 4 7 10]
 * [ 0 0 1 0 ]   z   [ 2 5 8 11]
 */

// this is 4x faster than calling Object.assign(thisMat, mat)
const array_assign = (thisMat, mat) => {
	for (let i = 0; i < 12; i += 1) {
		thisMat[i] = mat[i];
	}
	return thisMat;
};

var Matrix = {
	matrix: {
		P: Array.prototype,

		A: function () {
			// [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach(m => this.push(m));
			getMatrix3x4(arguments).forEach(m => this.push(m));
		},

		G: {
		},

		M: {
			copy: function () { return Constructors.matrix(...Array.from(this)); },
			set: function () {
				return array_assign(this, getMatrix3x4(arguments));
			},
			isIdentity: function () { return isIdentity3x4(this); },
			// todo: is this right, on the right hand side?
			multiply: function (mat) {
				return array_assign(this, multiplyMatrices3(this, mat));
			},
			determinant: function () {
				return determinant3(this);
			},
			inverse: function () {
				return array_assign(this, invertMatrix3(this));
			},
			// todo: is this the right order (this, transform)?
			translate: function (x, y, z) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Translate(x, y, z)),
				);
			},
			rotateX: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateX(radians)),
				);
			},
			rotateY: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateY(radians)),
				);
			},
			rotateZ: function (radians) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3RotateZ(radians)),
				);
			},
			rotate: function (radians, vector, origin) {
				const transform = makeMatrix3Rotate(radians, vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			scale: function (amount) {
				return array_assign(
					this,
					multiplyMatrices3(this, makeMatrix3Scale(amount)),
				);
			},
			reflectZ: function (vector, origin) {
				const transform = makeMatrix3ReflectZ(vector, origin);
				return array_assign(this, multiplyMatrices3(this, transform));
			},
			// todo, do type checking
			transform: function (...innerArgs) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(innerArgs))),
				);
			},
			transformVector: function (vector) {
				return Constructors.vector(
					multiplyMatrix3Vector3(this, resize(3, getVector(vector))),
				);
			},
			transformLine: function (...innerArgs) {
				const l = getLine$1(innerArgs);
				return Constructors.line(multiplyMatrix3Line3(this, l.vector, l.origin));
			},
		},

		S: {},
	},
};

/**
 * Math (c) Kraft
 */
// import Junction from "./junction/index";
// import Plane from "./plane/index";
// import Matrix2 from "./matrix/matrix2";

// import PolygonPrototype from "./prototypes/polygon";

// Each primitive is defined by these key/values:
// {
//   P: proto- the prototype of the prototype (default: Object.prototype)
//   G: getters- will become Object.defineProperty(___, ___, { get: })
//   M: methods- will become Object.defineProperty(___, ___, { value: })
//   A: args- parse user-arguments, set properties on "this"
//   S: static- static methods added to the constructor
// }
// keys are one letter to shrink minified compile size

const Definitions = Object.assign(
	{},
	Vector,
	Line,
	Ray,
	Segment,
	Circle,
	Ellipse,
	Rect,
	Polygon,
	Polyline,
	Matrix,
	// Junction,
	// Plane,
	// Matrix2,
);

const create = function (primitiveName, args) {
	const a = Object.create(Definitions[primitiveName].proto);
	Definitions[primitiveName].A.apply(a, args);
	return a; // Object.freeze(a); // basically no cost. matrix needs to able to be modified now
};

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
/**
 * @memberof ear
 * @description Make a vector primitive from a sequence of numbers.
 * This vector/point object comes with object methods, the object is **immutable**
 * and methods will return modified copies. The object inherits from Array.prototype
 * so that its components can be accessed via array syntax, [0], [1], or .x, .y, .z properties.
 * There is no limit to the dimensions, some methods like cross product are dimension-specific.
 * @param {...number|number[]} numbers a list of numbers as arguments or inside an array
 * @returns {vector} one vector object
 */
const vector = function () { return create("vector", arguments); };
/**
 * @memberof ear
 * @description Make a line defined by a vector and a point passing through the line.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the line's vector
 * @param {number[]} origin the line's origin (without this, it will assumed to be the origin)
 * @returns {line} one line object
 */
const line = function () { return create("line", arguments); };
/**
 * @memberof ear
 * @description Make a ray defined by a vector and an origin point.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the ray's vector
 * @param {number[]} origin the ray's origin (without this, it will assumed to be the origin)
 * @returns {ray} one ray object
 */
const ray = function () { return create("ray", arguments); };
/**
 * @memberof ear
 * @description Make a segment defined by two endpoints. This object comes
 * with object methods and can be used in intersection calculations.
 * @param {number[]} a the first point
 * @param {number[]} b the second point
 * @returns {segment} one segment object
 */
const segment = function () { return create("segment", arguments); };
/**
 * @memberof ear
 * @description Make a circle defined by a radius and a center. This comes with
 * object methods and can be used in intersection calculations.
 * @param {number} radius the circle's radius
 * @param {number[]|...number} origin the center of the circle
 * @returns {circle} one circle object
 */
const circle = function () { return create("circle", arguments); };
/**
 * @memberof ear
 * @description Make an ellipse defined by a two radii and a center. This comes with object methods.
 * @param {number} rx the radius along the x axis
 * @param {number} ry the radius along the y axis
 * @param {number[]} origin the center of the ellipse
 * @param {number} spin the angle of rotation in radians
 * @returns {ellipse} one ellipse object
 */
const ellipse = function () { return create("ellipse", arguments); };
/**
 * @memberof ear
 * @description Make an 2D axis-aligned rectangle defined by a corner point
 * and a width and height. This comes with object methods and can
 * be used in intersection calculations.
 * @param {number} x the x coordinate of the origin
 * @param {number} y the y coordinate of the origin
 * @param {number} width the width of the rectangle
 * @param {number} height the height of the rectangle
 * @returns {rect} one rect object
 */
const rect = function () { return create("rect", arguments); };
/**
 * @memberof ear
 * @description Make a polygon defined by a sequence of points. This comes with
 * object methods and can be used in intersection calculations. The polygon can be non-convex,
 * but some methods only work on convex polygons.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polygon} one polygon object
 */
const polygon = function () { return create("polygon", arguments); };
/**
 * @memberof ear
 * @description Make a polyline defined by a sequence of points.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polyline} one polyline object
 */
const polyline = function () { return create("polyline", arguments); };
/**
 * @memberof ear
 * @description Make a 3x4 column-major matrix containing three basis
 * vectors and a translation column. This comes with object methods and
 * this is the one primitive in the library which **is mutable**.
 * @param {number[]|...number} numbers one array of 12 numbers, or 12 numbers listed as parameters.
 * @returns {matrix} one 3x4 matrix object
 */
const matrix = function () { return create("matrix", arguments); };
// const junction = function () { return create("junction", arguments); };
// const plane = function () { return create("plane", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

/**
 * @typedef vector
 * @type {object}
 * @description a vector/point primitive. there is no limit to the number of dimensions.
 * @property {number[]} 0...n array indices for the individual vector values.
 */

/**
 * @typedef matrix
 * @type {object}
 * @description a 3x4 matrix representing a transformation in 3D space,
 * including a translation component.
 * @property {number[]} 0...11 array indices for the individual matrix values
 */

/**
 * @typedef line
 * @type {object}
 * @description a line primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin a point that passes through the line
 */

/**
 * @typedef ray
 * @type {object}
 * @description a ray primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin the origin of the ray
 */

/**
 * @typedef segment
 * @type {object}
 * @description a segment primitive, defined by two endpoints
 * @property {number[]} 0 array index 0, the location of the first point
 * @property {number[]} 1 array index 1, the location of the second point
 * @property {number[]} vector a vector which represents the direction and length of the segment
 * @property {number[]} origin the first segment point
 */

/**
 * @typedef rect
 * @type {object}
 * @description an axis-aligned rectangle primitive
 * @property {number} width
 * @property {number} height
 * @property {number[]} origin the bottom left corner (or top level for Y-down computer screens)
 */

/**
 * @typedef circle
 * @type {object}
 * @description a circle primitive
 * @property {number} radius
 * @property {number[]} origin
 */

/**
 * @typedef ellipse
 * @type {object}
 * @description a ellipse primitive
 * @property {number} rx radius in the primary axis
 * @property {number} ry radius in the secondary axis
 * @property {number} spin the angle of rotation through the center in radians
 * @property {number[]} origin the center of the ellipse
 * @property {number[][]} foci array of two points, each focus of the ellipse
 */

/**
 * @typedef polygon
 * @type {object}
 * @description a polygon primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

/**
 * @typedef polyline
 * @type {object}
 * @description a polyline primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

Object.assign(Constructors, {
	vector,
	line,
	ray,
	segment,
	circle,
	ellipse,
	rect,
	polygon,
	polyline,
	matrix,
	// junction,
	// plane,
	// matrix2,
});

// build prototypes
Object.keys(Definitions).forEach(primitiveName => {
	// create the prototype
	const Proto = {};
	Proto.prototype = Definitions[primitiveName].P != null
		? Object.create(Definitions[primitiveName].P)
		: Object.create(Object.prototype);
	Proto.prototype.constructor = Proto;

	// make this present in the prototype chain so "instanceof" works
	Constructors[primitiveName].prototype = Proto.prototype;
	Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

	// getters
	Object.keys(Definitions[primitiveName].G)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			get: Definitions[primitiveName].G[key],
			// enumerable: true
		}));

	// methods
	Object.keys(Definitions[primitiveName].M)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			value: Definitions[primitiveName].M[key],
		}));

	// applied to the constructor not the prototype
	Object.keys(Definitions[primitiveName].S)
		.forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
			// bind to the prototype, this.constructor will point to the constructor
			value: Definitions[primitiveName].S[key]
				.bind(Constructors[primitiveName].prototype),
		}));

	// done with prototype
	// Object.freeze(Proto.prototype); // now able to be modified from the outside

	// store the prototype on the Definition, to be called during instantiation
	Definitions[primitiveName].proto = Proto.prototype;
});

/**
 * Math (c) Kraft
 */
/**
 * @description A collection of math functions with a focus on linear algebra,
 * computational geometry, intersection of shapes, and some origami-specific operations.
 */
const math = Constructors;
// const math = Object.create(null);
/*
 * the logic is under ".core", the primitives are under the top level.
 * the primitives have arguments type inference. the logic core is strict:
 *
 * points are array syntax [x,y]
 * segments are pairs of points [x,y], [x,y]
 * lines/rays are point-array value objects { vector: [x,y], origin: [x,y] }
 * polygons are an ordered set of points [[x,y], [x,y], ...]
 *
 * the primitives store object methods under their prototype,
 * the top level has properties like x, y, z.
 */
math.core = Object.assign(
	Object.create(null),
	constants,
	resizers,
	getters,
	functions,
	algebra,
	sort$1,

	radial,
	convexHull$1,
	pleat$1,
	polygons,
	radial,

	matrix2,
	matrix3,
	nearest$1,
	parameterize,
	generalIntersect,
	{
		enclosingPolygonPolygon,
		intersectConvexPolygonLine,
		intersectCircleCircle,
		intersectCircleLine,
		intersectLineLine,
		overlapConvexPolygons,
		overlapConvexPolygonPoint,
		overlapBoundingBoxes,
		overlapLineLine,
		overlapLinePoint,
		clipLineConvexPolygon,
		clipPolygonPolygon,
		splitConvexPolygon,
		straightSkeleton,
	},
);

math.typeof = typeOf;
math.intersect = intersect$1;
math.overlap = overlap$1;

/**
 * Rabbit Ear (c) Kraft
 */

const vertex_degree = function (v, i) {
	const graph = this;
	Object.defineProperty(v, "degree", {
		get: () => (graph.vertices_vertices && graph.vertices_vertices[i]
			? graph.vertices_vertices[i].length
			: null),
	});
};

const edge_coords = function (e, i) {
	const graph = this;
	Object.defineProperty(e, "coords", {
		get: () => {
			if (!graph.edges_vertices
				|| !graph.edges_vertices[i]
				|| !graph.vertices_coords) {
				return undefined;
			}
			return graph.edges_vertices[i].map(v => graph.vertices_coords[v]);
		},
	});
};

const face_simple = function (f, i) {
	const graph = this;
	Object.defineProperty(f, "simple", {
		get: () => {
			if (!graph.faces_vertices || !graph.faces_vertices[i]) { return null; }
			for (let j = 0; j < f.length - 1; j += 1) {
				for (let k = j + 1; k < f.length; k += 1) {
					if (graph.faces_vertices[i][j] === graph.faces_vertices[i][k]) {
						return false;
					}
				}
			}
			return true;
		},
	});
};

const face_coords = function (f, i) {
	const graph = this;
	Object.defineProperty(f, "coords", {
		get: () => {
			if (!graph.faces_vertices
				|| !graph.faces_vertices[i]
				|| !graph.vertices_coords) {
				return undefined;
			}
			return graph.faces_vertices[i].map(v => graph.vertices_coords[v]);
		},
	});
};

const setup_vertex = function (v, i) {
	vertex_degree.call(this, v, i);
	return v;
};

const setup_edge = function (e, i) {
	edge_coords.call(this, e, i);
	return e;
};

const setup_face = function (f, i) {
	face_simple.call(this, f, i);
	face_coords.call(this, f, i);
	return f;
};

// don't be confused about the naming
// it's probably more proper to use singular ("vertex" instead of "vertices")
// but the plural form is more common and this object will align with
// methods that tie to the plural key

var setup = {
	vertices: setup_vertex,
	edges: setup_edge,
	faces: setup_face,
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * lists of keys and values involved in the FOLD file format spec
 * https://github.com/edemaine/FOLD/
 */
const file_spec = 1.1;
// specific to this software
const file_creator = "Rabbit Ear";
/**
 * top-level keys in a FOLD object, sorted into usage categories.
 */
const foldKeys = {
	file: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_title",
		"file_description",
		"file_classes",
		"file_frames",
	],
	frame: [
		"frame_author",
		"frame_title",
		"frame_description",
		"frame_attributes",
		"frame_classes",
		"frame_unit",
		"frame_parent", // inside file_frames only
		"frame_inherit", // inside file_frames only
	],
	graph: [
		"vertices_coords",
		"vertices_vertices",
		"vertices_faces",
		"edges_vertices",
		"edges_faces",
		"edges_assignment",
		"edges_foldAngle",
		"edges_length",
		"faces_vertices",
		"faces_edges",
		// as of now, these are not described in the spec, but their behavior
		// can be inferred, except faces_faces which could be edge-adjacent or
		// face-adjacent. this library uses as EDGE-ADJACENT.
		"vertices_edges",
		"edges_edges",
		"faces_faces",
	],
	orders: [
		"edgeOrders",
		"faceOrders",
	],
};
/**
 * top-level keys from a FOLD object in one flat array
 */
const keys = Object.freeze([]
	.concat(foldKeys.file)
	.concat(foldKeys.frame)
	.concat(foldKeys.graph)
	.concat(foldKeys.orders));
/**
 * top-level keys from a FOLD object used by this library,
 * not in the official spec. made when calling populate().
 */
const keysOutOfSpec = Object.freeze([
	"edges_vector",
	"vertices_sectors",
	"faces_sectors",
	"faces_matrix",
]);
/**
 * array of single characers, the values of an edge assignment
 */
const edgesAssignmentValues = Array.from("MmVvBbFfUu");

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * this contains two types of methods.
 * 1. methods that are mostly references, including lists of keys
 *    that match the FOLD 1.1 specification (anytime FOLD is updated
 *    we need to update here too.)
 * 2. methods that operate on a FOLD object, searching and gathering
 *    and re-arranging keys or values based on key queries.
 */
/**
 * @description English conversion of the names of graph components from plural to singular.
 * @linkcode Origami ./src/fold/spec.js 20
 */
const singularize = {
	vertices: "vertex",
	edges: "edge",
	faces: "face",
};
/**
 * @description English conversion of the names of graph components from singular to plural.
 * @linkcode Origami ./src/fold/spec.js 29
 */
const pluralize = {
	vertex: "vertices",
	edge: "edges",
	face: "faces",
};
/**
 * @description get the English word for every FOLD spec assignment character (like "M", or "b")
 * @linkcode Origami ./src/fold/spec.js 38
 */
const edgesAssignmentNames = {
	b: "boundary",
	m: "mountain",
	v: "valley",
	f: "flat",
	u: "unassigned",
};
edgesAssignmentValues.forEach(key => {
	edgesAssignmentNames[key.toUpperCase()] = edgesAssignmentNames[key];
});
/**
 * @description get the foldAngle in degrees for every FOLD assignment spec
 * character (like "M", or "b"). **this assumes the creases are flat folded.**
 * @linkcode Origami ./src/fold/spec.js 53
 */
const edgesAssignmentDegrees = {
	M: -180,
	m: -180,
	V: 180,
	v: 180,
	B: 0,
	b: 0,
	F: 0,
	f: 0,
	U: 0,
	u: 0,
};
/**
 * @description Convert an assignment character to a foldAngle in degrees. This assumes
 * that all assignments are flat folds.
 * @param {string} assignment one edge assignment letter: M V B F U
 * @returns {number} fold angle in degrees. M/V are assumed to be flat-folded.
 * @linkcode Origami ./src/fold/spec.js 72
 */
const edgeAssignmentToFoldAngle = assignment => (
	edgesAssignmentDegrees[assignment] || 0
);
/**
 * @description Convert a foldAngle to an edge assignment character.
 * @param {number} angle fold angle in degrees
 * @returns {string} one edge assignment letter: M V or U, no boundary detection
 * @todo should "U" be "F" instead, if so, we are assigning potental "B" edges to "F".
 * @linkcode Origami ./src/fold/spec.js 82
 */
const edgeFoldAngleToAssignment = (a) => {
	if (a > math.core.EPSILON) { return "V"; }
	if (a < -math.core.EPSILON) { return "M"; }
	// if (math.core.fnEpsilonEqual(0, a)) { return "F"; }
	return "U";
};
/**
 * @description Test if a fold angle is a flat fold, which includes -180, 0, 180,
 * and the +/- epsilon around each number.
 * @param {number} angle fold angle in degrees
 * @returns {boolean} true if the fold angle is flat
 * @linkcode Origami ./src/fold/spec.js 95
 */
const edgeFoldAngleIsFlat = angle => math.core.fnEpsilonEqual(0, angle)
 || math.core.fnEpsilonEqual(-180, angle)
 || math.core.fnEpsilonEqual(180, angle);
/**
 * @description Provide a FOLD graph and determine if all edges_foldAngle
 * angles are flat, which includes -180, 0, 180, and the +/- epsilon
 * around each number. If a graph contains no "edges_foldAngle",
 * the angles are considered flat, and the method returns "true".
 * @param {FOLD} graph a FOLD graph
 * @returns {boolean} is the graph flat-foldable according to foldAngles.
 * @linkcode Origami ./src/fold/spec.js 107
 */
const edgesFoldAngleAreAllFlat = ({ edges_foldAngle }) => {
	if (!edges_foldAngle) { return true; }
	for (let i = 0; i < edges_foldAngle.length; i += 1) {
		if (!edgeFoldAngleIsFlat(edges_foldAngle[i])) { return false; }
	}
	return true;
};
/**
 * @description Get all keys in an object that end with the provided suffix.
 * @param {object} obj an object
 * @param {string} suffix a suffix to match against the keys
 * @returns {string[]} array of keys that end with the suffix
 * @linkcode Origami ./src/fold/spec.js 121
 */
const filterKeysWithSuffix = (graph, suffix) => Object
	.keys(graph)
	.map(s => (s.substring(s.length - suffix.length, s.length) === suffix
		? s : undefined))
	.filter(str => str !== undefined);
/**
 * @description Get all keys in an object that start with the provided prefix.
 * @param {object} obj an object
 * @param {string} prefix a prefix to match against the keys
 * @returns {string[]} array of keys that start with the prefix
 * @linkcode Origami ./src/fold/spec.js 133
 */
const filterKeysWithPrefix = (obj, prefix) => Object
	.keys(obj)
	.map(str => (str.substring(0, prefix.length) === prefix
		? str : undefined))
	.filter(str => str !== undefined);
/**
 * @description Get all keys in a graph which contain a "_" prefixed by the provided string.
 * @param {FOLD} graph a FOLD object
 * @param {string} prefix a prefix to match against the keys
 * @returns {string[]} array of keys that start with the prefix
 * for example: "vertices" will return:
 * vertices_coords, vertices_faces,
 * but not edges_vertices, or verticesCoords (must end with _)
 * @linkcode Origami ./src/fold/spec.js 148
 */
const getGraphKeysWithPrefix = (graph, key) => (
	filterKeysWithPrefix(graph, `${key}_`)
);
/**
 * @description Get all keys in a graph which contain a "_" followed by the provided suffix.
 * @param {FOLD} graph a FOLD object
 * @param {string} suffix a suffix to match against the keys
 * @returns {string[]} array of keys that end with the suffix
 * for example: "vertices" will return:
 * edges_vertices, faces_vertices,
 * but not vertices_coords, or edgesvertices (must prefix with _)
 * @linkcode Origami ./src/fold/spec.js 161
 */
const getGraphKeysWithSuffix = (graph, key) => (
	filterKeysWithSuffix(graph, `_${key}`)
);
/**
 * @description This takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating one object with the keys for every index.
 * @param {FOLD} graph a FOLD object
 * @param {string} geometry_key a geometry item like "vertices"
 * @returns {object[]} an array of objects with FOLD keys but the
 * values are from this single element
 * @linkcode Origami ./src/fold/spec.js 173
 */
const transposeGraphArrays = (graph, geometry_key) => {
	const matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return []; }
	const len = Math.max(...matching_keys.map(arr => graph[arr].length));
	const geometry = Array.from(Array(len))
		.map(() => ({}));
	// approach 1: this removes the geometry name from the geometry key
	// since it should be implied
	// matching_keys
	//   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
	//   .forEach(key => geometry
	//     .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
	// approach 2: preserve geometry key
	matching_keys
		.forEach(key => geometry
			.forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
	return geometry;
};
/**
 * @description This takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating one object with the keys.
 * @param {FOLD} graph a FOLD object
 * @param {string} geometry_key a geometry item like "vertices"
 * @param {number} the index of an element
 * @returns {object} an object with FOLD keys but the values are from this single element
 * @linkcode Origami ./src/fold/spec.js 200
 */
const transposeGraphArrayAtIndex = function (
	graph,
	geometry_key,
	index,
) {
	const matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return undefined; }
	const geometry = {};
	// matching_keys
	//   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
	//   .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
	matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
	return geometry;
};
/**
 * @description Using heuristics, try to determine if an object is a FOLD object.
 * @param {FOLD} graph a FOLD object
 * @returns {number} value between 0 and 1, zero meaning no chance, one meaning 100% chance
 * @linkcode Origami ./src/fold/spec.js 220
 */
const isFoldObject = (object = {}) => (
	Object.keys(object).length === 0
		? 0
		: [].concat(keys, keysOutOfSpec)
			.filter(key => object[key]).length / Object.keys(object).length);

var fold_spec = /*#__PURE__*/Object.freeze({
	__proto__: null,
	singularize: singularize,
	pluralize: pluralize,
	edgesAssignmentNames: edgesAssignmentNames,
	edgesAssignmentDegrees: edgesAssignmentDegrees,
	edgeAssignmentToFoldAngle: edgeAssignmentToFoldAngle,
	edgeFoldAngleToAssignment: edgeFoldAngleToAssignment,
	edgeFoldAngleIsFlat: edgeFoldAngleIsFlat,
	edgesFoldAngleAreAllFlat: edgesFoldAngleAreAllFlat,
	filterKeysWithSuffix: filterKeysWithSuffix,
	filterKeysWithPrefix: filterKeysWithPrefix,
	getGraphKeysWithPrefix: getGraphKeysWithPrefix,
	getGraphKeysWithSuffix: getGraphKeysWithSuffix,
	transposeGraphArrays: transposeGraphArrays,
	transposeGraphArrayAtIndex: transposeGraphArrayAtIndex,
	isFoldObject: isFoldObject
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * density-based spatial clustering of applications with noise (DBSCAN)
 * cluster vertices near each other with an epsilon
 */
/**
 * because epsilons are usually very tiny, this uses a square bounding box
 */
const are_vertices_equivalent = (a, b, epsilon = math.core.EPSILON) => {
	const degree = a.length;
	for (let i = 0; i < degree; i += 1) {
		if (Math.abs(a[i] - b[i]) > epsilon) {
			return false;
		}
	}
	return true;
};
/**
 * @description Find all clusters of vertices which lie within an epsilon of each other.
 * Each cluster is an array of vertex indices. If no clusters exist, the method returns
 * N-number of arrays, each with a single vertex entry.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} array of arrays of vertex indices.
 * @example
 * no clusters: [ [0], [1], [2], [3], [4], ... ]
 * clusters: [ [0, 5], [1], [3], [2, 4]]
 * @linkcode Origami ./src/graph/verticesClusters.js 31
 */
const getVerticesClusters = ({ vertices_coords }, epsilon = math.core.EPSILON) => {
	if (!vertices_coords) { return []; }
	// equivalent_matrix is an NxN matrix storing (T/F) equivalency between vertices
	// only top triangle is used
	//             j  j  j
	//          0  1  2  3
	//   i  0 [ x,  ,  ,  ]
	//   i  1 [ x, x,  ,  ]
	//   i  2 [ x, x, x,  ]
	//      3 [ x, x, x, x]
	const equivalent_matrix = vertices_coords.map(() => []);
	for (let i = 0; i < vertices_coords.length - 1; i += 1) {
		for (let j = i + 1; j < vertices_coords.length; j += 1) {
			equivalent_matrix[i][j] = are_vertices_equivalent(
				vertices_coords[i],
				vertices_coords[j],
				epsilon,
			);
		}
	}
	// vertices_equivalent is an array for every vertex. each array contains a list
	// of indices that this vertex is equivalent to. there is redundant data,
	// for example, equivalent vertices 4 and 9 both store each other in their arrays.
	const vertices_equivalent = equivalent_matrix
		.map(equiv => equiv
			.map((el, j) => (el ? j : undefined))
			.filter(a => a !== undefined));
	// clusters is an array of arrays of numbers
	// each entry in clusters is an array of vertex indices
	// now we will recurse
	const clusters = [];
	const visited = Array(vertices_coords.length).fill(false);
	let visitedCount = 0;
	const recurse = (cluster_index, i) => {
		if (visited[i] || visitedCount === vertices_coords.length) { return; }
		visited[i] = true;
		visitedCount += 1;
		if (!clusters[cluster_index]) { clusters[cluster_index] = []; }
		clusters[cluster_index].push(i);
		while (vertices_equivalent[i].length > 0) {
			// instead of recursing depth first here, first push the array on to the vertex
			// after filtering out the already seen vertices..
			recurse(cluster_index, vertices_equivalent[i][0]);
			vertices_equivalent[i].splice(0, 1);
		}
	};
	// every vertex will be recusively visited, depth first.
	// begin with the first vertex, follow 
	for (let i = 0; i < vertices_coords.length; i += 1) {
		recurse(i, i);
		if (visitedCount === vertices_coords.length) { break; }
	}
	return clusters.filter(a => a.length);
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {any[]} arrays any number of arrays
 * @returns {number} the length of the longest array
 */
const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
	.filter(el => el !== undefined)
	.map(el => el.length)));
/**
 * @description Get the number of vertices, edges, or faces in the graph by
 * simply checking the length of arrays starting with the key; in the case
 * of differing array lengths (which shouldn't happen) return the largest number.
 *
 * This works even with custom component names in place of "vertices", "edges"...
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in a vertex_ array, but still exist as mentions in faces_vertices.
 * In that case, use the implied count method. "count_implied.js"
 * @param {FOLD} graph a FOLD graph
 * @param {string} key the prefix for a key, eg: "vertices"
 * @returns {number} the number of the requested element type in the graph
 * @linkcode Origami ./src/graph/count.js 25
 */
const count = (graph, key) => (
	max_arrays_length(...getGraphKeysWithPrefix(graph, key).map(k => graph[k])));

// standard graph components names
/**
 * @description Get the number of vertices in a graph.
 * @param {FOLD} graph a FOLD graph
 * @returns {number} the number of vertices in the graph
 */
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) => (
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices));
/**
 * @description Get the number of edges in a graph.
 * @param {FOLD} graph a FOLD graph
 * @returns {number} the number of edges in the graph
 */
count.edges = ({ edges_vertices, edges_edges, edges_faces }) => (
	max_arrays_length(edges_vertices, edges_edges, edges_faces));
/**
 * @description Get the number of faces in a graph.
 * @param {FOLD} graph a FOLD graph
 * @returns {number} the number of faces in the graph
 */
count.faces = ({ faces_vertices, faces_edges, faces_faces }) => (
	max_arrays_length(faces_vertices, faces_edges, faces_faces));

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Given a list of integers (can contain duplicates),
 * this will return only the unique integers (removing duplicates).
 * @param {number[]} array an array of integers
 * @returns {number[]} set of unique integers
 * @linkcode Origami ./src/general/arrays.js 9
 */
const uniqueIntegers = (array) => {
	const keys = {};
	array.forEach((int) => { keys[int] = true; });
	return Object.keys(keys).map(n => parseInt(n, 10));
};
/**
 * @description Given a list of integers (can contain duplicates),
 * this will return a sorted set of unique integers (removing duplicates).
 * note: this sort appears to be unnecessary, as Object.keys() returns them
 * in sorted order *sometimes*, but this is not strictly defined.
 * @param {number[]} array an array of integers
 * @returns {number[]} set of sorted, unique integers
 * @linkcode Origami ./src/general/arrays.js 23
 */
const uniqueSortedIntegers = (array) => uniqueIntegers(array)
	.sort((a, b) => a - b);
/**
 * @description A circular array (data wraps around) requires 2 indices
 * if you intend to split it into two arrays. The "indices" parameter
 * will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 * @linkcode Origami ./src/general/arrays.js 34
 */
const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};
/**
 * @description This will iterate over the array of arrays and returning
 * the first array in the list with the longest length.
 * @param {any[][]} arrays an array of arrays of any type
 * @return {any[]} one of the arrays from the set
 * @linkcode Origami ./src/general/arrays.js 48
 */
const getLongestArray = (arrays) => {
	if (arrays.length === 1) { return arrays[0]; }
	const lengths = arrays.map(arr => arr.length);
	let max = 0;
	for (let i = 0; i < arrays.length; i += 1) {
		if (lengths[i] > lengths[max]) {
			max = i;
		}
	}
	return arrays[max];
};
/**
 * @description Given an array of any type, return the same array but filter
 * out any items which only appear once. The comparison uses conversion-to-string then
 * matching to compare, so this works for primitives (bool, number, string) not objects or arrays.
 * @param {any[]} array an array of any type.
 * @returns {any[]} the same input array but filtered to remove elements which appear only once.
 * @linkcode Origami ./src/general/arrays.js 67
 */
const removeSingleInstances = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n] += 1;
	});
	return array.filter(n => count[n] > 1);
};
/**
 * @description Convert a sparse or dense matrix containing true/false/undefined
 * into arrays containing the indices `[i,j]` of all true values.
 * @param {Array<Array<boolean|undefined>>} matrix a 2D matrix containing boolean or undefined
 * @returns {number[][]} array of arrays of numbers
 * @linkcode Origami ./src/general/arrays.js 82
 */
const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));
/**
 * @description consult the upper right half triangle of the matrix,
 * find all truthy values, gather the row/column index pairs,
 * return them as pairs of indices in a single array.
 * Triangle number, only visit half the indices. make unique pairs
 * @param {any[][]} matrix a matrix containing any type
 * @returns {number[][]} array of pairs of numbers, the pairs of indices
 * which are truthy in the matrix.
 * @linkcode Origami ./src/general/arrays.js 96
 */
const booleanMatrixToUniqueIndexPairs = matrix => {
	const pairs = [];
	for (let i = 0; i < matrix.length - 1; i += 1) {
		for (let j = i + 1; j < matrix.length; j += 1) {
			if (matrix[i][j]) {
				pairs.push([i, j]);
			}
		}
	}
	return pairs;
};
/**
 * @description given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create collection groups
 * where each item is included in a group if it points to another member
 * in that group.
 * @param {number[][]} matrix an array of arrays of numbers
 * @returns {number[][]} groups of the indices where each index appears only once
 * @linkcode Origami ./src/general/arrays.js 117
 */
const makeSelfRelationalArrayClusters = (matrix) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		matrix[index].forEach(i => recurse(i, current_group));
		return 1; // increment group # for next round
	};
	for (let row = 0, group = 0; row < matrix.length; row += 1) {
		if (!(row in matrix)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};
/**
 * @description convert a list of items {any} into a list of pairs
 * where each item is uniqely matched with another item (non-ordered)
 * the length is a triangle number, ie: 6 + 5 + 4 + 3 + 2 + 1
 * (length * (length-1)) / 2
 */
// export const makeTrianglePairs = (array) => {
// 	const pairs = Array((array.length * (array.length - 1)) / 2);
// 	let index = 0;
// 	for (let i = 0; i < array.length - 1; i++) {
// 		for (let j = i + 1; j < array.length; j++, index++) {
// 			pairs[index] = [array[i], array[j]];
// 		}
// 	}
// 	return pairs;
// };
/**
 * @description given an array containing undefineds, gather all contiguous
 * series of valid entries, and return the list of their indices in the form
 * of [start_index, final_index].
 * @param {any[]} array the array which is allowed to contain holes
 * @returns {number[][]} array containing pairs of numbers
 * @example
 * circularArrayValidRanges([0, 1, undefined, 2, 3, 4, undefined, undefined, 5])
 * // will return
 * [ [8, 1], [3, 5] ]
 * @linkcode Origami ./src/general/arrays.js 159
 */
const circularArrayValidRanges = (array) => {
	// if the array contains no undefineds, return the default state.
	const not_undefineds = array.map(el => el !== undefined);
	if (not_undefineds.reduce((a, b) => a && b, true)) {
		return [[0, array.length - 1]];
	}
	// mark the location of the first-in-a-list of valid entries.
	const first_not_undefined = not_undefineds
		.map((el, i, arr) => el && !arr[(i - 1 + arr.length) % arr.length]);
	// this is the number of sets we have. will be >= 1
	const total = first_not_undefined.reduce((a, b) => a + (b ? 1 : 0), 0);
	// the location of the starting index of each contiguous set
	const starts = Array(total);
	// the length of contiguous each set.
	const counts = Array(total).fill(0);
	// we want the set that includes index 0 to be listed first,
	// if that doesn't exist, the next lowest index should be first.
	let index = not_undefineds[0] && not_undefineds[array.length - 1]
		? 0
		: (total - 1);
	not_undefineds.forEach((el, i) => {
		index = (index + (first_not_undefined[i] ? 1 : 0)) % counts.length;
		counts[index] += not_undefineds[i] ? 1 : 0;
		if (first_not_undefined[i]) { starts[index] = i; }
	});
	return starts.map((s, i) => [s, (s + counts[i] - 1) % array.length]);
};
/**
 * @description given an array containing undefineds, starting at index 0,
 * walk backwards (circularly around) to find the first index that isn't
 * undefined. similarly, from 0 increment to the final index that isn't
 * undefined. no undefineds results in [0, length].
 * @param {any[]} the array, which possibly contains holes
 * @param {number} the length of the array. this is required because
 * it's possible that the holes exist at the end of the array,
 * causing it to misreport the (intended) length.
 */
// const circularArrayValidRange = (array, array_length) => {
//   let start, end;
//   for (start = array_length - 1;
//     start >= 0 && array[start] !== undefined;
//     start--);
//   start = (start + 1) % array_length;
//   for (end = 0;
//     end < array_length && array[end] !== undefined;
//     end++);
//   return [start, end];
// };

// this is now "invertSimpleMap" in maps.js
// export const invert_array = (a) => {
// 	const b = [];
// 	a.forEach((n, i) => { b[n] = i; });
// 	return b;
// };

// export const invert_array = (a) => {
//  const b = [];
//  a.forEach((x, i) => {
//		if (typeof x === "number") { b[x] = i; }
//	});
//  return b;
// };

var arrays = /*#__PURE__*/Object.freeze({
	__proto__: null,
	uniqueIntegers: uniqueIntegers,
	uniqueSortedIntegers: uniqueSortedIntegers,
	splitCircularArray: splitCircularArray,
	getLongestArray: getLongestArray,
	removeSingleInstances: removeSingleInstances,
	booleanMatrixToIndexedArray: booleanMatrixToIndexedArray,
	booleanMatrixToUniqueIndexPairs: booleanMatrixToUniqueIndexPairs,
	makeSelfRelationalArrayClusters: makeSelfRelationalArrayClusters,
	circularArrayValidRanges: circularArrayValidRanges
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @name remove
 * @memberof graph
 * @description Removes vertices, edges, or faces (or anything really)
 * remove elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 * @param {FOLD} graph a FOLD object
 * @param {string} key like "vertices", the prefix of the arrays
 * @param {number[]} removeIndices an array of vertex indices, like [1,9,25]
 * @returns {number[]} a map of changes to the graph
 * @example remove(foldObject, "vertices", [2,6,11,15]);
 * @example
 * removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 * @example
 * given removeIndices: [4, 6, 7];
 * given a geometry array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
 * map becomes (_=undefined): [0, 1, 2, 3, _, 4, _, _, 5, 6];
 * @linkcode Origami ./src/graph/remove.js 33
 */
const removeGeometryIndices = (graph, key, removeIndices) => {
	const geometry_array_size = count(graph, key);
	const removes = uniqueSortedIntegers(removeIndices);
	const index_map = [];
	let i, j, walk;
	for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === removes[walk]) {
			// this prevents arrays with holes
			index_map[i] = undefined;
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	getGraphKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = index_map[v]; })));
	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays do change their size, their contents are untouched
	removes.reverse();
	getGraphKeysWithPrefix(graph, key)
		.forEach((prefix_key) => removes
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @name replace
 * @memberof graph
 * @description Replaces vertices, edges, or faces (or anything really)
 * replace elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 * @param {FOLD} graph a FOLD object
 * @param {string} key like "vertices", the prefix of the arrays
 * @param {number[]} replaceIndices an array of vertex indices, like [1,9,25]
 * @returns {number[]} a map of changes to the graph
 * @example replace(foldObject, "vertices", [2,6,11,15]);
 * @example
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 * @linkcode Origami ./src/graph/replace.js 29
 */
// replaceIndices: [4:3, 7:5, 8:3, 12:3, 14:9] where keys are indices to remove
const replaceGeometryIndices = (graph, key, replaceIndices) => {
	const geometry_array_size = count(graph, key);
	const removes = Object.keys(replaceIndices).map(n => parseInt(n, 10));
	const replaces = uniqueSortedIntegers(removes);
	const index_map = [];
	let i, j, walk;
	for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === replaces[walk]) {
			// this prevents arrays with holes
			index_map[i] = index_map[replaceIndices[replaces[walk]]];
			if (index_map[i] === undefined) {
				console.log("replace() found an undefined", index_map);
			}
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	// console.log("replace index_map", index_map);
	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	getGraphKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = index_map[v]; })));
	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays do change their size, their contents are untouched
	replaces.reverse();
	getGraphKeysWithPrefix(graph, key)
		.forEach((prefix_key) => replaces
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Get the indices of all vertices which lie close to other vertices.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} arrays of clusters of similar vertices. todo check this
 * @linkcode Origami ./src/graph/verticesViolations.js 15
 */
const getDuplicateVertices = (graph, epsilon) => (
	getVerticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1)
);
/**
 * @description Get the indices of all vertices which make no appearance in any edge.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 25
 */
const getEdgeIsolatedVertices = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	edges_vertices.forEach((ev) => {
		ev.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
/**
 * @description Get the indices of all vertices which make no appearance in any face.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 45
 */
const getFaceIsolatedVertices = ({ vertices_coords, faces_vertices }) => {
	if (!vertices_coords || !faces_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	faces_vertices.forEach((fv) => {
		fv.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};

// todo this could be improved. for loop instead of forEach + filter.
// break the loop early.
/**
 * @description Get the indices of all vertices which make no appearance in any edge or face.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 68
 */
const getIsolatedVertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
	if (!vertices_coords) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	if (edges_vertices) {
		edges_vertices.forEach((ev) => {
			ev.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	if (faces_vertices) {
		faces_vertices.forEach((fv) => {
			fv.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
/**
 * @description Remove any vertices which are not a part of any edge or
 * face. This will shift up the remaining vertices indices so that the
 * vertices arrays will not have any holes, and, additionally it searches
 * through all _vertices reference arrays and updates the index
 * references for the shifted vertices.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} [remove_indices] Leave this empty. Otherwise, if
 * getIsolatedVertices() has already been called, provide the result here to speed
 * up the algorithm.
 * @returns {object} summary of changes
 * @linkcode Origami ./src/graph/verticesViolations.js 105
 */
const removeIsolatedVertices = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = getIsolatedVertices(graph);
	}
	return {
		map: removeGeometryIndices(graph, _vertices, remove_indices),
		remove: remove_indices,
	};
};

// todo
// export const remove_collinear_vertices = (graph, epsilon = math.core.EPSILON) => {
// };

/**
 * @description This will shrink the number of vertices in the graph,
 * if vertices are close within an epsilon, it will keep the first one,
 * find the average of close points, and assign it to the remaining vertex.
 * **this has the potential to create circular and duplicate edges**.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} summary of changes
 * @linkcode Origami ./src/graph/verticesViolations.js 129
 */
const removeDuplicateVertices = (graph, epsilon = math.core.EPSILON) => {
	// replaces array will be [index:value] index is the element to delete,
	// value is the index this element will be replaced by.
	const replace_indices = [];
	// "remove" is only needed for the return value summary.
	const remove_indices = [];
	// clusters is array of indices, for example: [ [4, 13, 7], [0, 9] ]
	const clusters = getVerticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1);
	// for each cluster of n, all indices from [1...n] will be replaced with [0]
	clusters.forEach(cluster => {
		for (let i = 1; i < cluster.length; i += 1) {
			replace_indices[cluster[i]] = cluster[0];
			remove_indices.push(cluster[i]);
		}
	});
	// for each cluster, average all vertices-to-merge to get their new point.
	// set the vertex at the index[0] (the index to keep) to the new point.
	clusters
		.map(arr => arr.map(i => graph.vertices_coords[i]))
		.map(arr => math.core.average(...arr))
		.forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
	return {
		map: replaceGeometryIndices(graph, _vertices, replace_indices),
		remove: remove_indices,
	};
};

// export const removeDuplicateVertices_first = (graph, epsilon = math.core.EPSILON) => {
//   const clusters = getVerticesClusters(graph, epsilon);
//   // map answers: what is the index of the old vertex in the new graph?
//   // [0, 1, 2, 3, 1, 4, 5]  vertex 4 got merged, vertices after it shifted up
//   const map = [];
//   clusters.forEach((verts, i) => verts.forEach(v => { map[v] = i; }));
//   // average all points together for each new vertex
//   graph.vertices_coords = clusters
//     .map(arr => arr.map(i => graph.vertices_coords[i]))
//     .map(arr => math.core.average(...arr));
//   // update all "..._vertices" arrays with each vertex's new index.
//   // TODO: this was copied from remove.js
//   getGraphKeysWithSuffix(graph, S._vertices)
//     .forEach(sKey => graph[sKey]
//       .forEach((_, i) => graph[sKey][i]
//         .forEach((v, j) => { graph[sKey][i][j] = map[v]; })));
//   // for keys like "vertices_edges" or "vertices_vertices", we simply
//   // cannot carry them over, for example vertices_vertices are intended
//   // to be sorted clockwise. it's possible to write this out one day
//   // for all the special cases, but for now playing it safe.
//   getGraphKeysWithPrefix(graph, S._vertices)
//     .filter(a => a !== S._vertices_coords)
//     .forEach(key => delete graph[key]);
//   // for a shared vertex: [3, 7, 9] we say 7 and 9 are removed.
//   // the map reflects this change too, where indices 7 and 9 contain "3"
//   const remove_indices = clusters
//     .map(cluster => cluster.length > 1 ? cluster.slice(1, cluster.length) : undefined)
//     .filter(a => a !== undefined)
//     .reduce((a, b) => a.concat(b), []);
//   console.log("clusters", clusters);
//   console.log("map", map);
//   return {
//     map,
//     remove: remove_indices,
//   };
// };

var verticesViolations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getDuplicateVertices: getDuplicateVertices,
	getEdgeIsolatedVertices: getEdgeIsolatedVertices,
	getFaceIsolatedVertices: getFaceIsolatedVertices,
	getIsolatedVertices: getIsolatedVertices,
	removeIsolatedVertices: removeIsolatedVertices,
	removeDuplicateVertices: removeDuplicateVertices
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Search inside arrays inside arrays and return
 * the largest number.
 * @returns {number} largest number in array in arrays.
 */
const array_in_array_max_number = (arrays) => {
	let max = -1; // will become 0 if nothing is found
	arrays
		.filter(a => a !== undefined)
		.forEach(arr => arr
			.forEach(el => el
				.forEach((e) => {
					if (e > max) { max = e; }
				})));
	return max;
};
/**
 * @description Search inside arrays inside arrays and return
 * the largest number by only checking indices 0 and 1 in the
 * inner arrays.
 * @returns {number} largest number in indices 0 or 1 of array in arrays.
 */
const max_num_in_orders = (array) => {
	let max = -1; // will become 0 if nothing is found
	array.forEach(el => {
		// exception. index 2 is orientation, not index. check only 0, 1
		if (el[0] > max) { max = el[0]; }
		if (el[1] > max) { max = el[1]; }
	});
	return max;
};
const ordersArrayNames = {
	edges: "edgeOrders",
	faces: "faceOrders",
};
/**
 * @description Get the number of vertices, edges, or faces in the graph, as
 * evidenced by their appearance in other arrays; ie: searching faces_vertices
 * for the largest vertex index, and inferring number of vertices is that long.
 * @param {FOLD} graph a FOLD graph
 * @param {string} key the prefix for a key, eg: "vertices"
 * @returns {number} the number of vertices, edges, or faces in the graph.
 * @linkcode Origami ./src/graph/countImplied.js 48
 */
const countImplied = (graph, key) => Math.max(
	// return the maximum value between (1/2):
	// 1. a found geometry in another geometry's array ("vertex" in "faces_vertices")
	array_in_array_max_number(
		getGraphKeysWithSuffix(graph, key).map(str => graph[str]),
	),
	// 2. a found geometry in a faceOrders or edgeOrders type of array (special case)
	graph[ordersArrayNames[key]]
		? max_num_in_orders(graph[ordersArrayNames[key]])
		: -1,
) + 1;

// standard graph components names
countImplied.vertices = graph => countImplied(graph, _vertices);
countImplied.edges = graph => countImplied(graph, _edges);
countImplied.faces = graph => countImplied(graph, _faces);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description discover a face by walking neighboring vertices until returning to the start.
 * @param {FOLD} graph a FOLD graph
 * @param {number} v0 starting vertex
 * @param {number} v1 second vertex, this sets the direction of the walk
 * @param {object} [walked_edges={}] memo object, to prevent walking down
 * duplicate paths, or finding duplicate faces, this dictionary will
 * store and check against vertex pairs "i j".
 * @returns {object} the walked face, an object arrays of numbers
 * under "vertices", "edges", and "angles"
 * @linkcode Origami ./src/graph/walk.js 14
 */
const counterClockwiseWalk = ({
	vertices_vertices, vertices_sectors,
}, v0, v1, walked_edges = {}) => {
	// each time we visit an edge (vertex pair as string, "4 9") add it here.
	// this gives us a quick lookup to see if we've visited this edge before.
	const this_walked_edges = {};
	// return the face: { vertices, edges, angles }
	const face = { vertices: [v0], edges: [], angles: [] };
	// walking the graph, we look at 3 vertices at a time. in sequence:
	// prev_vertex, this_vertex, next_vertex
	let prev_vertex = v0;
	let this_vertex = v1;
	while (true) {
		// even though vertices_vertices are sorted counter-clockwise,
		// to make a counter-clockwise wound face, when we visit a vertex's
		// vertices_vertices array we have to select the [n-1] vertex, not [n+1],
		// it's a little counter-intuitive.
		const v_v = vertices_vertices[this_vertex];
		const from_neighbor_i = v_v.indexOf(prev_vertex);
		const next_neighbor_i = (from_neighbor_i + v_v.length - 1) % v_v.length;
		const next_vertex = v_v[next_neighbor_i];
		const next_edge_vertices = `${this_vertex} ${next_vertex}`;
		// check if this edge was already walked 2 ways:
		// 1. if we visited this edge while making this face, we are done.
		if (this_walked_edges[next_edge_vertices]) {
			Object.assign(walked_edges, this_walked_edges);
			face.vertices.pop();
			return face;
		}
		this_walked_edges[next_edge_vertices] = true;
		// 2. if we visited this edge (with vertices in the same sequence),
		// because of the counterclockwise winding, we are looking at a face
		// that has already been built.
		if (walked_edges[next_edge_vertices]) {
			return undefined;
		}
		face.vertices.push(this_vertex);
		face.edges.push(next_edge_vertices);
		if (vertices_sectors) {
			face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
		}
		prev_vertex = this_vertex;
		this_vertex = next_vertex;
	}
};
/**
 * @description Given a planar graph, discover all faces by counter-clockwise walking
 * by starting at every edge.
 * @param {FOLD} graph a FOLD graph
 * @returns {object[]} an array of face objects, where each face has number arrays,
 * "vertices", "edges", and "angles". vertices and edges are indices, angles are radians.
 * @linkcode Origami ./src/graph/walk.js 67
 */
const planarVertexWalk = ({ vertices_vertices, vertices_sectors }) => {
	const graph = { vertices_vertices, vertices_sectors };
	const walked_edges = {};
	return vertices_vertices
		.map((adj_verts, v) => adj_verts
			.map(adj_vert => counterClockwiseWalk(graph, v, adj_vert, walked_edges))
			.filter(a => a !== undefined))
		.flat();
};
/**
 * @description This should be used in conjuction with planarVertexWalk() and
 * counterClockwiseWalk(). There will be one face in the which winds around the
 * outside of the boundary and encloses the space outside around. This method will
 * find that face and remove it from the set.
 * @algorithm 180 - sector angle = the turn angle. counter clockwise
 * turns are +, clockwise will be -, this removes the one face that
 * outlines the piece with opposite winding enclosing Infinity.
 * @param {object[]} walked_faces the result from calling "planarVertexWalk()"
 * @returns {object[]} the same input array with one fewer element
 * @linkcode Origami ./src/graph/walk.js 88
 */
const filterWalkedBoundaryFace = walked_faces => walked_faces
	.filter(face => face.angles
		.map(a => Math.PI - a)
		.reduce((a, b) => a + b, 0) > 0);

var walk = /*#__PURE__*/Object.freeze({
	__proto__: null,
	counterClockwiseWalk: counterClockwiseWalk,
	planarVertexWalk: planarVertexWalk,
	filterWalkedBoundaryFace: filterWalkedBoundaryFace
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description This is a subroutine for building vertices_vertices. This will
 * take a set of vertices indices and a vertex index to be the center point, and
 * sort the indices radially counter-clockwise.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vertices an array of vertex indices to be sorted
 * @param {number} vertex the origin vertex, around which the vertices will be sorted
 * @returns {number[]} indices of vertices, in sorted order
 * @linkcode Origami ./src/graph/sort.js 13
 */
const sortVerticesCounterClockwise = ({ vertices_coords }, vertices, vertex) => (
	vertices
		.map(v => vertices_coords[v])
		.map(coord => math.core.subtract(coord, vertices_coords[vertex]))
		.map(vec => Math.atan2(vec[1], vec[0]))
		// optional line, this makes the cycle loop start/end along the +X axis
		.map(angle => (angle > -math.core.EPSILON ? angle : angle + Math.PI * 2))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.map(i => vertices[i])
);
/**
 * @description sort a subset of vertices from a graph along a vector.
 * eg: given the vector [1,0], points according to their X value.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vertices the indices of vertices to be sorted
 * @param {number[]} vector a vector along which to sort vertices
 * @returns {number[]} indices of vertices, in sorted order
 * @linkcode Origami ./src/graph/sort.js 34
 */
const sortVerticesAlongVector = ({ vertices_coords }, vertices, vector) => (
	vertices
		.map(i => ({ i, d: math.core.dot(vertices_coords[i], vector) }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i)
);

var sort = /*#__PURE__*/Object.freeze({
	__proto__: null,
	sortVerticesCounterClockwise: sortVerticesCounterClockwise,
	sortVerticesAlongVector: sortVerticesAlongVector
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * all of the graph methods follow a similar format.
 * the first argument is a FOLD graph. and the graph remains unmodified.
 * the method returns the data array.
 *
 * if you want to modify the input graph, assign the property after making it
 *  var graph = {...};
 *  graph.faces_faces = makeFacesFaces(graph);
 */
/**
 *
 *    VERTICES
 *
 */
/**
 * @description Make `vertices_edges` from `edges_vertices`, unsorted, which should
 * be used sparingly. Prefer makeVerticesEdges().
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 31
 */
const makeVerticesEdgesUnsorted = ({ edges_vertices }) => {
	const vertices_edges = [];
	// iterate over edges_vertices and swap the index for each of the contents
	// each edge (index 0: [3, 4]) will be converted into (index 3: [0], index 4: [0])
	// repeat. append to each array.
	edges_vertices.forEach((ev, i) => ev
		.forEach((v) => {
			if (vertices_edges[v] === undefined) {
				vertices_edges[v] = [];
			}
			vertices_edges[v].push(i);
		}));
	return vertices_edges;
};
/**
 * @description Make `vertices_edges` sorted, so that the edges are sorted
 * radially around the vertex, corresponding with the order in `vertices_vertices`.
 * @param {FOLD} graph a FOLD object, containing edges_vertices, vertices_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 53
 */
const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};
/**
 * discover adjacent vertices by way of their edge relationships.
 *
 * required FOLD arrays:
 * - vertices_coords
 * - edges_vertices
 *
 * helpful FOLD arrays: (will be made anyway)
 * - vertices_edges
 *
 * editor note: i almost rewrote this by caching edges_vector, making it
 * resemble the make_faces_vertices but the elegance of this simpler solution
 * feels like it outweighed the added complexity. it's worth revisiting tho.
 *
 * note: it is possible to rewrite this method to use faces_vertices to
 * discover adjacent vertices, currently this is 
 */
/**
 * @description Make `vertices_vertices` sorted radially counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_edges, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are vertex indices.
 * @linkcode Origami ./src/graph/make.js 83
 */
const makeVerticesVertices = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// use adjacent edges to find adjacent vertices
	const vertices_vertices = vertices_edges
		.map((edges, v) => edges
			// the adjacent edge's edges_vertices also contains this vertex,
			// filter it out and we're left with the adjacent vertices
			.map(edge => edges_vertices[edge]
				.filter(i => i !== v))
			.reduce((a, b) => a.concat(b), []));
	return vertices_coords === undefined
		? vertices_vertices
		: vertices_vertices
			.map((verts, i) => sortVerticesCounterClockwise({ vertices_coords }, verts, i));
};
/**
 * @description Make `vertices_faces` **not sorted** counter-clockwise,
 * which should be used sparingly. Prefer makeVerticesFaces().
 * @param {FOLD} graph a FOLD object, containing vertices_coords, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 108
 */
const makeVerticesFacesUnsorted = ({ vertices_coords, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like vertices_coords)
	const vertices_faces = vertices_coords !== undefined
		? vertices_coords.map(() => [])
		: Array.from(Array(countImplied.vertices({ faces_vertices }))).map(() => []);
	// iterate over every face, then iterate over each of the face's vertices
	faces_vertices.forEach((face, f) => {
		// in the case that one face visits the same vertex multiple times,
		// this hash acts as an intermediary, basically functioning like a set,
		// and only allow one occurence of each vertex index.
		const hash = [];
		face.forEach((vertex) => { hash[vertex] = f; });
		hash.forEach((fa, v) => vertices_faces[v].push(fa));
	});
	return vertices_faces;
};
/**
 * @description Make `vertices_faces` sorted counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 133
 */
const makeVerticesFaces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const face_map = makeVerticesToFace({ faces_vertices });
	return vertices_vertices
		.map((verts, v) => verts
			.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
				.join(" ")))
		.map(keys => keys
			.map(key => face_map[key]));
	// .filter(a => a !== undefined) // removed. read below.
};
// the old version of this method contained a filter to remove "undefined".
// because in the case of a boundary vertex of a closed polygon shape, there
// is no face that winds backwards around the piece and encloses infinity.
// unfortunately, this disconnects the index match with vertices_vertices.
/**
 * *not a geometry array*
 *
 * for fast backwards lookup of a edge by its vertices. this dictionary:
 * keys are each edge's vertices as a string separated by a space: "9 3"
 * value is the index of the edge.
 * example: "9 3" and "3 9" are both entries with a value of the edge's index.
 */
/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is bidirectional, so "7 15" and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 168
 */
const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};
/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is not bidirectional, so "7 15" can exist while "15 7" does not. This is useful
 * for example for looking up the edge's vector, which is direction specific.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 188
 */
const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
/**
 * @description Make an object which answers the question: "which face contains these
 * 3 consecutive vertices? (3 vertices in sequential order, from two adjacent edges)"
 * The keys are space-separated trios of vertex indices, 3 vertices which
 * are found when walking a face. These 3 vertices uniquely point to one and only one
 * face, and the counter-clockwise walk direction is respected, this is not
 * bidirectional, and does not contain the opposite order of the same 3 vertices.
 * @param {FOLD} graph a FOLD object, containing faces_vertices
 * @returns {object} space-separated vertex trio keys, face indices values
 * @linkcode Origami ./src/graph/make.js 206
 */
const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};
/**
 * @description For every vertex, make an array of vectors that point towards each
 * of the incident vertices. This is accomplised by taking the vertices_vertices
 * array and converting it into vectors, indices will be aligned with vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][][]} array of array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays correspond to vertices_vertices, and inside is a 2D vector
 * @todo this can someday be rewritten without edges_vertices
 * @linkcode Origami ./src/graph/make.js 227
 */
const makeVerticesVerticesVector = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return math.core.flip(edges_vector[edge_b]); }
			}));
};
/**
 * @description Between pairs of counter-clockwise adjacent edges around a vertex
 * is the sector measured in radians. This builds an array of of sector angles,
 * index matched to vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays contains angles in radians
 * @linkcode Origami ./src/graph/make.js 252
 */
const makeVerticesSectors = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => makeVerticesVerticesVector({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
})
	.map(vectors => (vectors.length === 1 // leaf node
		? [math.core.TWO_PI] // interior_angles gives 0 for leaf nodes. we want 2pi
		: math.core.counterClockwiseSectors2(vectors)));
/**
 *
 *    EDGES
 *
 */
/**
 * @description Make `edges_edges` containing all vertex-adjacent edges.
 * This will be radially sorted if you call makeVerticesEdges before calling this.
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, vertices_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of other edges.
 * @linkcode Origami ./src/graph/make.js 273
 */
const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is unsorted, prefer makeEdgesFaces()
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 287
 */
const makeEdgesFacesUnsorted = ({ edges_vertices, faces_edges }) => {
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like edges_vertices)
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(countImplied.edges({ faces_edges }))).map(() => []);
	// todo: does not arrange counter-clockwise
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};
/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is sorted according to the FOLD spec, sorting faces on either side of an edge.
 * @param {FOLD} graph a FOLD object, with entries vertices_coords,
 * edges_vertices, faces_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 312
 */
const makeEdgesFaces = ({
	vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center,
}) => {
	if (!edges_vertices) {
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	// sort edges_faces in 2D based on which side of the edge's vector
	// each face lies, sorting the face on the left first. see FOLD spec.
	edges_faces.forEach((faces, e) => {
		const faces_cross = faces
			.map(f => faces_center[f])
			.map(center => math.core.subtract2(center, edges_origin[e]))
			.map(vector => math.core.cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};

const assignment_angles = {
	M: -180, m: -180, V: 180, v: 180,
};
/**
 * @description Convert edges assignment into fold angle in degrees for every edge.
 * @param {FOLD} graph a FOLD object, with edges_assignment
 * @returns {number[]} array of fold angles in degrees
 * @linkcode Origami ./src/graph/make.js 354
 */
const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);
/**
 * @description Convert edges fold angle into assignment for every edge.
 * @param {FOLD} graph a FOLD object, with edges_foldAngle
 * @returns {string[]} array of fold assignments
 * @linkcode Origami ./src/graph/make.js 362
 */
const makeEdgesAssignment = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		// todo, consider finding the boundary
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
/**
 * @description map vertices_coords onto edges_vertices so that the result
 * is an edge array where each edge contains its two points. Each point being
 * the 2D or 3D coordinate as an array of numbers.
 * @param {FOLD} graph a FOLD graph with vertices and edges
 * @returns {number[][][]} an array of array of points (which are arrays of numbers)
 * @linkcode Origami ./src/graph/make.js 376
 */
const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => edges_vertices
	.map(ev => ev.map(v => vertices_coords[v]));
/**
 * @description Turn every edge into a vector, basing the direction on the order of
 * the pair of vertices in each edges_vertices entry.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[][]} each entry relates to an edge, each array contains a 2D vector
 * @linkcode Origami ./src/graph/make.js 385
 */
const makeEdgesVector = ({ vertices_coords, edges_vertices }) => makeEdgesCoords({
	vertices_coords, edges_vertices,
}).map(verts => math.core.subtract(verts[1], verts[0]));
/**
 * @description For every edge, find the length between the edges pair of vertices.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[]} the distance between each edge's pair of vertices
 * @linkcode Origami ./src/graph/make.js 394
 */
const makeEdgesLength = ({ vertices_coords, edges_vertices }) => makeEdgesVector({
	vertices_coords, edges_vertices,
}).map(vec => math.core.magnitude(vec));
/**
 * @description Make an array of axis-aligned bounding boxes, one for each edge,
 * that encloses the edge, and will work in n-dimensions. Intended for
 * fast line-sweep algorithms.
 * @param {FOLD} graph a FOLD graph with vertices and edges.
 * @returns {object[]} an array of boxes, length matching the number of edges
 * @linkcode Origami ./src/graph/make.js 405
 */
const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => math.core.boundingBox(coords, epsilon));
};
/**
 *
 *    FACES
 *
 */
/**
 * @description Rebuild all faces in a 2D planar graph by walking counter-clockwise
 * down every edge (both ways). This does not include the outside face which winds
 * around the boundary backwards enclosing the outside space.
 * @param {FOLD} graph a FOLD graph
 * @returns {object[]} array of faces as objects containing "vertices" "edges" and "angles"
 * @example
 * // to convert the return object into faces_vertices and faces_edges
 * var faces = makePlanarFaces(graph);
 * faces_vertices = faces.map(el => el.vertices);
 * faces_edges = faces.map(el => el.edges);
 * @linkcode Origami ./src/graph/make.js 431
 */
const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// planarVertexWalk stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	return filterWalkedBoundaryFace(planarVertexWalk({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
};
// export const makePlanarFacesVertices = graph => makePlanarFaces(graph)
// 	.map(face => face.vertices);

// export const makePlanarFacesEdges = graph => makePlanarFaces(graph)
// 	.map(face => face.edges);

// const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
// 	if (!edges_vertices) { return {}; }
// 	const map = {};
// 	edges_vertices
// 		.map(ev => ev.sort((a, b) => a - b).join(" "))
// 		.forEach((key, i) => { map[key] = i; });
// 	return map;
// };
// todo: this needs to be tested
/**
 * @description Make `faces_vertices` from `faces_edges`.
 * @param {FOLD} graph a FOLD graph, with faces_edges, edges_vertices
 * @returns {number[][]} a `faces_vertices` array
 * @linkcode Origami ./src/graph/make.js 472
 */
const makeFacesVerticesFromEdges = (graph) => graph.faces_edges
	.map(edges => edges
		.map(edge => graph.edges_vertices[edge])
		.map((pairs, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			return (pairs[0] === next[0] || pairs[0] === next[1])
				? pairs[1]
				: pairs[0];
		}));
/**
 * @description Make `faces_edges` from `faces_vertices`.
 * @param {FOLD} graph a FOLD graph, with faces_vertices
 * @returns {number[][]} a `faces_edges` array
 * @linkcode Origami ./src/graph/make.js 487
 */
const makeFacesEdgesFromVertices = (graph) => {
	const map = makeVerticesToEdgeBidirectional(graph);
	return graph.faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
/**
 * @description faces_faces is an array of edge-adjacent face indices for each face.
 * @param {FOLD} graph a FOLD graph, with faces_vertices
 * @returns {number[][]} each index relates to a face, each entry is an array
 * of numbers, each number is an index of an edge-adjacent face to this face.
 * @linkcode Origami ./src/graph/make.js 501
 */
const makeFacesFaces = ({ faces_vertices }) => {
	const faces_faces = faces_vertices.map(() => []);
	const edgeMap = {};
	faces_vertices
		.map((face, f) => face
			.map((v0, i, arr) => {
				let v1 = arr[(i + 1) % face.length];
				if (v1 < v0) { [v0, v1] = [v1, v0]; }
				const key = `${v0} ${v1}`;
				if (edgeMap[key] === undefined) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1], 10));
			faces_faces[pair[1]].push(parseInt(pair[0], 10));
		});
	return faces_faces;
};
// export const makeFacesFaces = ({ faces_vertices }) => {
//   // if (!faces_vertices) { return undefined; }
//   const faces_faces = faces_vertices.map(() => []);
//   // create a map where each key is a string of the vertices of an edge,
//   // like "3 4"
//   // and each value is an array of faces adjacent to this edge.
//   const edgeMap = {};
//   faces_vertices.forEach((vertices_index, idx1) => {
//     vertices_index.forEach((v1, i, vs) => {
//       let v2 = vs[(i + 1) % vertices_index.length];
//       if (v2 < v1) { [v1, v2] = [v2, v1]; }
//       const key = `${v1} ${v2}`;
//       if (key in edgeMap) {
//         const idx2 = edgeMap[key];
//         faces_faces[idx1].push(idx2);
//         faces_faces[idx2].push(idx1);
//       } else {
//         edgeMap[key] = idx1;
//       }
//     });
//   });
//   return faces_faces;
// };
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points, with an additional step:
 * ensure that each polygon has 0 collinear vertices.
 * this can result in a polygon with fewer vertices than is contained
 * in that polygon's faces_vertices array.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 556
 */
const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => math.core.makePolygonNonCollinear(polygon, epsilon));
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points. "Quick" meaning collinear vertices are
 * not removed, which in some cases, this will be the preferred method.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 567
 */
const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));
/**
 * @description For every face, get the face's centroid.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 575
 */
const makeFacesCenter = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => math.core.centroid(coords));
/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 586
 */
const makeFacesCenterQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / vertices.length));

var make = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeVerticesEdgesUnsorted: makeVerticesEdgesUnsorted,
	makeVerticesEdges: makeVerticesEdges,
	makeVerticesVertices: makeVerticesVertices,
	makeVerticesFacesUnsorted: makeVerticesFacesUnsorted,
	makeVerticesFaces: makeVerticesFaces,
	makeVerticesToEdgeBidirectional: makeVerticesToEdgeBidirectional,
	makeVerticesToEdge: makeVerticesToEdge,
	makeVerticesToFace: makeVerticesToFace,
	makeVerticesVerticesVector: makeVerticesVerticesVector,
	makeVerticesSectors: makeVerticesSectors,
	makeEdgesEdges: makeEdgesEdges,
	makeEdgesFacesUnsorted: makeEdgesFacesUnsorted,
	makeEdgesFaces: makeEdgesFaces,
	makeEdgesFoldAngle: makeEdgesFoldAngle,
	makeEdgesAssignment: makeEdgesAssignment,
	makeEdgesCoords: makeEdgesCoords,
	makeEdgesVector: makeEdgesVector,
	makeEdgesLength: makeEdgesLength,
	makeEdgesBoundingBox: makeEdgesBoundingBox,
	makePlanarFaces: makePlanarFaces,
	makeFacesVerticesFromEdges: makeFacesVerticesFromEdges,
	makeFacesEdgesFromVertices: makeFacesEdgesFromVertices,
	makeFacesFaces: makeFacesFaces,
	makeFacesPolygon: makeFacesPolygon,
	makeFacesPolygonQuick: makeFacesPolygonQuick,
	makeFacesCenter: makeFacesCenter,
	makeFacesCenterQuick: makeFacesCenterQuick
});

/**
 * Rabbit Ear (c) Kraft
 */

// export const get_undefined_edges = ({ edges_vertices }) => {
//   const bad = [];
//   for (let i = 0; i < edges_vertices.length; i += 1) {
//     if (edges_vertices[i][0] === undefined
//       || edges_vertices[i][1] === undefined
//       || edges_vertices[i][0] === null
//       || edges_vertices[i][1] === null) {
//       bad.push(i);
//     }
//   }
//   return bad;
// };
/**
 * @description Get the indices of all circular edges. Circular edges are
 * edges where both of its edges_vertices is the same vertex.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} array of indices of circular edges. empty if none.
 * @linkcode Origami ./src/graph/edgesViolations.js 34
 */
const getCircularEdges = ({ edges_vertices }) => {
	const circular = [];
	for (let i = 0; i < edges_vertices.length; i += 1) {
		if (edges_vertices[i][0] === edges_vertices[i][1]) {
			circular.push(i);
		}
	}
	return circular;
};
/**
 * @description Get the indices of all duplicate edges by marking the
 * second/third/... as duplicate (not the first of the duplicates).
 * The result is given as an array with holes, where:
 * - the indices are the indices of the duplicate edges.
 * - the values are the indices of the first occurence of the duplicate.
 * Under this system, many edges can be duplicates of the same edge.
 * Order is not important. [5,9] and [9,5] are still duplicate.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} an array where the redundant edges are the indices,
 * and the values are the indices of the first occurence of the duplicate.
 * @example
 * {number[]} array, [4:3, 7:5, 8:3, 12:3, 14:9] where indices
 * (3, 4, 8, 12) are all duplicates. (5,7), (9,14) are also duplicates.
 * @linkcode Origami ./src/graph/edgesViolations.js 59
 */
const getDuplicateEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const duplicates = [];
	const map = {};
	for (let i = 0; i < edges_vertices.length; i += 1) {
		// we need to store both, but only need to test one
		const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
		const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
		if (map[a] !== undefined) { // instead of (map[a] || map[b])
			duplicates[i] = map[a];
		} else {
			// only update the map. if an edge exists as two vertices, it will only
			// be set once, this prevents chains of duplicate relationships where
			// A points to B points to C points to D...
			map[a] = i;
			map[b] = i;
		}
	}
	return duplicates;
};
/**
 * @description Given a set of graph geometry (vertices/edges/faces) indices,
 * get all the arrays which reference these geometries, (eg: end in _edges),
 * and remove (splice) that entry from the array if it contains a remove value.
 * @param {FOLD} graph a FOLD object
 * @param {string} suffix a component intended as a suffix, like "vertices" for "edges_vertices"
 * @example
 * removing indices [4, 7] from "edges", then a faces_edges entry
 * which was [15, 13, 4, 9, 2] will become [15, 13, 9, 2].
 */
const spliceRemoveValuesFromSuffixes = (graph, suffix, remove_indices) => {
	const remove_map = {};
	remove_indices.forEach(n => { remove_map[n] = true; });
	getGraphKeysWithSuffix(graph, suffix)
		.forEach(sKey => graph[sKey] // faces_edges or vertices_edges...
			.forEach((elem, i) => { // faces_edges[0], faces_edges[1], ...
				// reverse iterate through array, remove elements with splice
				for (let j = elem.length - 1; j >= 0; j -= 1) {
					if (remove_map[elem[j]] === true) {
						graph[sKey][i].splice(j, 1);
					}
				}
			}));
};
/**
 * @description Find and remove all circular edges from a graph.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} [remove_indices=undefined] Leave this empty. Otherwise, if
 * getCircularEdges() has already been called, provide the result here to speed
 * up the algorithm.
 * @returns {object} a summary of changes
 * @linkcode Origami ./src/graph/edgesViolations.js 112
 */
const removeCircularEdges = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = getCircularEdges(graph);
	}
	if (remove_indices.length) {
		// remove every instance of a circular edge in every _edge array.
		// assumption is we can simply remove them because a face that includes
		// a circular edge is still the same face when you just remove the edge
		spliceRemoveValuesFromSuffixes(graph, _edges, remove_indices);
		// console.warn("circular edge found. please rebuild");
		// todo: figure out which arrays need to be rebuilt, if it exists.
	}
	return {
		map: removeGeometryIndices(graph, _edges, remove_indices),
		remove: remove_indices,
	};
};
/**
 * @description Find and remove all duplicate edges from a graph.
 * If an edge is removed, it will mess up the vertices data (vertices_vertices,
 * vertices_edges, vertices_faces) so if this method successfully found and
 * removed a duplicate edge, the vertices arrays will be rebuilt as well.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} [replace_indices=undefined] Leave this empty. Otherwise, if
 * getDuplicateEdges() has already been called, provide the result here to speed
 * up the algorithm.
 * @returns {object} a summary of changes
 * @linkcode Origami ./src/graph/edgesViolations.js 141
 */
const removeDuplicateEdges = (graph, replace_indices) => {
	// index: edge to remove, value: the edge which should replace it.
	if (!replace_indices) {
		replace_indices = getDuplicateEdges(graph);
	}
	const remove = Object.keys(replace_indices).map(n => parseInt(n, 10));
	const map = replaceGeometryIndices(graph, _edges, replace_indices);
	// if edges were removed, we need to rebuild vertices_edges and then
	// vertices_vertices since that was built from vertices_edges, and then
	// vertices_faces since that was built from vertices_vertices.
	if (remove.length) {
		// currently we are rebuilding the entire arrays, if possible,
		// update these specific vertices directly:
		// const vertices = remove
		//   .map(edge => graph.edges_vertices[edge])
		//   .reduce((a, b) => a.concat(b), []);
		if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
			graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
			graph.vertices_vertices = makeVerticesVertices(graph);
			graph.vertices_edges = makeVerticesEdges(graph);
			graph.vertices_faces = makeVerticesFaces(graph);
		}
	}
	return { map, remove };
};

var edgesViolations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getCircularEdges: getCircularEdges,
	getDuplicateEdges: getDuplicateEdges,
	removeCircularEdges: removeCircularEdges,
	removeDuplicateEdges: removeDuplicateEdges
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Provide two or more simple nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simple nextmaps
 * @returns {number[]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 10
 */
const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};
/**
 * @description Provide two or more nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of nextmaps
 * @returns {number[][]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 23
 */
const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx, j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};
/**
 * @description Provide two or more simple backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simplebackmaps
 * @returns {number[]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 43
 */
const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach(map => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};
/**
 * @description Provide two or more  backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of backmaps
 * @returns {number[][]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 59
 */
const mergeBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach(map => {
		const next = [];
		map.forEach((el, j) => {
			if (typeof el === _number) {
				next[j] = solution[el];
			} else {
				next[j] = el.map(n => solution[n]).reduce((a, b) => a.concat(b), []);
			}
		});
		solution = next;
	});
	return solution;
};
/**
 * @description invert an array of integers so that indices become values and
 * values become indices. in the case of multiple values trying to insert
 * into the same index, a child array is made to house both (or more) numbers.
 * @param {number[]|number[][]} map an array of integers
 * @returns {number[]|number[][]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 83
 */
const invertMap = (map) => {
	const inv = [];
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === _number) {
			// before we set the inverted map [i] spot, check if something is already there
			if (inv[n] !== undefined) {
				// if that thing is a number, turn it into an array
				if (typeof inv[n] === _number) {
					inv[n] = [inv[n], i];
				} else {
					// already an array, add to it
					inv[n].push(i);
				}
			} else {
				inv[n] = i;
			}
		}
		if (n.constructor === Array) { n.forEach(m => { inv[m] = i; }); }
	});
	return inv;
};
/**
 * @description invert an array of integers so that indices become values
 * and values become indices. duplicate entries will be overwritten.
 * @param {number[]} map an array of integers
 * @returns {number[]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 112
 */
const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};

var maps = /*#__PURE__*/Object.freeze({
	__proto__: null,
	mergeSimpleNextmaps: mergeSimpleNextmaps,
	mergeNextmaps: mergeNextmaps,
	mergeSimpleBackmaps: mergeSimpleBackmaps,
	mergeBackmaps: mergeBackmaps,
	invertMap: invertMap,
	invertSimpleMap: invertSimpleMap
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description clean will remove bad graph data. this includes:
 * - duplicate (Euclidean distance) and isolated vertices
 * - circular and duplicate edges.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} summary of changes, a nextmap and the indices removed.
 * @linkcode Origami ./src/graph/clean.js 24
 */
const clean = (graph, epsilon) => {
	// duplicate vertices has to be done first as it's possible that
	// this will create circular/duplicate edges.
	const change_v1 = removeDuplicateVertices(graph, epsilon);
	const change_e1 = removeCircularEdges(graph);
	const change_e2 = removeDuplicateEdges(graph);
	// isolated vertices is last. removing edges can create isolated vertices
	const change_v2 = removeIsolatedVertices(graph);
	// todo: it's possible that an edges_vertices now contains undefineds,
	// like [4, undefined]. but this should not be happening

	// return a summary of changes.
	// use the maps to update the removed indices from the second step
	// to their previous index before change 1 occurred.
	const change_v1_backmap = invertSimpleMap(change_v1.map);
	const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
	const change_e1_backmap = invertSimpleMap(change_e1.map);
	const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
	return {
		vertices: {
			map: mergeSimpleNextmaps(change_v1.map, change_v2.map),
			remove: change_v1.remove.concat(change_v2_remove),
		},
		edges: {
			map: mergeSimpleNextmaps(change_e1.map, change_e2.map),
			remove: change_e1.remove.concat(change_e2_remove),
		},
	};
};

/**
 * Rabbit Ear (c) Kraft
 */

// import getVerticesEdgesOverlap from "./vertices_edges_overlap";

/**
 * @description iterate over all graph cross-references between vertices,
 * edges, and faces, and, instead of checking if each index exists,
 * (which would be nice), do the faster operation of simply checking
 * if the largest reference is out of bounds of the component array length.
 * @returns {boolean} true if all references are valid within bounds.
 */
const validate_references = (graph) => {
	const counts = {
		vertices: count.vertices(graph),
		edges: count.edges(graph),
		faces: count.faces(graph),
	};
	const implied = {
		vertices: countImplied.vertices(graph),
		edges: countImplied.edges(graph),
		faces: countImplied.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	};
};
/**
 * @description Validate a graph, get back a report on its duplicate/circular components.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a report on the validity state of the graph. a "summary" string,
 * and "vertices" "edges" and "faces" information
 * @linkcode Origami ./src/graph/validate.js 47
 */
const validate$1 = (graph, epsilon) => {
	const duplicate_edges = getDuplicateEdges(graph);
	const circular_edges = getCircularEdges(graph);
	const isolated_vertices = getIsolatedVertices(graph);
	const duplicate_vertices = getDuplicateVertices(graph, epsilon);
	const references = validate_references(graph);
	const is_perfect = duplicate_edges.length === 0
		&& circular_edges.length === 0
		&& isolated_vertices.length === 0
		&& references.vertices && references.edges && references.faces;
		// && more..?
	const summary = is_perfect ? "valid" : "problematic";
	return {
		summary,
		vertices: {
			isolated: isolated_vertices,
			duplicate: duplicate_vertices,
			references: references.vertices,
		},
		edges: {
			circular: circular_edges,
			duplicate: duplicate_edges,
			references: references.edges,
		},
		faces: {
			references: references.faces,
		},
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description populate() has been one of the hardest methods to
 * nail down, not to write, moreso in what it should do, and what
 * function it serves in the greater library.
 * Currently, it is run once when a user imports their crease pattern
 * for the first time, preparing it for use with methods like
 * "splitFace" or "flatFold", which expect a well-populated graph.
 */
//
// big todo: populate assumes the graph is planar and rebuilds planar faces
//

// try best not to lose information
const build_assignments_if_needed = (graph) => {
	const len = graph.edges_vertices.length;
	// we know that edges_vertices exists
	if (!graph.edges_assignment) { graph.edges_assignment = []; }
	if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
	// complete the shorter array to match the longer one
	if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
		for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
			graph.edges_foldAngle[i] = edgeAssignmentToFoldAngle(graph.edges_assignment[i]);
		}
	}
	if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	// two arrays should be at the same length now. even if they are not complete
	for (let i = graph.edges_assignment.length; i < len; i += 1) {
		graph.edges_assignment[i] = "U";
		graph.edges_foldAngle[i] = 0;
	}
};
/**
 * @param {object} a FOLD object
 * @param {boolean} reface should be set to "true" to force the algorithm into
 * rebuilding the faces from scratch (walking edge to edge in the plane).
 */
const build_faces_if_needed = (graph, reface) => {
	// if faces_vertices does not exist, we need to build it.
	// todo: if faces_edges exists but not vertices (unusual but possible),
	// then build faces_vertices from faces_edges and call it done.
	if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
		reface = true;
	}
	// build planar faces (no Z) if the user asks for it or if faces do not exist.
	// todo: this is making a big assumption that the faces are even planar
	// to begin with.
	if (reface && graph.vertices_coords) {
		const faces = makePlanarFaces(graph);
		graph.faces_vertices = faces.map(face => face.vertices);
		graph.faces_edges = faces.map(face => face.edges);
		// graph.faces_sectors = faces.map(face => face.angles);
		return;
	}
	// if both faces exist, and no request to be rebuilt, exit.
	if (graph.faces_vertices && graph.faces_edges) { return; }
	// between the two: faces_vertices and faces_edges,
	// if only one exists, build the other.
	if (graph.faces_vertices && !graph.faces_edges) {
		graph.faces_edges = makeFacesEdgesFromVertices(graph);
	} else if (graph.faces_edges && !graph.faces_vertices) {
		graph.faces_vertices = makeFacesVerticesFromEdges(graph);
	} else {
		// neither array exists, set placeholder empty arrays.
		graph.faces_vertices = [];
		graph.faces_edges = [];
	}
};
/**
 * this function attempts to rebuild useful geometries in your graph.
 * right now let's say it's important to have:
 * - vertices_coords
 * - either edges_vertices or faces_vertices - todo: this isn't true yet.
 * - either edges_foldAngle or edges_assignment
 *
 * this WILL REWRITE components that aren't the primary source keys,
 * like vertices_vertices.
 *
 * if you do have edges_assignment instead of edges_foldAngle the origami
 * will be limited to flat-foldable.
 */
/**
 * @description Populate all arrays in a FOLD graph. This includes building adjacency
 * components like vertices_vertices, making edges_assignments from foldAngles or
 * visa-versa, and building faces if they don't exist.
 * @param {FOLD} graph a FOLD graph
 * @param {boolean} [reface=false] optional boolean, request to rebuild all faces
 * @return {FOLD} graph the same input graph object
 * @linkcode Origami ./src/graph/populate.js 114
 */
const populate = (graph, reface) => {
	if (typeof graph !== "object") { return graph; }
	if (!graph.edges_vertices) { return graph; }
	graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
	graph.vertices_vertices = makeVerticesVertices(graph);
	graph.vertices_edges = makeVerticesEdges(graph);
	// todo consider adding vertices_sectors, these are used for
	// planar graphs (crease patterns) for walking faces
	// todo, what is the reason to have edges_vector?
	// if (graph.vertices_coords) {
	//   graph.edges_vector = makeEdgesVector(graph);
	// }
	// make sure "edges_foldAngle" and "edges_assignment" are done.
	build_assignments_if_needed(graph);
	// make sure "faces_vertices" and "faces_edges" are built.
	build_faces_if_needed(graph, reface);
	// depending on the presence of vertices_vertices, this will
	// run the simple algorithm (no radial sorting) or the proper one.
	graph.vertices_faces = makeVerticesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.faces_faces = makeFacesFaces(graph);
	return graph;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description This returns a matrix relating every edge to every vertex,
 * answering the question "does the vertex sit inside the edge's bounding box?"
 * It doesn't solve if a vertex lies on an edge, only that it *might* lie along an edge.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon to be added as padding to the bounding boxes
 * @returns {boolean[][]} array matching edges_ length where each value is
 * an array matching vertices_ length, containing true/false.
 * @linkcode Origami ./src/graph/span.js 14
 */
const getEdgesVerticesOverlappingSpan = (graph, epsilon = math.core.EPSILON) => (
	makeEdgesBoundingBox(graph, epsilon)
		.map(min_max => graph.vertices_coords
			.map(vert => (
				vert[0] > min_max.min[0]
				&& vert[1] > min_max.min[1]
				&& vert[0] < min_max.max[0]
				&& vert[1] < min_max.max[1])))
);
/**
 * @description Calculate every edge's rectangular bounding box and compare every box to
 * every box to determine if boxes overlap. This doesn't claim edges overlap, only that
 * their bounding boxes do, and that two edges *might* overlap.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon to be added as padding to the bounding boxes
 * @returns {boolean[][]} NxN 2D array filled with true/false answering
 * "do edges's bounding boxes overlap?"
 * Both triangles of the matrix are filled and the main diagonal contains true.
 * ```text
 *     0  1  2  3
 * 0 [ t,  ,  ,  ]
 * 1 [  , t,  ,  ]
 * 2 [  ,  , t,  ]
 * 3 [  ,  ,  , t]
 * ```
 * @linkcode Origami ./src/graph/span.js 41
 */
const getEdgesEdgesOverlapingSpans = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = math.core.EPSILON) => {
	const min_max = makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	// span_overlaps will be false if no overlap possible, true if overlap is possible.
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			// if first max is less than second min, or second max is less than first min,
			// for both X and Y
			const outside_of = (
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&& (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]));
			// true if the spans are not touching. flip for overlap
			span_overlaps[e0][e1] = !outside_of;
			span_overlaps[e1][e0] = !outside_of;
		}
	}
	for (let i = 0; i < edges_vertices.length; i += 1) {
		span_overlaps[i][i] = true;
	}
	return span_overlaps;
};

var span = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getEdgesVerticesOverlappingSpan: getEdgesVerticesOverlappingSpan,
	getEdgesEdgesOverlapingSpans: getEdgesEdgesOverlapingSpans
});

/**
 * Rabbit Ear (c) Kraft
 */

const getOppositeVertices$1 = ({ edges_vertices }, vertex, edges) => {
	edges.forEach(edge => {
		if (edges_vertices[edge][0] === vertex
			&& edges_vertices[edge][1] === vertex) {
			console.warn("removePlanarVertex circular edge");
		}
	});
	return edges.map(edge => (edges_vertices[edge][0] === vertex
		? edges_vertices[edge][1]
		: edges_vertices[edge][0]));
};
/**
 * @description determine if a vertex exists between two and only two edges, and
 * those edges are both parallel and on opposite ends of the vertex. In a lot of
 * cases, this vertex can be removed and the graph would function the same.
 * @param {FOLD} graph a FOLD object
 * @param {number} vertex an index of a vertex in the graph
 * @returns {boolean} true if the vertex is collinear and can be removed.
 * @linkcode Origami ./src/graph/verticesCollinear.js 26
 */
const isVertexCollinear = ({
	vertices_coords, vertices_edges, edges_vertices,
}, vertex, epsilon = math.core.EPSILON) => {
	if (!vertices_coords || !edges_vertices) { return false; }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges = vertices_edges[vertex];
	if (edges === undefined || edges.length !== 2) { return false; }
	// don't just check if they are parallel, use the direction of the vertex
	// to make sure the center vertex is inbetween, instead of the odd
	// case where the two edges are on top of one another with
	// a leaf-like vertex.
	const vertices = getOppositeVertices$1({ edges_vertices }, vertex, edges);
	const points = [vertices[0], vertex, vertices[1]]
		.map(v => vertices_coords[v]);
	return math.core.collinearBetween(...points, false, epsilon);
};
/**
 * check each vertex against each edge, we want to know if a vertex is
 * lying collinear along an edge, the usual intention is to substitute
 * the edge with 2 edges that include the collinear vertex.
 */
/**
 * this DOES NOT return vertices that are already connected
 * between two adjacent and collinear edges, in a valid graph
 *    O------------O------------O
 * for this you want: ___________ method
 */
/**
 * @description Get a list of lists where for every edge there is a
 * list filled with vertices that lies collinear to the edge, where
 * collinearity only counts if the vertex lies between the edge's endpoints,
 * excluding the endpoints themselves.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} size matched to the edges_ arrays, with an empty array
 * unless a vertex lies collinear, the edge's array will contain that vertex's index.
 * @linkcode Origami ./src/graph/verticesCollinear.js 66
 */
const getVerticesEdgesOverlap = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = math.core.EPSILON) => {
	if (!edges_coords) {
		edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
	}
	const edges_span_vertices = getEdgesVerticesOverlappingSpan({
		vertices_coords, edges_vertices, edges_coords,
	}, epsilon);
	// todo, consider pushing values into a results array instead of modifying,
	// then filtering the existing one
	for (let e = 0; e < edges_coords.length; e += 1) {
		for (let v = 0; v < vertices_coords.length; v += 1) {
			if (!edges_span_vertices[e][v]) { continue; }
			edges_span_vertices[e][v] = math.core.overlapLinePoint(
				math.core.subtract(edges_coords[e][1], edges_coords[e][0]),
				edges_coords[e][0],
				vertices_coords[v],
				math.core.excludeS,
				epsilon,
			);
		}
	}
	return edges_span_vertices
		.map(verts => verts
			.map((vert, i) => (vert ? i : undefined))
			.filter(i => i !== undefined));
};

var vertices_collinear = /*#__PURE__*/Object.freeze({
	__proto__: null,
	isVertexCollinear: isVertexCollinear,
	getVerticesEdgesOverlap: getVerticesEdgesOverlap
});

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Find all edges in a graph which lie parallel along a line (infinite line).
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vector a line defined by a vector crossing a point
 * @param {number[]} point a line defined by a vector crossing a point
 * @returns {boolean[]} length matching number of edges, true if parallel and overlapping
 * @linkcode Origami ./src/graph/intersect.js 18
 */
const makeEdgesLineParallelOverlap = ({
	vertices_coords, edges_vertices,
}, vector, point, epsilon = math.core.EPSILON) => {
	const normalized = math.core.normalize2(vector);
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(edge => math.core.subtract2(edge[1], edge[0]));
	// first, filter out edges which are not parallel
	const overlap = edges_vector
		.map(vec => math.core.parallel2(vec, vector, epsilon));
	// second, filter out edges which do not lie on top of the line
	for (let e = 0; e < edges_vertices.length; e += 1) {
		if (!overlap[e]) { continue; }
		if (math.core.fnEpsilonEqualVectors(edges_origin[e], point)) {
			overlap[e] = true;
			continue;
		}
		const vec = math.core.normalize2(math.core.subtract2(edges_origin[e], point));
		const dot = Math.abs(math.core.dot2(vec, normalized));
		overlap[e] = Math.abs(1.0 - dot) < epsilon;
	}
	return overlap;
};
/**
 * @description Find all edges in a graph which lie parallel along a segment, the
 * endpoints of the segments and the edges are inclusive.
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array length matching number of edges containing a point
 * if there is an intersection, and undefined if no intersection.
 * @linkcode Origami ./src/graph/intersect.js 52
 */
const makeEdgesSegmentIntersection = ({
	vertices_coords, edges_vertices, edges_coords,
}, point1, point2, epsilon = math.core.EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	const segment_box = math.core.boundingBox([point1, point2], epsilon);
	const segment_vector = math.core.subtract2(point2, point1);
	// convert each edge into a bounding box, do bounding-box intersection
	// with the segment, filter these results, then run actual intersection
	// algorithm on this subset.
	return makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon)
		.map(box => math.core.overlapBoundingBoxes(segment_box, box))
		.map((overlap, i) => (overlap ? (math.core.intersectLineLine(
			segment_vector,
			point1,
			math.core.subtract2(edges_coords[i][1], edges_coords[i][0]),
			edges_coords[i][0],
			math.core.includeS,
			math.core.includeS,
			epsilon,
		)) : undefined));
};
/**
 * @description This method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 * @param {FOLD} graph a FOLD graph. only requires { edges_vector, edges_origin }
 * if they don't exist this will build them from { vertices_coords, edges_vertices }
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} NxN matrix comparing indices, undefined in the case of
 * no intersection, a point object in array form if yes, and this array is stored
 * in 2 PLACES! both [i][j] and [j][i], however it is stored by reference,
 * it is the same js object.
 *     0  1  2  3
 * 0 [  , x,  ,  ]
 * 1 [ x,  ,  , x]
 * 2 [  ,  ,  ,  ]
 * 3 [  , x,  ,  ]
 * @linkcode Origami ./src/graph/intersect.js 92
 */
const makeEdgesEdgesIntersection = function ({
	vertices_coords, edges_vertices, edges_vector, edges_origin,
}, epsilon = math.core.EPSILON) {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!edges_origin) {
		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	}
	const edges_intersections = edges_vector.map(() => []);
	const span = getEdgesEdgesOverlapingSpans({ vertices_coords, edges_vertices }, epsilon);
	for (let i = 0; i < edges_vector.length - 1; i += 1) {
		for (let j = i + 1; j < edges_vector.length; j += 1) {
			if (span[i][j] !== true) {
				// this setter is unnecessary but otherwise the result is filled with
				// both undefined and holes. this makes it consistent
				edges_intersections[i][j] = undefined;
				continue;
			}
			edges_intersections[i][j] = math.core.intersectLineLine(
				edges_vector[i],
				edges_origin[i],
				edges_vector[j],
				edges_origin[j],
				math.core.excludeS,
				math.core.excludeS,
				epsilon,
			);
			edges_intersections[j][i] = edges_intersections[i][j];
		}
	}
	return edges_intersections;
};
/**
 * @description intersect a convex face with a line and return the location
 * of the intersections as components of the graph. this is an EXCLUSIVE
 * intersection. line collinear to the edge counts as no intersection.
 * there are 5 cases:
 * - no intersection (undefined)
 * - intersect one vertex (undefined)
 * - intersect two vertices (valid, or undefined if neighbors)
 * - intersect one vertex and one edge (valid)
 * - intersect two edges (valid)
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face
 * @param {number[]} vector the vector component describing the line
 * @param {number[]} origin a point that lies along the line
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} "vertices" and "edges" keys, indices of the
 * components which intersect the line. or undefined if no intersection
 * @linkcode Origami ./src/graph/intersect.js 144
 */
const intersectConvexFaceLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, face, vector, point, epsilon = math.core.EPSILON) => {
	// give us back the indices in the faces_vertices[face] array
	// we can count on these being sorted (important later)
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => math.core.overlapLinePoint(vector, point, coord, () => true, epsilon))
		.map((overlap, i) => (overlap ? i : undefined))
		.filter(i => i !== undefined);
	// o-----o---o  we have to test against cases like this, where more than two
	// |         |  vertices lie along one line.
	// o---------o
	const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
	// concat a duplication of the array where the second array's vertices'
	// indices' are all increased by the faces_vertices[face].length.
	// ask every neighbor pair if they are 1 away from each other, if so, the line
	// lies along an outside edge of the convex poly, return "no intersection".
	// the concat is needed to detect neighbors across the end-beginning loop.
	const vertices_are_neighbors = face_vertices_indices
		.concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
		.map((n, i, arr) => arr[i + 1] - n === 1)
		.reduce((a, b) => a || b, false);
	// if vertices are neighbors
	// because convex polygon, if collinear vertices lie along an edge,
	// it must be an outside edge. this case returns no intersection.
	if (vertices_are_neighbors) { return undefined; }
	if (vertices.length > 1) { return { vertices, edges: [] }; }
	// run the line-segment intersection on every side of the face polygon
	const edges = faces_edges[face]
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]))
		.map(seg => math.core.intersectLineLine(
			vector,
			point,
			math.core.subtract(seg[1], seg[0]),
			seg[0],
			math.core.includeL,
			math.core.excludeS,
			epsilon,
		)).map((coords, face_edge_index) => ({
			coords,
			edge: faces_edges[face][face_edge_index],
		}))
		// remove edges with no intersection
		.filter(el => el.coords !== undefined)
		// remove edges which share a vertex with a previously found vertex.
		// these edges are because the intersection is near a vertex but also
		// intersects the edge very close to the end.
		.filter(el => !(vertices
			.map(v => edges_vertices[el.edge].includes(v))
			.reduce((a, b) => a || b, false)));
	// only return the case with 2 intersections. for example, only 1 vertex
	// intersection implies outside the polygon, collinear with one vertex.
	return (edges.length + vertices.length === 2
		? { vertices, edges }
		: undefined);
};

var intersect = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeEdgesLineParallelOverlap: makeEdgesLineParallelOverlap,
	makeEdgesSegmentIntersection: makeEdgesSegmentIntersection,
	makeEdgesEdgesIntersection: makeEdgesEdgesIntersection,
	intersectConvexFaceLine: intersectConvexFaceLine
});

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * Fragment converts a graph into a planar graph. it flattens all the
 * coordinates onto the 2D plane.
 *
 * it modifies edges and vertices. splitting overlapping edges
 * at their intersections, merging vertices that lie too near to one another.
 * # of edges may increase. # of vertices may decrease. (is that for sure?)
 *
 * This function requires an epsilon (1e-6), for example a busy
 * edge crossing should be able to resolve to one point
 *
 * 1. merge vertices that are within the epsilon.
 *
 * 2. gather all intersections, for every line.
 *    for example, the first line in the list gets compared to other lines
 *    resulting in a list of intersection points,
 *
 * 3. replace the edge with a new, rebuilt, sequence of edges, with
 *    new vertices.
 */
const fragment_graph = (graph, epsilon = math.core.EPSILON) => {
	const edges_coords = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
	// when we rebuild an edge we need the intersection points sorted
	// so we can walk down it and rebuild one by one. sort along vector
	const edges_vector = edges_coords.map(e => math.core.subtract(e[1], e[0]));
	const edges_origin = edges_coords.map(e => e[0]);
	// for each edge, get all the intersection points
	// this array will match edges_, each an array containing intersection
	// points (an [x,y] array), with an important detail, because each edge
	// intersects with another edge, this [x,y] point is a shallow pointer
	// to the same one in the other edge's intersection array.
	const edges_intersections = makeEdgesEdgesIntersection({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_vector,
		edges_origin,
	}, 1e-6);
	// check the new edges' vertices against every edge, in case
	// one of the endpoints lies along an edge.
	const edges_collinear_vertices = getVerticesEdgesOverlap({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_coords,
	}, epsilon);
	// exit early
	if (edges_intersections.flat().filter(a => a !== undefined).length === 0
		&& edges_collinear_vertices.flat().filter(a => a !== undefined).length === 0) {
		return;
	}
	// remember, edges_intersections contains intersections [x,y] points
	// each one appears twice (both edges that intersect) and is the same
	// object, shallow pointer.
	//
	// iterate over this list and move each vertex into new_vertices_coords.
	// in their place put the index of this new vertex in the new array.
	// when we get to the second appearance of the same point, it will have
	// been replaced with the index, so we can skip it. (check length of
	// item, 2=point, 1=index)
	const counts = { vertices: graph.vertices_coords.length };
	// add new vertices (intersection points) to the graph
	edges_intersections
		.forEach(edge => edge
			.filter(a => a !== undefined)
			.filter(a => a.length === 2)
			.forEach((intersect) => {
				const newIndex = graph.vertices_coords.length;
				graph.vertices_coords.push([...intersect]);
				intersect.splice(0, 2);
				intersect.push(newIndex);
			}));
	// replace arrays with indices
	edges_intersections.forEach((edge, i) => {
		edge.forEach((intersect, j) => {
			if (intersect) {
				edges_intersections[i][j] = intersect[0];
			}
		});
	});

	const edges_intersections_flat = edges_intersections
		.map(arr => arr.filter(a => a !== undefined));
	// add lists of vertices into each element in edges_vertices
	// edges verts now contains an illegal arrangement of more than 2 verts
	// to be resolved below
	graph.edges_vertices.forEach((verts, i) => verts
		.push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
	// .push(...edges_intersections_flat[i]));

	graph.edges_vertices.forEach((edge, i) => {
		graph.edges_vertices[i] = sortVerticesAlongVector({
			vertices_coords: graph.vertices_coords,
		}, edge, edges_vector[i]);
	});

	// edge_map is length edges_vertices in the new, fragmented graph.
	// the value at each index is the edge that this edge was formed from.
	const edge_map = graph.edges_vertices
		.map((edge, i) => Array(edge.length - 1).fill(i))
		.flat();

	graph.edges_vertices = graph.edges_vertices
		.map(edge => Array.from(Array(edge.length - 1))
			.map((_, i, arr) => [edge[i], edge[i + 1]])) // todo, is this supposed to be % arr.length
		.flat();
	// copy over edge metadata if it exists
	// make foldAngles and assignments match if foldAngle is longer
	if (graph.edges_assignment && graph.edges_foldAngle
		&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	// copy over assignments and fold angle and base fold angle off assigments if it's shorter
	if (graph.edges_assignment) {
		graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = edge_map
			.map(i => graph.edges_foldAngle[i])
			.map((a, i) => (a === undefined
				? edgeAssignmentToFoldAngle(graph.edges_assignment[i])
				: a));
	}
	return {
		vertices: {
			new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
				.map((_, i) => counts.vertices + i),
		},
		edges: {
			backmap: edge_map
		},
	};
	// return graph;
};

const fragment_keep_keys = [
	_vertices_coords,
	_edges_vertices,
	_edges_assignment,
	_edges_foldAngle,
];
/**
 * @description Planarize a graph into the 2D XY plane, split edges, rebuild faces.
 * The graph provided as a method argument will be modified in place.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to the graph
 * @linkcode Origami ./src/graph/fragment.js 174
 */
const fragment = (graph, epsilon = math.core.EPSILON) => {
	// project all vertices onto the XY plane
	graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));

	[_vertices, _edges, _faces]
		.map(key => getGraphKeysWithPrefix(graph, key))
		.flat()
		.filter(key => !(fragment_keep_keys.includes(key)))
		.forEach(key => delete graph[key]);

	const change = {
		vertices: {},
		edges: {},
	};
	let i;
	for (i = 0; i < 20; i += 1) {
		const resVert = removeDuplicateVertices(graph, epsilon / 2);
		const resEdgeDup = removeDuplicateEdges(graph);
		// console.log("before", JSON.parse(JSON.stringify(graph)));
		const resEdgeCirc = removeCircularEdges(graph);
		// console.log("circular", resEdgeCirc);
		const resFrag = fragment_graph(graph, epsilon);
		if (resFrag === undefined) {
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: mergeNextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? mergeNextmaps(resEdgeDup.map, resEdgeCirc.map)
				: mergeNextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
			break;
		}
		const invert_frag = invertMap(resFrag.edges.backmap);
		const edgemap = mergeNextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
		change.vertices.map = (change.vertices.map === undefined
			? resVert.map
			: mergeNextmaps(change.vertices.map, resVert.map));
		change.edges.map = (change.edges.map === undefined
			? edgemap
			: mergeNextmaps(change.edges.map, edgemap));
	}

	if (i === 20) {
		console.warn("fragment reached max iterations");
	}
	return change;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description For every vertex return a true if the vertex lies along a boundary
 * edge, as defined by edges_assignment. If edges_assignment is not present,
 * or does not contain boundary edges, this will return an empty array.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} unsorted list of vertex indices which lie along the boundary.
 * @linkcode Origami ./src/graph/boundary.js 16
 */
const getBoundaryVertices = ({ edges_vertices, edges_assignment }) => (
	uniqueIntegers(edges_vertices
		.filter((_, i) => edges_assignment[i] === "B" || edges_assignment[i] === "b")
		.flat()));
// export const getBoundaryVertices = ({ edges_vertices, edges_assignment }) => {
// 	// assign vertices to a hash table to make sure they are unique.
// 	const vertices = {};
// 	edges_vertices.forEach((v, i) => {
// 		const boundary = edges_assignment[i] === "B" || edges_assignment[i] === "b";
// 		if (!boundary) { return; }
// 		vertices[v[0]] = true;
// 		vertices[v[1]] = true;
// 	});
// 	return Object.keys(vertices).map(str => parseInt(str));
// };

const emptyBoundaryObject = () => ({ vertices: [], edges: [] });
/**
 * @description Get the boundary of a FOLD graph in terms of both vertices and edges.
 * This works by walking the boundary edges as defined by edges_assignment ("B" or "b").
 * If edges_assignment doesn't exist, or contains errors, this will not work, and you
 * will need the more robust algorithm getPlanarBoundary() which walks the graph, but
 * only works in 2D.
 * @param {FOLD} graph a FOLD graph
 * @returns {object} with "vertices" and "edges" with arrays of indices.
 * @linkcode Origami ./src/graph/boundary.js 43
 */
const getBoundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (edges_assignment === undefined) { return emptyBoundaryObject(); }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges_vertices_b = edges_assignment
		.map(a => a === "B" || a === "b");
	const edge_walk = [];
	const vertex_walk = [];
	let edgeIndex = -1;
	for (let i = 0; i < edges_vertices_b.length; i += 1) {
		if (edges_vertices_b[i]) { edgeIndex = i; break; }
	}
	if (edgeIndex === -1) { return emptyBoundaryObject(); }
	edges_vertices_b[edgeIndex] = false;
	edge_walk.push(edgeIndex);
	vertex_walk.push(edges_vertices[edgeIndex][0]);
	let nextVertex = edges_vertices[edgeIndex][1];
	while (vertex_walk[0] !== nextVertex) {
		vertex_walk.push(nextVertex);
		edgeIndex = vertices_edges[nextVertex]
			.filter(v => edges_vertices_b[v])
			.shift();
		if (edgeIndex === undefined) { return emptyBoundaryObject(); }
		if (edges_vertices[edgeIndex][0] === nextVertex) {
			[, nextVertex] = edges_vertices[edgeIndex];
		} else {
			[nextVertex] = edges_vertices[edgeIndex];
		}
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
	}
	return {
		vertices: vertex_walk,
		edges: edge_walk,
	};
};
/**
 * @description Get the boundary as two arrays of vertices and edges
 * by walking the boundary edges in 2D and uncovering the concave hull.
 * Does not consult edges_assignment, but does require vertices_coords.
 * For repairing crease patterns, this will uncover boundary edges_assignments.
 * @param {FOLD} graph a FOLD graph
 * (vertices_coords, vertices_vertices, edges_vertices)
 * (vertices edges only required in case vertices_vertices needs to be built)
 * @returns {object} "vertices" and "edges" with arrays of indices.
 * @usage call populate() before to ensure this works.
 * @linkcode Origami ./src/graph/boundary.js 92
 */
const getPlanarBoundary = ({
	vertices_coords, vertices_edges, vertices_vertices, edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const edge_walk = [];
	const vertex_walk = [];
	const walk = {
		vertices: vertex_walk,
		edges: edge_walk,
	};

	let largestX = -Infinity;
	let first_vertex_i = -1;
	vertices_coords.forEach((v, i) => {
		if (v[0] > largestX) {
			largestX = v[0];
			first_vertex_i = i;
		}
	});

	if (first_vertex_i === -1) { return walk; }
	vertex_walk.push(first_vertex_i);
	const first_vc = vertices_coords[first_vertex_i];
	const first_neighbors = vertices_vertices[first_vertex_i];
	// sort adjacent vertices by next most clockwise vertex;
	const counter_clock_first_i = first_neighbors
		.map(i => vertices_coords[i])
		.map(vc => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle < 0 ? angle + Math.PI * 2 : angle))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.shift()
		.i;
	const second_vertex_i = first_neighbors[counter_clock_first_i];
	// find this edge that connects these 2 vertices
	const first_edge_lookup = first_vertex_i < second_vertex_i
		? `${first_vertex_i} ${second_vertex_i}`
		: `${second_vertex_i} ${first_vertex_i}`;
	const first_edge = edge_map[first_edge_lookup];
	// vertex_walk.push(second_vertex_i);
	edge_walk.push(first_edge);

	// now we begin the loop

	// walking the graph, we look at 3 vertices at a time. in sequence:
	// prev_vertex, this_vertex, next_vertex
	let prev_vertex_i = first_vertex_i;
	let this_vertex_i = second_vertex_i;
	let protection = 0;
	while (protection < 10000) {
		const next_neighbors = vertices_vertices[this_vertex_i];
		const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
		const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
		const next_vertex_i = next_neighbors[next_neighbor_i];
		const next_edge_lookup = this_vertex_i < next_vertex_i
			? `${this_vertex_i} ${next_vertex_i}`
			: `${next_vertex_i} ${this_vertex_i}`;
		const next_edge_i = edge_map[next_edge_lookup];
		// exit loop condition
		if (next_edge_i === edge_walk[0]) {
			return walk;
		}
		vertex_walk.push(this_vertex_i);
		edge_walk.push(next_edge_i);
		prev_vertex_i = this_vertex_i;
		this_vertex_i = next_vertex_i;
		protection += 1;
	}
	console.warn("calculate boundary potentially entered infinite loop");
	return walk;
};

var boundary = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getBoundaryVertices: getBoundaryVertices,
	getBoundary: getBoundary,
	getPlanarBoundary: getPlanarBoundary
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @name transform
 * @memberof graph
 * @description apply an affine transform to a graph; this includes
 * modifying the position of any key ending with "_coords" and multiplying
 * any matrix in keys that end with "_matrix".
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} matrix a 3x4 matrix as a 12 number array
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 15
 */
const apply_matrix_to_graph = function (graph, matrix) {
	// apply to anything with a coordinate value
	filterKeysWithSuffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => math.core.resize(3, v))
			.map(v => math.core.multiplyMatrix3Vector3(matrix, v));
	});
	// update all matrix types
	// todo, are these being multiplied in the right order?
	filterKeysWithSuffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => math.core.multiplyMatrices3(m, matrix));
	});
	return graph;
};
/**
 * @name scale
 * @memberof graph
 * @description apply a uniform affine scale to a graph.
 * @param {FOLD} graph a FOLD graph
 * @param {number} scale the scale amount
 * @param {number[]} optional. an array or series of numbers, the center of scale.
 * @returns {FOLD} the same input graph, modified.
 * @linkcode Origami ./src/graph/affine.js 40
 */
const transform_scale = (graph, scale, ...args) => {
	const vector = math.core.getVector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.makeMatrix3Scale(scale, vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name translate
 * @memberof graph
 * @description apply a translation to a graph.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} optional. an array or series of numbers, the translation vector
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 55
 */
const transform_translate = (graph, ...args) => {
	const vector = math.core.getVector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.makeMatrix3Translate(...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name rotateZ
 * @memberof graph
 * @description apply a rotation to a graph around the +Z axis.
 * @param {FOLD} graph a FOLD graph
 * @param {number} the rotation amount in radians
 * @param {number[]} optional. an array or series of numbers, the center of rotation
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 71
 */
const transform_rotateZ = (graph, angle, ...args) => {
	const vector = math.core.getVector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.makeMatrix3RotateZ(angle, ...vector3);
	return apply_matrix_to_graph(graph, matrix);
};

// makeMatrix3Rotate
// makeMatrix3RotateX
// makeMatrix3RotateY
// makeMatrix3ReflectZ

var transform = {
	scale: transform_scale,
	translate: transform_translate,
	rotateZ: transform_rotateZ,
	transform: apply_matrix_to_graph,
};

/**
 * Rabbit Ear (c) Kraft
 */

// const getFaceFaceSharedVertices = (graph, face0, face1) => graph
//   .faces_vertices[face0]
//   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

/**
 * @description given two faces, get the vertices which are shared between the two faces.
 * @param {number[]} face_a_vertices the faces_vertices entry for face A
 * @param {number[]} face_b_vertices the faces_vertices entry for face B
 * @returns {number[]} indices of vertices that are shared between faces maintaining
 * the vertices in the same order as the winding order of face A.
 * @linkcode Origami ./src/graph/faceSpanningTree.js 16
 */
// todo: this was throwing errors in the case of weird nonconvex faces with
// single edges poking in. the "already_added" was added to fix this.
// tbd if this fix covers all cases of weird polygons in a planar graph.
const getFaceFaceSharedVertices = (face_a_vertices, face_b_vertices) => {
	// build a quick lookup table: T/F is a vertex in face B
	const hash = {};
	face_b_vertices.forEach((v) => { hash[v] = true; });
	// make a copy of face A containing T/F, if the vertex is shared in face B
	const match = face_a_vertices.map(v => !!hash[v]);
	// filter and keep only the shared vertices.
	const shared_vertices = [];
	const notShared = match.indexOf(false); // -1 if no match, code below still works
	// before we filter the array we just need to cover the special case that
	// the shared edge starts near the end of the array and wraps around
	const already_added = {};
	for (let i = notShared + 1; i < match.length; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	for (let i = 0; i < notShared; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	return shared_vertices;
};

// each element will have
// except for the first level. the root level has no reference to the
// parent face, or the edge_vertices shared between them
// root_face will become the root node
/**
 * @description Make a minimum spanning tree of a graph that edge-adjacent faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the face index to be the root node
 * @returns {object[][]} a tree arranged as an array containin arrays of nodes. each inner
 * array contains all nodes at that depth (0, 1, 2...) each node contains:
 * "face" {number} "parent" {number} "edge_vertices" {number[]}
 * @linkcode Origami ./src/graph/faceSpanningTree.js 59
 */
const makeFaceSpanningTree = ({ faces_vertices, faces_faces }, root_face = 0) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	if (faces_faces.length === 0) { return []; }

	const tree = [[{ face: root_face }]];
	const visited_faces = {};
	visited_faces[root_face] = true;
	do {
		// iterate the previous level's faces and gather their adjacent faces
		const next_level_with_duplicates = tree[tree.length - 1]
			.map(current => faces_faces[current.face]
				.map(face => ({ face, parent: current.face })))
			.reduce((a, b) => a.concat(b), []);
		// at this point its likely many faces are duplicated either because:
		// 1. they were already visited in previous levels
		// 2. the same face was adjacent to a few different faces from this step
		const dup_indices = {};
		next_level_with_duplicates.forEach((el, i) => {
			if (visited_faces[el.face]) { dup_indices[i] = true; }
			visited_faces[el.face] = true;
		});
		// unqiue set of next level faces
		const next_level = next_level_with_duplicates
			.filter((_, i) => !dup_indices[i]);
		// set next_level's edge_vertices
		// we cannot depend on faces being convex and only sharing 2 vertices in common.
		// if there are more than 2 edges, let's hope they are collinear.
		// either way, grab the first 2 vertices if there are more.
		next_level
			.map(el => getFaceFaceSharedVertices(
				faces_vertices[el.face],
				faces_vertices[el.parent],
			)).forEach((ev, i) => {
				const edge_vertices = ev.slice(0, 2);
				// const edgeKey = edge_vertices.join(" ");
				next_level[i].edge_vertices = edge_vertices;
				// next_level[i].edge = edge_map[edgeKey];
			});
		// append this next_level to the master tree
		tree[tree.length] = next_level;
	} while (tree[tree.length - 1].length > 0);
	if (tree.length > 0 && tree[tree.length - 1].length === 0) {
		tree.pop();
	}
	return tree;
};

var faceSpanningTree = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getFaceFaceSharedVertices: getFaceFaceSharedVertices,
	makeFaceSpanningTree: makeFaceSpanningTree
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Given a FOLD object and a set of 2x3 matrices, one per face,
 * "fold" the vertices by finding one matrix per vertex and multiplying them.
 * @param {object} FOLD graph with vertices_coords, faces_vertices, and
 * if vertices_faces does not exist it will be built.
 * @param {number[][]} an array of 2x3 matrices. one per face.
 * @returns {number[][]} a new set of vertices_coords, transformed.
 * @linkcode Origami ./src/graph/facesMatrix.js 21
 */
const multiplyVerticesFacesMatrix2 = ({
	vertices_coords, vertices_faces, faces_vertices,
}, faces_matrix) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? math.core.identity2x3
			: faces_matrix[face]));
	return vertices_coords
		.map((coord, i) => math.core.multiplyMatrix2Vector2(vertices_matrix[i], coord));
};
const unassigned_angle = { U: true, u: true };
/**
 * @description Create a transformation matrix for every face by virtually folding
 * the graph along all of the creases (this works in 3D too). This traverses
 * a face-adjacency tree (edge-adjacent faces) and recursively applies the
 * affine transform that represents a fold across the edge between the faces.
 * "flat" creases are ignored.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} for every face, a 3x4 matrix (an array of 12 numbers).
 * @linkcode Origami ./src/graph/facesMatrix.js 49
 */
// { vertices_coords, edges_vertices, edges_foldAngle, faces_vertices, faces_faces}
const makeFacesMatrix = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_assignment && edges_foldAngle) {
		edges_assignment = makeEdgesAssignment({ edges_foldAngle });
	}
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => math.core.identity3x4);
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach(level => level
			.forEach((entry) => {
				const coords = entry.edge_vertices.map(v => vertices_coords[v]);
				const edgeKey = entry.edge_vertices.join(" ");
				const edge = edge_map[edgeKey];
				// if the assignment is unassigned, assume it is a flat fold.
				const foldAngle = unassigned_angle[edges_assignment[edge]]
					? Math.PI
					: edges_foldAngle[edge] * Math.PI / 180;
				const local_matrix = math.core.makeMatrix3Rotate(
					foldAngle, // rotation angle
					math.core.subtract(...math.core.resizeUp(coords[1], coords[0])), // line-vector
					coords[0], // line-origin
				);
				faces_matrix[entry.face] = math.core
					.multiplyMatrices3(faces_matrix[entry.parent], local_matrix);
				// to build the inverse matrix, switch these two parameters
				// .multiplyMatrices3(local_matrix, faces_matrix[entry.parent]);
			}));
	return faces_matrix;
};
const assignment_is_folded = {
	M: true, m: true, V: true, v: true, U: true, u: true, F: false, f: false, B: false, b: false,
};
/**
 * @description For every edge, give us a boolean:
 * - "true" if the edge is folded, valley or mountain, or unassigned.
 * - "false" if the edge is not folded, flat or boundary.
 * "unassigned" is considered folded so that an unsolved crease pattern
 * can be fed into here and we still compute the folded state.
 * However, if there is no edges_assignments, and we have to use edges_foldAngle,
 * the "unassigned" trick will no longer work, only +/- non zero numbers get
 * counted as folded edges (true).
 * For this reason, treating "unassigned" as a folded edge, this method's
 * functionality is better considered to be specific to makeFacesMatrix2,
 * instead of a generalized method.
 * @param {FOLD} graph a FOLD graph
 * @returns {boolean[]} for every edge, is it folded? or has the potential to be folded?
 * "unassigned"=yes
 * @linkcode Origami ./src/graph/facesMatrix.js 109
 */
const makeEdgesIsFolded = ({ edges_vertices, edges_foldAngle, edges_assignment }) => {
	if (edges_assignment === undefined) {
		return edges_foldAngle === undefined
			? edges_vertices.map(() => true)
			: edges_foldAngle.map(angle => angle < -math.core.EPSILON || angle > math.core.EPSILON);
	}
	return edges_assignment.map(a => assignment_is_folded[a]);
};
/**
 * @description This ignores any 3D data, and treats all creases as flat-folded.
 * This will generate a 2D matrix for every face by virtually folding the graph
 * at every edge according to the assignment or foldAngle.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} for every face, a 2x3 matrix (an array of 6 numbers).
 * @linkcode Origami ./src/graph/facesMatrix.js 126
 */
const makeFacesMatrix2 = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => math.core.identity2x3);
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach(level => level
			.forEach((entry) => {
				const coords = entry.edge_vertices.map(v => vertices_coords[v]);
				const edgeKey = entry.edge_vertices.join(" ");
				const edge = edge_map[edgeKey];
				const reflect_vector = math.core.subtract2(coords[1], coords[0]);
				const reflect_origin = coords[0];
				const local_matrix = edges_is_folded[edge]
					? math.core.makeMatrix2Reflect(reflect_vector, reflect_origin)
					: math.core.identity2x3;
				faces_matrix[entry.face] = math.core
					.multiplyMatrices2(faces_matrix[entry.parent], local_matrix);
				// to build the inverse matrix, switch these two parameters
				// .multiplyMatrices2(local_matrix, faces_matrix[entry.parent]);
			}));
	return faces_matrix;
};

var facesMatrix = /*#__PURE__*/Object.freeze({
	__proto__: null,
	multiplyVerticesFacesMatrix2: multiplyVerticesFacesMatrix2,
	makeFacesMatrix: makeFacesMatrix,
	makeEdgesIsFolded: makeEdgesIsFolded,
	makeFacesMatrix2: makeFacesMatrix2
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Fold a graph along its edges and return the position
 * of the folded vertices. This method works in both 2D and 3D
 * unassigned edges are treated as flat fold (mountain/valley 180deg)
 * as a way of (assuming the user is giving a flat folded origami), help
 * solve things about an origami that is currently being figured out.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} a new set of `vertices_coords` with the new positions.
 * @linkcode Origami ./src/graph/verticesCoordsFolded.js 23
 */
const makeVerticesCoordsFolded = ({
	vertices_coords, vertices_faces, edges_vertices, edges_foldAngle,
	edges_assignment, faces_vertices, faces_faces, faces_matrix,
}, root_face) => {
	faces_matrix = makeFacesMatrix({
		vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
	}, root_face);
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	// assign one matrix to every vertex from faces, identity matrix if none exist
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null) // must filter "undefined" and "null"
			.shift()) // get any face from the list
		.map(face => (face === undefined
			? math.core.identity3x4
			: faces_matrix[face]));
	return vertices_coords
		.map(coord => math.core.resize(3, coord))
		.map((coord, i) => math.core.multiplyMatrix3Vector3(vertices_matrix[i], coord));
};
/**
 * @description Fold a graph along its edges and return the position of the folded
 * vertices. this method works for 2D only (no z value).
 * if a edges_assignment is "U", assumed to be folded ("V" or "M").
 * Finally, if no edge foldAngle or assignments exist, this method will
 * assume all edges are flat-folded (except boundary) and will fold everything.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the index of the face that will remain in place
 * @returns {number[][]} a new set of `vertices_coords` with the new positions.
 * @linkcode Origami ./src/graph/verticesCoordsFolded.js 56
 */
const makeVerticesCoordsFlatFolded = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const vertices_coords_folded = [];
	faces_vertices[root_face]
		.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
	const faces_flipped = [];
	faces_flipped[root_face] = false;
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach(level => level
			.forEach(entry => {
				// coordinates and vectors of the reflecting edge
				const edge_key = entry.edge_vertices.join(" ");
				const edge = edge_map[edge_key];
				// build a basis axis using the folding edge, normalized.
				const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
				if (coords[0] === undefined || coords[1] === undefined) { return; }
				const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
				// the basis axis origin, x-basis axis (vector) and y-basis (normal)
				const origin_cp = coords_cp[0];
				const vector_cp = math.core.normalize2(math.core.subtract2(coords_cp[1], coords_cp[0]));
				const normal_cp = math.core.rotate90(vector_cp);
				// if we are crossing a flipping edge (m/v), set this face to be
				// flipped opposite of the parent face. otherwise keep it the same.
				faces_flipped[entry.face] = edges_is_folded[edge]
					? !faces_flipped[entry.parent]
					: faces_flipped[entry.parent];
				const vector_folded = math.core.normalize2(math.core.subtract2(coords[1], coords[0]));
				const origin_folded = coords[0];
				const normal_folded = faces_flipped[entry.face]
					? math.core.rotate270(vector_folded)
					: math.core.rotate90(vector_folded);
				// remaining_faces_vertices
				faces_vertices[entry.face]
					.filter(v => vertices_coords_folded[v] === undefined)
					.forEach(v => {
						const to_point = math.core.subtract2(vertices_coords[v], origin_cp);
						const project_norm = math.core.dot(to_point, normal_cp);
						const project_line = math.core.dot(to_point, vector_cp);
						const walk_up = math.core.scale2(vector_folded, project_line);
						const walk_perp = math.core.scale2(normal_folded, project_norm);
						const folded_coords = math.core.add2(math.core.add2(origin_folded, walk_up), walk_perp);
						vertices_coords_folded[v] = folded_coords;
					});
			}));
	return vertices_coords_folded;
};

var verticesCoordsFolded = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeVerticesCoordsFolded: makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded: makeVerticesCoordsFlatFolded
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description For every face, return a boolean indicating if the face has
 * been flipped over or not (false=flipped), by using the faces_matrix and
 * checking the determinant.
 * @param {number[][]} faces_matrix for every face, a 3x4 transform matrix
 * @returns {boolean[]} true if a face is counter-clockwise.
 * @linkcode Origami ./src/graph/facesWinding.js 10
 */
const makeFacesWindingFromMatrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
/**
 * @description For every face, return a boolean indicating if the face has
 * been flipped over or not (false=flipped), by using a faces_matrix containing
 * 2D matrices.
 * @param {number[][]} faces_matrix for every face, a 2x3 transform matrix
 * @returns {boolean[]} true if a face is counter-clockwise.
 * @linkcode Origami ./src/graph/facesWinding.js 21
 */
const makeFacesWindingFromMatrix2 = faces_matrix => faces_matrix
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);
/**
 * @description For every face, return a boolean if the face's vertices are
 * in counter-clockwise winding. For origami models, this translates to
 * true meaning the face is upright, false meaning the face is flipped over.
 * @param {FOLD} graph a FOLD graph
 * @returns {boolean[]} true if a face is counter-clockwise.
 * @attribution cool trick from https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
 * @linkcode Origami ./src/graph/facesWinding.js 33
 */
const makeFacesWinding = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
		.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]))
		.reduce((a, b) => a + b, 0))
	.map(face => face < 0);

var facesWinding = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeFacesWindingFromMatrix: makeFacesWindingFromMatrix,
	makeFacesWindingFromMatrix2: makeFacesWindingFromMatrix2,
	makeFacesWinding: makeFacesWinding
});

/**
 * Rabbit Ear (c) Kraft
 */

// todo, expand this to include edges, edges_faces, etc..
/**
 * @description Create a modified graph which contains vertices_coords and faces_vertices
 * but that for every face, vertices_coords has been duplicated so that faces
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 15
 */
const explodeFaces = (graph) => {
	const vertices_coords = graph.faces_vertices
		.map(face => face.map(v => graph.vertices_coords[v]))
		.reduce((a, b) => a.concat(b), []);
	let i = 0;
	const faces_vertices = graph.faces_vertices
		.map(face => face.map(v => i++));
	// deep copy vertices coords
	return {
		vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
		faces_vertices,
	};
};
/**
 * @description Create a modified graph which contains vertices_coords and faces_vertices
 * but that for every face, vertices_coords has been duplicated so that faces
 * do not share vertices, and finally, a scaling transform has been applied to every
 * face creating a gap between all faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [shrink=0.333] a scale factor for a shrinking transform
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 38
 */
const explodeShrinkFaces = ({ vertices_coords, faces_vertices }, shrink = 0.333) => {
	const graph = explodeFaces({ vertices_coords, faces_vertices });
	const faces_winding = makeFacesWinding(graph);
	const faces_vectors = graph.faces_vertices
		.map(vertices => vertices.map(v => graph.vertices_coords[v]))
		.map(points => points.map((p, i, arr) => math.core.subtract2(p, arr[(i+1) % arr.length])));
	const faces_centers = makeFacesCenterQuick({ vertices_coords, faces_vertices });
	const faces_point_distances = faces_vertices
		.map(vertices => vertices.map(v => vertices_coords[v]))
		.map((points, f) => points
			.map(point => math.core.distance2(point, faces_centers[f])));
	console.log("faces_point_distances", faces_point_distances);
	const faces_bisectors = faces_vectors
		.map((vectors, f) => vectors
			.map((vector, i, arr) => [
				vector,
				math.core.flip(arr[(i - 1 + arr.length) % arr.length])
			]).map(pair => faces_winding[f]
				? math.core.counterClockwiseBisect2(...pair)
				: math.core.clockwiseBisect2(...pair)))
		.map((vectors, f) => vectors
			.map((vector, i) => math.core.scale(vector, faces_point_distances[f][i])));
	graph.faces_vertices
		.forEach((vertices, f) => vertices
			.forEach((v, i) => {
				graph.vertices_coords[v] = math.core.add2(
					graph.vertices_coords[v],
					math.core.scale2(faces_bisectors[f][i], -shrink),
				);
			}));
	return graph;
};

var explodeFacesMethods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	explodeFaces: explodeFaces,
	explodeShrinkFaces: explodeShrinkFaces
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Iterate through all vertices in a graph and find the one nearest to a
 * provided point. This is the only of the "nearest" graph operations that works in 3D.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest vertex
 * @returns {number} the index of the nearest vertex
 * @todo improve with space partitioning
 * @linkcode Origami ./src/graph/nearest.js 13
 */
const nearestVertex = ({ vertices_coords }, point) => {
	if (!vertices_coords) { return undefined; }
	// resize our point to be the same dimension as the first vertex
	const p = math.core.resize(vertices_coords[0].length, point);
	// sort by distance, hold onto the original index in vertices_coords
	const nearest = vertices_coords
		.map((v, i) => ({ d: math.core.distance(p, v), i }))
		.sort((a, b) => a.d - b.d)
		.shift();
	// return index, not vertex
	return nearest ? nearest.i : undefined;
};
/**
 * @description Iterate through all edges in a graph and find the one nearest to a provided point.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest edge
 * @returns {number|undefined} the index of the nearest edge, or undefined
 * if there are no vertices_coords or edges_vertices
 * @linkcode Origami ./src/graph/nearest.js 33
 */
const nearestEdge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => math.core.nearestPointOnLine(
			math.core.subtract(e[1], e[0]),
			e[0],
			point,
			math.core.segmentLimiter,
		));
	return math.core.smallestComparisonSearch(point, nearest_points, math.core.distance);
};
/**
 * @description Iterate through all faces in a graph and find one that encloses a point.
 * This method assumes the graph is in 2D, it ignores any z components.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the enclosing face
 * @returns {number|undefined} the index of the face, or undefined if no face encloses a point
 * @linkcode Origami ./src/graph/nearest.js 53
 */
const faceContainingPoint = ({ vertices_coords, faces_vertices }, point) => {
	if (!vertices_coords || !faces_vertices) { return undefined; }
	const face = faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => math.core.overlapConvexPolygonPoint(f.face, point))
		.shift();
	return (face === undefined ? undefined : face.i);
};
/**
 * @description Iterate through all faces in a graph and find one nearest to a point.
 * This method assumes the graph is in 2D, it ignores any z components.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest face
 * @returns {number|undefined} the index of the face, or undefined if edges_faces is not defined.
 * @todo make this work if edges_faces is not defined (not hard)
 * @linkcode Origami ./src/graph/nearest.js 70
 */
const nearestFace = (graph, point) => {
	const face = faceContainingPoint(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearestEdge(graph, point);
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = makeFacesCenterQuick({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f]),
			});
			const distances = faces_center
				.map(center => math.core.distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i += 1) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
};

var nearest = /*#__PURE__*/Object.freeze({
	__proto__: null,
	nearestVertex: nearestVertex,
	nearestEdge: nearestEdge,
	faceContainingPoint: faceContainingPoint,
	nearestFace: nearestFace
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description deep copy an object, like JSON.parse(JSON.stringify())
 *
 * this clone function is decent, except for:
 *  - it doesn't detect recursive cycles
 *  - weird behavior around Proxys
 * @author https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
 * @param {object} o
 * @returns {object} a deep copy of the input
 * @linkcode Origami ./src/general/clone.js 14
 */
const clone = function (o) {
	let newO;
	let i;
	if (typeof o !== _object) {
		return o;
	}
	if (!o) {
		return o;
	}
	if (Object.prototype.toString.apply(o) === "[object Array]") {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clone(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			// this is where a self-similar reference causes an infinite loop
			newO[i] = clone(o[i]);
		}
	}
	return newO;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description add vertices to a graph by adding their vertices_coords only. This
 * will also compare against every existing vertex, only adding non-duplicate
 * vertices, as determined by an epsilon.
 * @param {FOLD} graph a FOLD graph, modified in place.
 * @param {number[][]} vertices_coords array of points to be added to the graph
 * @param {number} [epsilon=1e-6] optional epsilon to merge similar vertices
 * @returns {number[]} index of vertex in new vertices_coords array.
 * the size of this array matches array size of source vertices.
 * duplicate (non-added) vertices returns their pre-existing counterpart's index.
 * @linkcode Origami ./src/graph/add/addVertices.js 15
 */
const addVertices = (graph, vertices_coords, epsilon = math.core.EPSILON) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }
	// the user messed up the input and only provided one vertex
	// it's easy to fix for them
	if (typeof vertices_coords[0] === "number") { vertices_coords = [vertices_coords]; }
	// make an array that matches the new vertices_coords where each entry is either
	// - undefined, if the vertex is unique
	// - number, index of duplicate vertex in source graph, if duplicate exists
	const vertices_equivalent_vertices = vertices_coords
		.map(vertex => graph.vertices_coords
			.map(v => math.core.distance(v, vertex) < epsilon)
			.map((on_vertex, i) => (on_vertex ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	// to be used in the return data array
	let index = graph.vertices_coords.length;
	// add the unique vertices to the destination graph
	const unique_vertices = vertices_coords
		.filter((vert, i) => vertices_equivalent_vertices[i] === undefined);
	graph.vertices_coords.push(...unique_vertices);
	// return the indices of the added vertices in the destination graph
	return vertices_equivalent_vertices
		.map(el => (el === undefined ? index++ : el));
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Given an edge, uncover the adjacent faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} edge index of the edge in the graph
 * {number[]} indices of the two vertices making up the edge
 * @returns {number[]} array of 0, 1, or 2 numbers, the edge's adjacent faces
 * @linkcode Origami ./src/graph/find.js 10
 */
const findAdjacentFacesToEdge = ({
	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
}, edge) => {
	// easiest case, if edges_faces already exists.
	if (edges_faces && edges_faces[edge]) {
		return edges_faces[edge];
	}
	// if that doesn't exist, uncover the data by looking at our incident
	// vertices' faces, compare every index against every index, looking
	// for 2 indices that are present in both arrays. there should be 2.
	const vertices = edges_vertices[edge];
	if (vertices_faces !== undefined) {
		const faces = [];
		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
					// todo: now allowing undefined to be in vertices_faces,
					// but, do we want to exclude them from the result?
					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
					faces.push(vertices_faces[vertices[0]][i]);
				}
			}
		}
		return faces;
	}
	if (faces_edges) {
		const faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("todo: findAdjacentFacesToEdge");
		// let faces = [];
		// for (let i = 0; i < faces_vertices.length; i += 1) {
		//   for (let v = 0; v < faces_vertices[i].length; v += 1) {
		//   }
		// }
	}
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this does not modify the graph. it builds 2 objects with:
 * { edges_vertices, edges_assignment, edges_foldAngle }
 * including external to the spec: { edges_length, edges_vector }
 * this does not rebuild edges_edges.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} edge_index the index of the edge that will be split by the new vertex
 * @param {number} new_vertex the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const splitEdgeIntoTwo = (graph, edge_index, new_vertex) => {
	const edge_vertices = graph.edges_vertices[edge_index];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], new_vertex] },
		{ edges_vertices: [new_vertex, edge_vertices[1]] },
	];
	new_edges.forEach(edge => [_edges_assignment, _edges_foldAngle]
		.filter(key => graph[key] && graph[key][edge_index] !== undefined)
		.forEach(key => { edge[key] = graph[key][edge_index]; }));
	// these are outside the spec values that are easy enough to calculate.
	// only update them if they exist!
	if (graph.vertices_coords && (graph.edges_length || graph.edges_vector)) {
		const coords = new_edges
			.map(edge => edge.edges_vertices
				.map(v => graph.vertices_coords[v]));
		if (graph.edges_vector) {
			new_edges.forEach((edge, i) => {
				edge.edges_vector = math.core.subtract(coords[i][1], coords[i][0]);
			});
		}
		if (graph.edges_length) {
			new_edges.forEach((edge, i) => {
				edge.edges_length = math.core.distance2(...coords[i]);
			});
		}
	}
	return new_edges;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update new vertex's vertices_vertices, as well as the split edge's
 * endpoint's vertices_vertices to include the new vertex in place of the
 * old endpoints, preserving all other vertices_vertices of the endpoints.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} vertex index of new vertex
 * @param {number[]} incident_vertices vertices that make up the split edge.
 * the new vertex lies between.
 */
const update_vertices_vertices$2 = ({ vertices_vertices }, vertex, incident_vertices) => {
	if (!vertices_vertices) { return; }
	// create a new entry for this new vertex
	// only 2 vertices, no need to worry about winding order.
	vertices_vertices[vertex] = [...incident_vertices];
	// for each incident vertex in the vertices_vertices, replace the other incident
	// vertex's entry with this new vertex, the new vertex takes its place.
	incident_vertices.forEach((v, i, arr) => {
		const otherV = arr[(i + 1) % arr.length];
		const otherI = vertices_vertices[v].indexOf(otherV);
		vertices_vertices[v][otherI] = vertex;
	});
};
/**
 * @description run this after vertices_vertices has been built
 */
const update_vertices_sectors = ({
	vertices_coords, vertices_vertices, vertices_sectors,
}, vertex) => {
	if (!vertices_sectors) { return; }
	vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
		? [math.core.TWO_PI]
		: math.core.counterClockwiseSectors2(vertices_vertices[vertex]
			.map(v => math.core
				.subtract2(vertices_coords[v], vertices_coords[vertex])));
};
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update vertices_edges for the new vertex, as well as the split edge's
 * endpoint's vertices_edges to include the two new edges in place of the
 * old one while preserving all other vertices_vertices in each endpoint.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} old_edge the index of the old edge
 * @param {number} new_vertex the index of the new vertex splitting the edge
 * @param {number[]} vertices the old edge's two vertices, must be aligned with "new_edges"
 * @param {number[]} new_edges the two new edges, must be aligned with "vertices"
 */
const update_vertices_edges$2 = ({
	vertices_edges,
}, old_edge, new_vertex, vertices, new_edges) => {
	if (!vertices_edges) { return; }
	// update 1 vertex, our new vertex
	vertices_edges[new_vertex] = [...new_edges];
	// update the two vertices, our new vertex replaces the alternate
	// vertex in each of their arrays.  0-------x-------0
	vertices
		.map(v => vertices_edges[v].indexOf(old_edge))
		.forEach((index, i) => {
			vertices_edges[vertices[i]][index] = new_edges[i];
		});
};
/**
 * @description a new vertex was added between two faces, update the
 * vertices_faces with the already-known faces indices.
 * @param {object} graph a FOLD object, modified in place
 * @param {number} vertex the index of the new vertex
 * @param {number[]} faces array of 0, 1, or 2 incident faces.
 */
const update_vertices_faces$1 = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};
/**
 * @description a new vertex was added between two faces, update the
 * edges_faces with the already-known faces indices.
 * @param {object} graph a FOLD object, modified in place
 * @param {number[]} new_edges array of 2 new edges
 * @param {number[]} faces array of 0, 1, or 2 incident faces.
 */
const update_edges_faces$1 = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => { edges_faces[edge] = [...faces]; });
};
/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} graph a FOLD object, modified in place
 * @param {number[]} new_vertex indices of two faces to be rebuilt
 * @param {number} incident_vertices new vertex index
 * @param {number[]} faces the two vertices of the old edge
 */
const update_faces_vertices = ({ faces_vertices }, new_vertex, incident_vertices, faces) => {
	// exit if we don't even have faces_vertices
	if (!faces_vertices) { return; }
	faces
		.map(i => faces_vertices[i])
		.forEach(face => face
			.map((fv, i, arr) => {
				const nextI = (i + 1) % arr.length;
				return (fv === incident_vertices[0]
								&& arr[nextI] === incident_vertices[1])
								|| (fv === incident_vertices[1]
								&& arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a, b) => b - a)
			.forEach(i => face.splice(i, 0, new_vertex)));
};
const update_faces_edges_with_vertices = ({
	edges_vertices, faces_vertices, faces_edges,
}, faces) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	faces
		.map(f => faces_vertices[f]
			.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
			.map(pair => edge_map[pair.join(" ")]))
		.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
};

// const edges_shared_vertex = ({ edges_vertices }, e0, e1) => {
//   const verts0 = edges_vertices[e0];
//   const verts1 = edges_vertices[e1];
//   if (verts0[0] === verts1[0]) { return verts0[0]; }
//   if (verts0[0] === verts1[1]) { return verts0[0]; }
//   if (verts0[1] === verts1[0]) { return verts0[1]; }
//   if (verts0[1] === verts1[1]) { return verts0[1]; }
//   console.error("edges_shared_vertex");
// };
// const sort_edges = ({ edges_vertices }, new_edges, three_edges) => {
//   const prev_vertex = edges_shared_vertex({ edges_vertices }, three_edges[0], three_edges[1]);
//   const next_vertex = edges_shared_vertex({ edges_vertices }, three_edges[1], three_edges[2]);
//   console.log("prev_vertex", prev_vertex);
//   console.log("next_vertex", next_vertex);
//   console.log("edges_vertices[new_edges[0]]", edges_vertices[new_edges[0]]);
//   console.log("edges_vertices[new_edges[1]]", edges_vertices[new_edges[1]]);
//   if (edges_vertices[new_edges[0]].includes(prev_vertex)
//     && edges_vertices[new_edges[1]].includes(next_vertex)) {
//     return [new_edges[0], new_edges[1]];
//   }
//   if (edges_vertices[new_edges[1]].includes(prev_vertex)
//     && edges_vertices[new_edges[0]].includes(next_vertex)) {
//     return [new_edges[1], new_edges[0]];
//   }
//   console.error("sort_edges");
// };
// /**
//  * @description a new vertex was added, splitting an edge. rebuild the
//  * two incident faces by replacing the old edge with two new ones.
//  * @param {object} FOLD object, modified in place
//  * @param {number[]} indices of two faces to be rebuilt
//  * @param {number} new vertex index
//  * @param {number[]} indices of the two new edges
//  * @param {number} old edge index
//  */
// export const update_faces_edges = ({ edges_vertices, faces_edges }, old_edge, new_vertex, new_edges, faces) => {
//   // exit if we don't even have faces_edges
//   if (!faces_edges) { return; }
//   const splices = faces
//     .map(f => {
//     // .map(i => faces_edges[i])
//     // .map((face, f) => {
//       // in each face, find the index of the old edge in this faces_edges,
//       // as well as the index of the prev and next edges.
//       const splice_indices = faces_edges[f]
//         .map((fe, i, arr) => fe === old_edge ? i : undefined)
//         .filter(el => el !== undefined)
//         .sort((a, b) => b - a)
//       const splice_prev = splice_indices
//         .map(i => (i + faces_edges[f].length - 1) % faces_edges[f].length);
//       const splice_next = splice_indices
//         .map(i => (i + 1) % faces_edges[f].length);
//       // make these three consecutive splice indices into a tuple:
//       // [prev, curr, next]
//       const three_indices = splice_indices
//         .map((curr, i) => [splice_prev[i], curr, splice_next[i]]);
//       // convert these three indices into the edges they point to.
//       const three_indices_edges = three_indices
//         .map(tuple => tuple.map(i => faces_edges[f][i]));
//       // figure out which order the two new faces need to be inserted.
//       console.log("splice_indices", splice_indices);
//       console.log("splice_prev", splice_prev);
//       console.log("splice_next", splice_next);
//       console.log("three_indices", three_indices);
//       console.log("three_indices_edges", three_indices_edges);
//       console.log("old edge vertices", edges_vertices[old_edge]);
//       const sort_new_edges = three_indices_edges
//         .map(three => sort_edges({ edges_vertices }, new_edges, three));
//       console.log("sort_new_edges", sort_new_edges);
//       return splice_indices.map((splice, i) => ({
//         face_edges: faces_edges[f],
//         splice,
//         insert: sort_new_edges[i],
//       }))
//       // splice_indices
//       //   .forEach((index, i) => face.splice(index, 1, sort_new_edges[i]));
//       // .forEach(i => face.splice(i, 0, new_vertex))
//     })
//     .reduce((a, b) => a.concat(b), [])
//     .sort((a, b) => b.splice - a.splice);

//   console.log("splices", splices);
//   splices
//     .forEach(el => {
//       el.face_edges.splice(el.splice, 1, ...el.insert);
//       console.log("HERE", JSON.parse(JSON.stringify(el.face_edges)));
//     });
// };

// export const update_faces_edges = ({ edges_vertices, faces_edges }, old_edge, new_vertex, new_edges, faces) => {
//   // exit if we don't even have faces_edges
//   if (!faces_edges) { return; }
//   faces
//     .map(i => faces_edges[i])
//     .forEach((face) => {
//       // there should be 2 faces in this array, incident to the removed edge
//       // find the location of the removed edge in this face
//       const edgeIndex = face.indexOf(old_edge);
//       // the previous and next edge in this face, counter-clockwise
//       const prevEdge = face[(edgeIndex + face.length - 1) % face.length];
//       const nextEdge = face[(edgeIndex + 1) % face.length];
//       const vertices = [
//         [prevEdge, old_edge],
//         [old_edge, nextEdge],
//       ].map((pairs) => {
//         const verts = pairs.map(e => edges_vertices[e]);
//         return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
//           ? verts[0][0] : verts[0][1];
//       }).reduce((a, b) => a.concat(b), []);
//       const edges = [
//         [vertices[0], new_vertex],
//         [new_vertex, vertices[1]],
//       ].map((verts) => {
//         const in0 = verts.map(v => edges_vertices[new_edges[0]].indexOf(v) !== -1)
//           .reduce((a, b) => a && b, true);
//         const in1 = verts.map(v => edges_vertices[new_edges[1]].indexOf(v) !== -1)
//           .reduce((a, b) => a && b, true);
//         if (in0) { return new_edges[0]; }
//         if (in1) { return new_edges[1]; }
//         throw new Error("splitEdge() bad faces_edges");
//       });
//       if (edgeIndex === face.length - 1) {
//         // replacing the edge at the end of the array, we have to be careful
//         // to put the first at the end, the second at the beginning
//         face.splice(edgeIndex, 1, edges[0]);
//         face.unshift(edges[1]);
//       } else {
//         face.splice(edgeIndex, 1, ...edges);
//       }
//       return edges;
//     });
// };

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description split an edge with a new vertex, replacing the old
 * edge with two new edges sharing the common vertex. rebuilding:
 * - vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
 * - edges_vertices, edges_faces, edges_assignment,
 * - edges_foldAngle, edges_vector
 * - faces_vertices, faces_edges,
 * without rebuilding:
 * - faces_faces
 * todo: edgeOrders
 * @usage requires edges_vertices to be defined
 * @param {object} graph FOLD object, modified in place
 * @param {number} old_edge index of old edge to be split
 * @param {number[]} coords coordinates of the new vertex to be added. optional.
 * if omitted, a vertex will be generated at the edge's midpoint.
 * @param {number} [epsilon=1e-6] if an incident vertex is within this distance
 * the function will not split the edge, simply return this vertex.
 * @returns {object} a summary of the changes with keys "vertex", "edges"
 * "vertex" is the index of the new vertex (or old index, if similar)
 * "edge" is a summary of changes to edges, with "map" and "remove"
 * @linkcode Origami ./src/graph/splitEdge/index.js 39
 */
const splitEdge = (graph, old_edge, coords, epsilon = math.core.EPSILON) => {
	// make sure old_edge is a valid index
	if (graph.edges_vertices.length < old_edge) { return {}; }
	const incident_vertices = graph.edges_vertices[old_edge];
	if (!coords) {
		coords = math.core.midpoint(...incident_vertices);
	}
	// test similarity with the incident vertices, if similar, return.
	const similar = incident_vertices
		.map(v => graph.vertices_coords[v])
		.map(vert => math.core.distance(vert, coords) < epsilon);
	if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
	// the new vertex will sit at the end of the array
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;
	// indices of new edges
	const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
	// create 2 new edges, add them to the graph
	splitEdgeIntoTwo(graph, old_edge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
	// done with: vertices_coords, edges_vertices, edges_assignment, edges_foldAngle
	update_vertices_vertices$2(graph, vertex, incident_vertices);
	update_vertices_sectors(graph, vertex); // after vertices_vertices
	update_vertices_edges$2(graph, old_edge, vertex, incident_vertices, new_edges);
	// done with: vertices_edges, vertices_vertices, and
	// vertices_sectors if it exists.
	const incident_faces = findAdjacentFacesToEdge(graph, old_edge);
	if (incident_faces) {
		update_vertices_faces$1(graph, vertex, incident_faces);
		update_edges_faces$1(graph, new_edges, incident_faces);
		update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
		update_faces_edges_with_vertices(graph, incident_faces);
		// update_faces_edges(graph, old_edge, vertex, new_edges, incident_faces);
	}
	// done with: vertices_faces, edges_faces, faces_vertices, faces_edges
	// and we don't need to bother with faces_faces and faceOrders.
	// todo: edgeOrders. the only spec key remaining.
	// remove old data
	const edge_map = removeGeometryIndices(graph, _edges, [old_edge]);
	// shift our new edge indices since these relate to the graph before remove().
	new_edges.forEach((_, i) => { new_edges[i] = edge_map[new_edges[i]]; });
	// we had to run "remove" with the new edges added. to return the change info,
	// we need to adjust the map to exclude these edges.
	edge_map.splice(-2);
	// replace the "undefined" in the map with the two new edge indices.
	edge_map[old_edge] = new_edges;
	return {
		vertex,
		edges: {
			map: edge_map,
			new: new_edges,
			remove: old_edge,
		},
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given two vertices and incident faces, create all new
 * "edges_" entries to describe a new edge that sits between the params.
 * @param {object} FOLD graph
 * @param {number[]} two incident vertices that make up this edge
 * @param {number[]} two edge-adjacent faces to this new edge
 * @param {number[]} TEMPORARILY holds 2x the index of the face that
 *  this edge currently lies inside, because the faces arrays will be
 *  rebuilt from scratch, we need the old data.
 * @returns {object} all FOLD spec "edges_" entries for this new edge.
 */
// const make_edge = ({ vertices_coords }, vertices, faces) => {
const make_edge = ({ vertices_coords }, vertices, face) => {
	// coords reversed for "vector", so index [0] comes last in subtract
	const new_edge_coords = vertices
		.map(v => vertices_coords[v])
		.reverse();
	return {
		edges_vertices: [...vertices],
		edges_foldAngle: 0,
		edges_assignment: "U",
		edges_length: math.core.distance2(...new_edge_coords),
		edges_vector: math.core.subtract(...new_edge_coords),
		edges_faces: [face, face],
	};
};
/**
 *
 */
const rebuild_edge = (graph, face, vertices) => {
	// now that 2 vertices are in place, add a new edge between them.
	const edge = graph.edges_vertices.length;
	// construct data for our new edge (vertices, assignent, foldAngle...)
	// and the entry for edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const new_edge = make_edge(graph, vertices, face);
	// ignoring any keys that aren't a part of our graph, add the new edge
	Object.keys(new_edge)
		.filter(key => graph[key] !== undefined)
		.forEach((key) => { graph[key][edge] = new_edge[key]; });
	return edge;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {object} FOLD graph
 * @param {number} the face that will be replaced by these 2 new
 * @param {number[]} vertices (in the face) that split the face into 2 sides
 */
const make_faces = ({
	edges_vertices, faces_vertices, faces_edges,
}, face, vertices) => {
	// the indices of the two vertices inside the face_vertices array.
	// this is where we will split the face into two.
	const indices = vertices.map(el => faces_vertices[face].indexOf(el));
	const faces = splitCircularArray(faces_vertices[face], indices)
		.map(fv => ({ faces_vertices: fv }));
	if (faces_edges) {
		// table to build faces_edges
		const vertices_to_edge = makeVerticesToEdgeBidirectional({ edges_vertices });
		faces
			.map(this_face => this_face.faces_vertices
				.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
				.map(key => vertices_to_edge[key]))
			.forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
	}
	return faces;
};
/**
 *
 */
const build_faces = (graph, face, vertices) => {
	// new face indices at the end of the list
	const faces = [0, 1].map(i => graph.faces_vertices.length + i);
	// construct new face data for faces_vertices, faces_edges
	// add them to the graph
	make_faces(graph, face, vertices)
		.forEach((newface, i) => Object.keys(newface)
			.forEach((key) => { graph[key][faces[i]] = newface[key]; }));
	return faces;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this is a highly specific method, it takes in the output
 * from intersectConvexFaceLine and applies it to a graph by splitting
 * the edges (in the case of edge, not vertex intersection),
 * @param {object} a FOLD object. modified in place.
 * @param {object} the result from calling "intersectConvexFaceLine".
 * each value must be an array. these will be modified in place.
 * @returns {object} with "vertices" and "edges" keys where
 * - vertices is an array of indices (the new vertices)
 * - edges is an object with keys "map", the changes to edge array, and
 * "remove", the indices of edges that have been removed.
 * look inside of "map" at the indices from "removed" for the indices
 * of the new edges which replaced them.
 */
const split_at_intersections = (graph, { vertices, edges }) => {
	// intersection will contain 2 items, either in "vertices" or "edges",
	// however we will split edges and store their new vertex in "vertices"
	// so in the end, "vertices" will contain 2 items.
	let map;
	// split the edge (modifying the graph), and store the changes so that during
	// the next loop the second edge to split will be updated to the new index
	const split_results = edges.map((el) => {
		const res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
		return res;
	});
	vertices.push(...split_results.map(res => res.vertex));
	// if two edges were split, the second one contains a "remove" key that was
	// based on the mid-operation graph, update this value to match the graph
	// before any changes occurred.
	let bkmap;
	// todo: if we extend this to include non-convex polygons, this is the
	// only part of the code we need to test. cumulative backmap merge.
	// this was written without any testing, as convex polygons never have
	// more than 2 intersections
	split_results.forEach(res => {
		res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
		const inverted = invertSimpleMap(res.edges.map);
		bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		},
	};
};

/**
 * Rabbit Ear (c) Kraft
 */

const warning = "splitFace potentially given a non-convex face";
/**
 * @description a newly-added edge needs to update its two endpoints'
 * vertices_vertices. each vertices_vertices gains one additional
 * vertex, then the whole array is re-sorted counter-clockwise
 * @param {object} FOLD object
 * @param {number} index of the newly-added edge
 */
const update_vertices_vertices$1 = ({
	vertices_coords, vertices_vertices, edges_vertices,
}, edge) => {
	const v0 = edges_vertices[edge][0];
	const v1 = edges_vertices[edge][1];
	vertices_vertices[v0] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v0].concat(v1),
		v0,
	);
	vertices_vertices[v1] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v1].concat(v0),
		v1,
	);
};
/**
 * vertices_vertices was just run before this method. use it.
 * vertices_edges should be up to date, except for the addition
 * of this one new edge at both ends of 
 */
const update_vertices_edges$1 = ({
	edges_vertices, vertices_edges, vertices_vertices,
}, edge) => {
	// the expensive way, rebuild all arrays
	// graph.vertices_edges = makeVerticesEdges(graph);
	if (!vertices_edges || !vertices_vertices) { return; }
	const vertices = edges_vertices[edge];
	// for each of the two vertices, check its vertices_vertices for the
	// index of the opposite vertex. this is the edge. return its position
	// in the vertices_vertices to be used to insert into vertices_edges.
	vertices
		.map(v => vertices_vertices[v])
		.map((vert_vert, i) => vert_vert
			.indexOf(vertices[(i + 1) % vertices.length]))
		.forEach((radial_index, i) => vertices_edges[vertices[i]]
			.splice(radial_index, 0, edge));
};
/**
 * @description search inside vertices_faces for an occurence
 * of the removed face, determine which of our two new faces
 * needs to be put in its place by checking faces_vertices
 * by way of this map we build at the beginning.
 */
const update_vertices_faces = (graph, old_face, new_faces) => {
	// for each of the vertices (only the vertices involved in this split),
	// use the new faces_vertices data (built in the previous method) to get
	// a list of the new faces to be added to this vertex's vertices_faces.
	const vertices_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_vertices[f]
			.forEach(v => {
				if (!vertices_replacement_faces[v]) {
					vertices_replacement_faces[v] = [];
				}
				vertices_replacement_faces[v].push(f);
			}));
	// these vertices need updating
	graph.faces_vertices[old_face].forEach(v => {
		const index = graph.vertices_faces[v].indexOf(old_face);
		const replacements = vertices_replacement_faces[v];
		if (index === -1 || !replacements) {
			console.warn(warning);
			return;
		}
		graph.vertices_faces[v].splice(index, 1, ...replacements);
	});
};
/**
 * @description called near the end of the split_convex_face method.
 * update the "edges_faces" array for every edge involved.
 * figure out where the old_face's index is in each edges_faces array,
 * figure out which of the new faces (or both) need to be added and
 * substitute the old index with the new face's index/indices.
 */
const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
	// for each of the edges (only the edges involved in this split),
	// use the new faces_edges data (built in the previous method) to get
	// a list of the new faces to be added to this edge's edges_faces.
	// most will be length of 1, except the edge which split the face will be 2.
	const edges_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_edges[f]
			.forEach(e => {
				if (!edges_replacement_faces[e]) { edges_replacement_faces[e] = []; }
				edges_replacement_faces[e].push(f);
			}));
	// these edges need updating
	const edges = [...graph.faces_edges[old_face], new_edge];
	edges.forEach(e => {
		// these are the faces which should be inserted into this edge's
		// edges_faces array, we just need to find the old index to replace.
		const replacements = edges_replacement_faces[e];
		// basically rewriting .indexOf(), but supporting multiple results.
		// these will be the indices containing a reference to the old face.
		const indices = [];
		for (let i = 0; i < graph.edges_faces[e].length; i += 1) {
			if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
		}
		if (indices.length === 0 || !replacements) {
			console.warn(warning);
			return;
		}
		// "indices" will most often be length 1, except for the one edge which
		// was added which splits the face in half. the previous methods which
		// did this gave that edge two references both to the same face, knowing
		// that here we will replace both references to the pair of the new
		// faces which the edge now divides.
		// remove the old indices.
		indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
		// in both cases when "indices" is length 1 or 2, get just one index
		// at which to insert the new reference(s).
		const index = indices[indices.length - 1];
		graph.edges_faces[e].splice(index, 0, ...replacements);
	});
};
/**
 * @description one face was removed and two faces put in its place.
 * regarding the faces_faces array, updates need to be made to the two
 * new faces, as well as all the previously neighboring faces of
 * the removed face.
 */
const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
	// this is presuming that new_faces have their updated faces_vertices by now
	const incident_faces = faces_faces[old_face];
	const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
	// for each of the incident faces (to the old face), set one of two
	// indices, one of the two new faces. this is the new incident face.
	const incident_face_face = incident_faces.map(f => {
		const incident_face_vertices = faces_vertices[f];
		const score = [0, 0];
		for (let n = 0; n < new_faces_vertices.length; n += 1) {
			let count = 0;
			for (let j = 0; j < incident_face_vertices.length; j += 1) {
				if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
					count += 1;
				}
			}
			score[n] = count;
		}
		if (score[0] >= 2) { return new_faces[0]; }
		if (score[1] >= 2) { return new_faces[1]; }
	});
	// prepare the new faces' face_faces empty arrays, filled with one
	// face, the opposite of the pair of the new faces.
	new_faces.forEach((f, i, arr) => {
		faces_faces[f] = [arr[(i + 1) % new_faces.length]];
	});
	// 2 things, fill the new face's arrays and update each of the
	// incident faces to point to the correct of the two new faces.
	incident_faces.forEach((f, i) => {
		for (let j = 0; j < faces_faces[f].length; j += 1) {
			if (faces_faces[f][j] === old_face) {
				faces_faces[f][j] = incident_face_face[i];
				faces_faces[incident_face_face[i]].push(f);
			}
		}
	});
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description divide a **convex** face into two polygons with a straight line cut.
 * if the line ends exactly along existing vertices, they will be
 * used, otherwise, new vertices will be added (splitting edges).
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} face index of face to split
 * @param {number[]} vector the vector component of the cutting line
 * @param {number[]} point the point component of the cutting line
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} a summary of changes to the FOLD object,
 *  or undefined if no change (no intersection).
 * @linkcode Origami ./src/graph/splitFace/index.js 28
 */
const splitFace = (graph, face, vector, point, epsilon) => {
	// survey face for any intersections which cross directly over a vertex
	const intersect = intersectConvexFaceLine(graph, face, vector, point, epsilon);
	// if no intersection exists, return undefined.
	if (intersect === undefined) { return undefined; }
	// this result will be appended to (vertices, edges) and returned by this method.
	const result = split_at_intersections(graph, intersect);
	// this modifies the graph by only adding an edge between existing vertices
	result.edges.new = rebuild_edge(graph, face, result.vertices);
	// update all changes to vertices and edges (anything other than faces).
	update_vertices_vertices$1(graph, result.edges.new);
	update_vertices_edges$1(graph, result.edges.new);
	// done: vertices_coords, vertices_edges, vertices_vertices, edges_vertices
	// at this point the graph is once again technically valid, except
	// the face data is a little weird as one face is ignoring the newly-added
	// edge that cuts through it.
	const faces = build_faces(graph, face, result.vertices);
	// update all arrays having to do with face data
	update_vertices_faces(graph, face, faces);
	update_edges_faces(graph, face, result.edges.new, faces);
	update_faces_faces(graph, face, faces);
	// remove old data
	const faces_map = removeGeometryIndices(graph, _faces, [face]);
	// the graph is now complete, however our return object needs updating.
	// shift our new face indices since these relate to the graph before remove().
	faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
	// we had to run "remove" with the new faces added. to return the change info,
	// we need to adjust the map to exclude these faces.
	faces_map.splice(-2);
	// replace the "undefined" in the map with the two new edge indices.
	faces_map[face] = faces;
	result.faces = {
		map: faces_map,
		new: faces,
		remove: face,
	};
	return result;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @name Graph
 * @description a graph which includes faces, edges, and vertices, and additional
 * origami-specific information like fold angles of edges and layer order of faces.
 * @param {FOLD} [graph] an optional FOLD object, otherwise the graph will initialize empty
 * @linkcode Origami ./src/classes/graph.js 45
 */
const Graph = {};
Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;
/**
 * methods where "graph" is the first parameter, followed by ...arguments
 * func(graph, ...args)
 */
const graphMethods = Object.assign({
	// count,
	clean,
	validate: validate$1,
	populate,
	fragment,
	// subgraph,
	// assign,
	// convert snake_case to camelCase
	addVertices: addVertices,
	splitEdge: splitEdge,
	faceSpanningTree: makeFaceSpanningTree,
	explodeFaces: explodeFaces,
	explodeShrinkFaces: explodeShrinkFaces,
},
	transform,
);
Object.keys(graphMethods).forEach(key => {
	Graph.prototype[key] = function () {
		return graphMethods[key](this, ...arguments);
	};
});
/**
 * methods below here need some kind of pre-processing of their arguments
 */
Graph.prototype.splitFace = function (face, ...args) {
	const line = math.core.getLine(...args);
	return splitFace(this, face, line.vector, line.origin);
};
/**
 * @returns {this} a deep copy of this object
 */
Graph.prototype.copy = function () {
	// return Object.assign(Object.create(Graph.prototype), clone(this));
	// return Object.assign(Object.create(this.__proto__), clone(this));
	return Object.assign(Object.create(Object.getPrototypeOf(this)), clone(this));
	// todo: switch this for:
	// Object.getPrototypeOf(this);
};
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
// Graph.prototype.load = function (object, options = {}) {
//   if (typeof object !== S._object) { return; }
//   if (options.append !== true) {
//     keys.forEach(key => delete this[key]);
//   }
//   // allow overwriting of file_spec and file_creator if included in import
//   Object.assign(this, { file_spec, file_creator }, clone(object));
// };
/**
 * this clears all components from the graph, leaving metadata and other
 * keys untouched.
 */
Graph.prototype.clear = function () {
	foldKeys.graph.forEach(key => delete this[key]);
	foldKeys.orders.forEach(key => delete this[key]);
	// the code above just avoided deleting all "file_" keys,
	// however, file_frames needs to be removed as it contains geometry.
	delete this.file_frames;
	return this;
};
/**
 * @description get the axis-aligned bounding rectangle that encloses
 * all the vertices of the graph. not only the boundary vertices.
 */
Graph.prototype.boundingBox = function () {
	return math.rect.fromPoints(this.vertices_coords);
};
/**
 * @description alter the vertices by moving the corner of the graph
 * to the origin and shrink or expand the vertices until they
 * aspect fit inside the unit square.
 */
Graph.prototype.unitize = function () {
	if (!this.vertices_coords) { return this; }
	const box = math.core.bounding_box(this.vertices_coords);
	const longest = Math.max(...box.span);
	const scale = longest === 0 ? 1 : (1 / longest);
	const origin = box.min;
	this.vertices_coords = this.vertices_coords
		.map(coord => math.core.subtract(coord, origin))
		.map(coord => coord.map(n => n * scale));
	return this;
};
/**
 * @description return a copy of this graph with the vertices folded.
 * This method works for both 2D and 3D origami.
 * The angle of the fold is searched for in this order:
 * - faces_matrix2 if it exists
 * - edges_foldAngle if it exists
 * - edges_assignment if it exists
 * Careful, repeated calls to this method will repeatedly fold the vertices
 * resulting in a behavior that is surely unintended.
 */
Graph.prototype.folded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFolded(this, ...arguments);
	// const faces_layer = this["faces_re:layer"]
	//   ? this["faces_re:layer"]
	//   : makeFacesLayer(this, arguments[0], 0.001);
	return Object.assign(
		// todo: switch this for:
		Object.create(Object.getPrototypeOf(this)),
		// Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			// "faces_re:layer": faces_layer,
			frame_classes: [_foldedForm],
		}),
	);
	// delete any arrays that becomes incorrect due to folding
	// delete copy.edges_vector;
	// return copy;
};
/**
 * @description return a copy of this graph with the vertices folded.
 * This method will work for 2D only.
 * The angle of the fold is searched for in this order:
 * - faces_matrix2 if it exists
 * - edges_assignment or edges_foldAngle if it exists
 * If neither exists, this method will assume that ALL edges are flat-folded.
 */
Graph.prototype.flatFolded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFlatFolded(this, ...arguments);
	return Object.assign(
		// todo: switch this for:
		// Object.getPrototypeOf(this);
		Object.create(Object.getPrototypeOf(this)),
		// Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			frame_classes: [_foldedForm],
		}),
	);
};
/**
 * graph components
 */
// bind "vertices", "edges", or "faces" to "this"
// then we can pass in this function directly to map()
const shortenKeys = function (el) {
	const object = Object.create(null);
	Object.keys(el).forEach((k) => {
		object[k.substring(this.length + 1)] = el[k];
	});
	return object;
};
// bind the FOLD graph to "this"
const getComponent = function (key) {
	return transposeGraphArrays(this, key)
		.map(shortenKeys.bind(key))
		.map(setup[key].bind(this));
};

[_vertices, _edges, _faces]
	.forEach(key => Object.defineProperty(Graph.prototype, key, {
		enumerable: true,
		get: function () { return getComponent.call(this, key); },
	}));

// todo: get boundaries, plural
// get boundary. only if the edges_assignment
Object.defineProperty(Graph.prototype, _boundary, {
	enumerable: true,
	get: function () {
		const boundary = getBoundary(this);
		// const poly = math.polygon(boundary.vertices.map(v => this.vertices_coords[v]));
		const poly = boundary.vertices.map(v => this.vertices_coords[v]);
		Object.keys(boundary).forEach(key => { poly[key] = boundary[key]; });
		return Object.assign(poly, boundary);
	},
});
/**
 * graph components based on Euclidean distance
 */
const nearestMethods = {
	vertices: nearestVertex,
	edges: nearestEdge,
	faces: nearestFace,
};
/**
 * @description given a point, this will return the nearest vertex, edge,
 * and face, as well as the nearest entry inside all of the "vertices_",
 * "edges_", and "faces_" arrays.
 */
Graph.prototype.nearest = function () {
	const point = math.core.getVector(arguments);
	const nears = Object.create(null);
	const cache = {};
	[_vertices, _edges, _faces].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => {
				if (cache[key] !== undefined) { return cache[key]; }
				cache[key] = nearestMethods[key](this, point);
				return cache[key];
			},
		});
		filterKeysWithPrefix(this, key).forEach(fold_key =>
			Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => this[fold_key][nears[singularize[key]]],
			}));
	});
	return nears;
};

var GraphProto = Graph.prototype;

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Clip a line inside the boundaries of a graph, resulting in one segment
 * or undefined. The line can be a line, ray, or segment.
 * @param {FOLD} graph a FOLD graph
 * @param {RayLine|number[][]} line a line or a segment
 * @returns {number[][]|undefined} a segment, a pair of two points,
 * or undefined if no intersection
 * @linkcode Origami ./src/graph/clip.js 14
 */
const clip = function (graph, line) {
	const polygon = getBoundary(graph).vertices.map(v => graph.vertices_coords[v]);
	const vector = line.vector ? line.vector : math.core.subtract2(line[1], line[0]);
	const origin = line.origin ? line.origin : line[0];
	const fn_line = (line.domain_function ? line.domain_function : math.core.includeL);
	return math.core.clipLineConvexPolygon(
		polygon,
		vector,
		origin,
		math.core.include,
		fn_line,
	);
};

/**
 * Rabbit Ear (c) Kraft
 */

const addEdges = (graph, edges_vertices) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	// the user messed up the input and only provided one edge
	// it's easy to fix for them
	if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
	const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
	graph.edges_vertices.push(...edges_vertices);
	const index_map = removeDuplicateEdges(graph).map;
	return indices.map(i => index_map[i]);
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a list of vertices in a graph which:
 * - these vertices have alreaddy been added to the graph
 * - this list of vertices has already been sorted along the vector
 * create a set of edges in the graph that connect these vertices, with
 * one important detail: don't add edges which already exist in the graph.
 *
 * appending: edges_vertices, edges_assignment ("U"), edges_foldAngle (0).
 * rebuilding: vertices_vertices, vertices_edges.
 * ignoring face data. faces will be walked and rebuilt later.
 */
const add_segment_edges = (graph, segment_vertices, pre_edge_map) => {
	// without looking at the graph, connect all the segment vertices
	// fenceposted to create a list of N-1 edges.
	const unfiltered_segment_edges_vertices = Array
		.from(Array(segment_vertices.length - 1))
		.map((_, i) => [segment_vertices[i], segment_vertices[i + 1]]);
	// check the list of segments against the edge_map and mark
	// each segment which already exists as "false".
	const seg_not_exist_yet = unfiltered_segment_edges_vertices
		.map(verts => verts.join(" "))
		.map(str => pre_edge_map[str] === undefined);
	// now, build the actual edges which will be added to the graph
	// by filtering out the edges which already exist
	const segment_edges_vertices = unfiltered_segment_edges_vertices
		.filter((_, i) => seg_not_exist_yet[i]);
	// these are the indices of the new segments.
	const segment_edges = Array
		.from(Array(segment_edges_vertices.length))
		.map((_, i) => graph.edges_vertices.length + i);
	// add new edges to the graph, these edges compose the new segment.
	// add edges_vertices.
	segment_edges.forEach((e, i) => {
		graph.edges_vertices[e] = segment_edges_vertices[i];
	});
	// only update these arrays if they exist.
	if (graph.edges_assignment) {
		segment_edges.forEach(e => { graph.edges_assignment[e] = "U"; });
	}
	if (graph.edges_foldAngle) {
		segment_edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
	}
	// build vertices_vertices
	// for each vertex (n), get the previous (n-1) and the next (n+1)
	// by default, the endpoints will not have neighbor vertices on either side,
	// and most importantly, use the "seg_not_exist_yet" from earlier to
	// check if an edge already existed, and prevent joining vertices across
	// these already existing edges.
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		const prev = seg_not_exist_yet[i - 1] ? segment_vertices[i - 1] : undefined;
		const next = seg_not_exist_yet[i] ? segment_vertices[i + 1] : undefined;
		const new_adjacent_vertices = [prev, next].filter(a => a !== undefined);
		// for the two vertices that are the segment's endpoints, if they are
		// not collinear vertices, they will not yet have a vertices_vertices.
		const previous_vertices_vertices = graph.vertices_vertices[vertex]
			? graph.vertices_vertices[vertex] : [];
		const unsorted_vertices_vertices = previous_vertices_vertices
			.concat(new_adjacent_vertices);
		graph.vertices_vertices[vertex] = sortVerticesCounterClockwise(
			graph,
			unsorted_vertices_vertices,
			segment_vertices[i],
		);
	}
	// build vertices_edges from vertices_vertices
	const edge_map = makeVerticesToEdgeBidirectional(graph);
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
			.map(v => edge_map[`${vertex} ${v}`]);
	}
	// build vertices_sectors from vertices_vertices
	segment_vertices
		.map(center => (graph.vertices_vertices[center].length === 1
			? [math.core.TWO_PI]
			: math.core.counterClockwiseSectors2(graph.vertices_vertices[center]
				.map(v => math.core
					.subtract2(graph.vertices_coords[v], graph.vertices_coords[center])))))
		.forEach((sectors, i) => {
			graph.vertices_sectors[segment_vertices[i]] = sectors;
		});
	return segment_edges;
};
/**
 * @description Add a segment to a planar graph and maintain planarity.
 * If endpoints lie within an epsilon to existing vertices, they will be used.
 * If edges are crossed by the new edge, these edges will be segmented and
 * new vertices will be added. Finally, all intersected faces will be rebuilt.
 * If the graph contains the arrays edges_assignment or edges_foldAngle,
 * the corresponding new edge indices will be appended with "U" and 0.
 * @param {FOLD} graph a planar FOLD graph, modified in place.
 * @param {number[]} point1 a 2D point as an array of numbers
 * @param {number[]} point2 a 2D point as an array of numbers
 * @param {number} [epsilon=1e-6] optional epsilon for merging vertices
 * @returns {number[]} the indices of the new edge(s) composing the segment.
 * @linkcode Origami ./src/graph/add/addPlanarSegment.js 122
 */
const addPlanarSegment = (graph, point1, point2, epsilon = math.core.EPSILON) => {
	// vertices_sectors not a part of the spec, might not be included.
	// this is needed for when we walk faces. we need to be able to
	// identify the one face that winds around the outside enclosing Infinity.
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = makeVerticesSectors(graph);
	}
	// flatten input points to the Z=0 plane
	const segment = [point1, point2].map(p => [p[0], p[1]]);
	const segment_vector = math.core.subtract2(segment[1], segment[0]);
	// not sure this is wanted. project all vertices onto the XY plane.
	// graph.vertices_coords = graph.vertices_coords
	//   .map(coord => coord.slice(0, 2));
	// get all edges which intersect the segment.
	const intersections = makeEdgesSegmentIntersection(
		graph,
		segment[0],
		segment[1],
		epsilon,
	);
	// get the indices of the edges, sorted.
	const intersected_edges = intersections
		.map((pt, e) => (pt === undefined ? undefined : e))
		.filter(a => a !== undefined)
		.sort((a, b) => a - b);
	// using edges_faces, get all faces which have an edge intersected.
	const faces_map = {};
	intersected_edges
		.forEach(e => graph.edges_faces[e]
			.forEach(f => { faces_map[f] = true; }));
	const intersected_faces = Object.keys(faces_map)
		.map(s => parseInt(s, 10))
		.sort((a, b) => a - b);
	// split all intersected edges into two edges, in reverse order
	// so that the "remove()" call only ever removes the last from the
	// set of edges. each splitEdge call also rebuilds all graph data,
	// vertices, faces, adjacent of each, etc..
	const splitEdge_results = intersected_edges
		.reverse()
		.map(edge => splitEdge(graph, edge, intersections[edge], epsilon));
	const splitEdge_vertices = splitEdge_results.map(el => el.vertex);
	// do we need this? changelog for edges? maybe it will be useful someday.
	// todo, should this list be reversed?
	// if the segment crosses at the intersection of some edges,
	// this algorithm produces maps with a bunch of undefineds.
	// const splitEdge_maps = splitEdge_results.map(el => el.edges.map);
	// console.log("splitEdge_maps", splitEdge_maps);
	// const splitEdge_map = splitEdge_maps
	//   .splice(1)
	//   .reduce((a, b) => mergeNextmaps(a, b), splitEdge_maps[0]);
	// now that all edges have been split their new vertices have been
	// added to the graph, add the original segment's two endpoints.
	// we waited until here because this method will search all existing
	// vertices, and avoid adding a duplicate, which will happen in the
	// case of an endpoint lies collinear along a split edge.
	const endpoint_vertices = addVertices(graph, segment, epsilon);
	// use a hash as an intermediary, make sure new vertices are unique.
	// duplicate vertices will occur in the case of a collinear endpoint.
	const new_vertex_hash = {};
	splitEdge_vertices.forEach(v => { new_vertex_hash[v] = true; });
	endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
	const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n, 10));
	// these vertices are sorted in the direction of the segment
	const segment_vertices = sortVerticesAlongVector(graph, new_vertices, segment_vector);

	const edge_map = makeVerticesToEdgeBidirectional(graph);
	// this method returns the indices of the edges that compose the segment.
	// this array is this method's return value.
	const segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
	// update the edge_map with the new segment edges. this is needed for
	// after we walk faces, the faces_edges data comes in the form of
	// vertex pairs, and we need to be able to look up these new edges.
	segment_edges.forEach(e => {
		const v = graph.edges_vertices[e];
		edge_map[`${v[0]} ${v[1]}`] = e;
		edge_map[`${v[1]} ${v[0]}`] = e;
	});
	// in preparation to rebuild faces, we need a set of edges (as a
	// pair of vertices) to begin a counter-clockwise walk. it's
	// insufficient to simply start the walks from all of the new segment's
	// edges, as it would fail this case: the segment splits a face and
	// ends collinear, so that no part of the segment exists INSIDE the face
	// and the face will never be walked.
	// __________
	// [        ]   segment
	// [  face  O-------------
	// [        ]
	// ----------
	// therefore, we will use all of the vertices_vertices from the
	// segment's vertices. this seems to cover all cases.
	// additionally, we don't have to worry about repeating faces, the
	// method has a protection against that ("walked_edges").
	const face_walk_start_pairs = segment_vertices
		.map(v => graph.vertices_vertices[v]
			.map(adj_v => [[adj_v, v], [v, adj_v]]))
		.reduce((a, b) => a.concat(b), [])
		.reduce((a, b) => a.concat(b), []);
	// graph.vertices_sectors = makeVerticesSectors(graph);
	// memo to prevent duplicate faces. this one object should be
	// applied globally to all calls to the method.
	const walked_edges = {};
	// build faces by begin walking from the set of vertex pairs.
	// this includes the one boundary face in the wrong winding direction
	const all_walked_faces = face_walk_start_pairs
		.map(pair => counterClockwiseWalk(graph, pair[0], pair[1], walked_edges))
		.filter(a => a !== undefined);
	// filter out the one boundary face with wrong winding (if it exists)
	const walked_faces = filterWalkedBoundaryFace(all_walked_faces);
	// const walked_faces = all_walked_faces;
	// this method could be called before or after the walk. but
	// for simplicity we're calling it before adding the new faces.
	removeGeometryIndices(graph, "faces", intersected_faces);
	// todo: this assumes faces_vertices exists.
	const new_faces = walked_faces
		.map((_, i) => graph.faces_vertices.length + i);
	// add each array, only if they exist.
	if (graph.faces_vertices) {
		new_faces.forEach((f, i) => {
			graph.faces_vertices[f] = walked_faces[i].vertices;
		});
	}
	// edges are in vertex pairs. these need to be converted to edges
	if (graph.faces_edges) {
		new_faces.forEach((f, i) => {
			graph.faces_edges[f] = walked_faces[i].edges
				.map(pair => edge_map[pair]);
		});
	}
	// tbh, this array is not typically used.
	if (graph.faces_angles) {
		new_faces.forEach((f, i) => {
			graph.faces_angles[f] = walked_faces[i].faces_angles;
		});
	}
	// update all the arrays which reference face arrays, this includes
	// vertices_faces, edges_faces, faces_faces (all that end with _faces)
	if (graph.vertices_faces) {
		graph.vertices_faces = makeVerticesFaces(graph);
	}
	if (graph.edges_faces) {
		graph.edges_faces = makeEdgesFacesUnsorted(graph);
	}
	if (graph.faces_faces) {
		graph.faces_faces = makeFacesFaces(graph);
	}
	// todo, get rid of this after testing.
	if (graph.vertices_coords.length !== graph.vertices_vertices.length
		|| graph.vertices_coords.length !== graph.vertices_edges.length
		|| graph.vertices_coords.length !== graph.vertices_faces.length) {
		console.warn("vertices mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.edges_vertices.length !== graph.edges_faces.length
		|| graph.edges_vertices.length !== graph.edges_assignment.length) {
		console.warn("edges mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.faces_vertices.length !== graph.faces_edges.length
		|| graph.faces_vertices.length !== graph.faces_faces.length) {
		console.warn("faces mismatch", JSON.parse(JSON.stringify(graph)));
	}
	// console.log("intersected_edges", intersected_edges);
	// console.log("intersected_faces", intersected_faces);
	// console.log("splitEdge_results", splitEdge_results);
	// console.log("splitEdge_map", splitEdge_map);
	// console.log("splitEdge_vertices", splitEdge_vertices);
	// console.log("vertices_vertices", splitEdge_vertices
	//   .map(v => graph.vertices_vertices[v]));
	// console.log("endpoint_vertices", endpoint_vertices);
	// console.log("new_vertices", new_vertices);
	// console.log("segment_vertices", segment_vertices);
	// console.log("segment_vertex_pairs", segment_vertex_pairs);
	// console.log("walked_faces", walked_faces);
	// console.log("new_check", new_check);
	return segment_edges;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given two (soon to be) formerly adjacent vertices,
 * remove mention of the other from each's vertices_vertices.
 */
const update_vertices_vertices = ({ vertices_vertices }, vertices) => {
	const other = [vertices[1], vertices[0]];
	vertices
		.map((v, i) => vertices_vertices[v].indexOf(other[i]))
		.forEach((index, i) => vertices_vertices[vertices[i]].splice(index, 1));
};

const update_vertices_edges = ({ vertices_edges }, edge, vertices) => {
	vertices
		.map((v, i) => vertices_edges[v].indexOf(edge))
		.forEach((index, i) => vertices_edges[vertices[i]].splice(index, 1));
};
/**
 * @param {object} a FOLD graph
 * @param {number[]} two face indices in an array.
 */
const join_faces = (graph, faces, edge, vertices) => {
	// const other = [faces[1], faces[0]];
	// the index of the edge in the face's faces_edges array.
	const faces_edge_index = faces
		.map(f => graph.faces_edges[f].indexOf(edge));
	// the index of the FIRST vertex in the face's faces_vertices array.
	// this means that the two vertex indices are at i, and i+1.
	const faces_vertices_index = [];
	faces.forEach((face, f) => graph.faces_vertices[face]
		.forEach((v, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			if ((v === vertices[0] && next === vertices[1])
				|| (v === vertices[1] && next === vertices[0])) {
				faces_vertices_index[f] = i;
			}
		}));
	if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("removePlanarEdge error joining faces"); }

	// get the length of each face, before and after changes
	const edges_len_before = faces
		.map(f => graph.faces_edges[f].length);
	const vertices_len_before = faces
		.map(f => graph.faces_vertices[f].length);
	const edges_len_after = edges_len_before.map(len => len - 1);
	const vertices_len_after = vertices_len_before.map(len => len - 1);

	// get the first index after the remove indices for each array
	const faces_edge_keep = faces_edge_index
		.map((e, i) => (e + 1) % edges_len_before[i]);
	const faces_vertex_keep = faces_vertices_index
		.map((v, i) => (v + 1) % vertices_len_before[i]);

	const new_faces_edges = faces
		.map((face, f) => Array.from(Array(edges_len_after[f]))
			.map((_, i) => (faces_edge_keep[f] + i) % edges_len_before[f])
			.map(index => graph.faces_edges[face][index]));
	const new_faces_vertices = faces
		.map((face, f) => Array.from(Array(vertices_len_after[f]))
			.map((_, i) => (faces_vertex_keep[f] + i) % vertices_len_before[f])
			.map(index => graph.faces_vertices[face][index]));

	// todo this unaligns faces_faces with faces_vertices/faces_edges
	const new_faces_faces = faces
		.map(f => graph.faces_faces[f])
		.reduce((a, b) => a.concat(b), [])
		.filter(f => f !== faces[0] && f !== faces[1]);

	return {
		vertices: new_faces_vertices[0].concat(new_faces_vertices[1]),
		edges: new_faces_edges[0].concat(new_faces_edges[1]),
		faces: new_faces_faces,
	};
};
/**
 * @description remove an edge from a planar graph, rebuild affected faces,
 * remove any newly isolated vertices.
 * @param {object} graph a FOLD graph
 * @param {number} edge the index of the edge to be removed
 * @returns {undefined}
 * @linkcode Origami ./src/graph/remove/removePlanarEdge.js 93
 */
const removePlanarEdge = (graph, edge) => {
	// the edge's vertices, sorted large to small.
	// if they are isolated, we want to remove them.
	const vertices = [...graph.edges_vertices[edge]]
		.sort((a, b) => b - a);
	const faces = [...graph.edges_faces[edge]];
	// console.log("removing edge", edge, "with", faces.length, "adjacent faces",
	// faces, "and", vertices.length, "adjacent vertices", vertices);
	update_vertices_vertices(graph, vertices);
	update_vertices_edges(graph, edge, vertices);
	// is the vertex isolated? if so, mark it for removal
	// either 0, 1, or 2 vertices are able to be removed.
	// wait until the end to remove these.
	const vertices_should_remove = vertices
		.map(v => graph.vertices_vertices[v].length === 0);
	const remove_vertices = vertices
		.filter((vertex, i) => vertices_should_remove[i]);
	// only if the edge has two adjacent faces, and those faces are unique,
	// construct a new face by joining the two faces together at the edge.
	if (faces.length === 2 && faces[0] !== faces[1]) {
		// the index of the new face, the three faces (new and 2 old) are
		// going to temporarily coexist in the graph, before the 2 are removed.
		const new_face = graph.faces_vertices.length;
		// generate the new face's faces_vertices, faces_edges, faces_faces
		const new_face_data = join_faces(graph, faces, edge, vertices);
		graph.faces_vertices.push(new_face_data.vertices);
		graph.faces_edges.push(new_face_data.edges);
		graph.faces_faces.push(new_face_data.faces);
		// todo, check if other faces_ arrays exist. they are out of sync.
		// update all graphs which point to faces:
		// vertices_faces, edges_faces, faces_faces
		graph.vertices_faces.forEach((arr, i) => {
			// in the case of one vertex touching both faces, remove both
			// occurences of the old faces, but only add 1 occurence of the new.
			let already_added = false;
			arr.forEach((face, j) => {
				if (face === faces[0] || face === faces[1]) {
					graph.vertices_faces[i][j] = new_face;
					const params = already_added ? [i, 1] : [i, 1, new_face];
					arr.splice(...params);
					already_added = true;
				}
			});
		});
		graph.edges_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.edges_faces[i][j] = new_face;
			}
		}));
		graph.faces_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.faces_faces[i][j] = new_face;
			}
		}));
		graph.faces_vertices.forEach(fv => fv.forEach(f => {
			if (f === undefined) {
				console.log("FOUND ONE before remove", graph.faces_vertices);
			}
		}));
		// again, only if the edge separated two unique faces, then
		// remove the old faces
		removeGeometryIndices(graph, "faces", faces);
	}
	// this edge is a part of a face where the edge pokes in, winds back
	// out, definitely not convex.
	// from the faces_vertices, remove any isolated vertices.
	// from the faces_edges, remove the edge.
	// then this creates a situation where two of the same vertex might be
	// repeated. filter out so that the vertices are unique only.
	if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
		const face = faces[0]; // the non-convex face which needs correcting.
		graph.faces_vertices[face] = graph.faces_vertices[face]
			.filter(v => !remove_vertices.includes(v))
			.filter((v, i, arr) => v !== arr[(i+1)%arr.length]);
		graph.faces_edges[face] = graph.faces_edges[face]
			.filter(e => e !== edge);
	}
	// remove edge, shrink edges_vertices, edges_faces, ... by 1
	// this also replaces any edge occurence in _edge arrays including:
	// vertices_edges, faces_edges.
	removeGeometryIndices(graph, "edges", [edge]);
	removeGeometryIndices(graph, "vertices", remove_vertices);
};

/**
 * Rabbit Ear (c) Kraft
 */

const getOppositeVertices = (graph, vertex, edges) => {
	edges.forEach(edge => {
		if (graph.edges_vertices[edge][0] === vertex
			&& graph.edges_vertices[edge][1] === vertex) {
			console.warn("removePlanarVertex circular edge");
		}
	});
	return edges.map(edge => (graph.edges_vertices[edge][0] === vertex
		? graph.edges_vertices[edge][1]
		: graph.edges_vertices[edge][0]));
};
/**
 * @description given a degree-2 vertex, remove this vertex, merge the adjacent
 * edges into one, and rebuild the faces on either side.
 * @param {object} graph a FOLD graph
 * @param {number} edge the index of the edge to be removed
 * @returns {undefined}
 * @linkcode Origami ./src/graph/remove/removePlanarVertex.js 24
 */
const removePlanarVertex = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	const faces = uniqueSortedIntegers(graph.vertices_faces[vertex]
		.filter(a => a != null));
	if (edges.length !== 2 || faces.length > 2) {
		console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
		return;
	}
	const vertices = getOppositeVertices(graph, vertex, edges);
	const vertices_reverse = vertices.slice().reverse();
	// sort edges so the smallest index is first
	// edges[0] is the keep edge. edges[1] will be the removed edge.
	edges.sort((a, b) => a - b);
	// vertices_edges
	// replace the index of the removed edge with the keep edge.
	// one of them will already be linked to the keep edge. skip it.
	vertices.forEach(v => {
		const index = graph.vertices_edges[v].indexOf(edges[1]);
		if (index === -1) { return; }
		graph.vertices_edges[v][index] = edges[0];
	});
	// vertices_vertices
	// find the index of the removed vertex,
	// replace it with the opposite vertex.
	vertices.forEach((v, i) => {
		const index = graph.vertices_vertices[v].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown vertex issue");
			return;
		}
		graph.vertices_vertices[v][index] = vertices_reverse[i];
	});
	// edges_vertices
	graph.edges_vertices[edges[0]] = [...vertices];
	// faces_vertices
	faces.forEach(face => {
		const index = graph.faces_vertices[face].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_vertex issue");
			return;
		}
		graph.faces_vertices[face].splice(index, 1);
	});
	// faces_edges
	faces.forEach(face => {
		const index = graph.faces_edges[face].indexOf(edges[1]);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_edge issue");
			return;
		}
		graph.faces_edges[face].splice(index, 1);
	});
	// no changes to: vertices_faces, edges_faces, faces_faces,
	// edges_assignment/foldAngle
	removeGeometryIndices(graph, "vertices", [vertex]);
	removeGeometryIndices(graph, "edges", [edges[1]]);
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a list of numbers this method will sort them by
 *  even and odd indices and sum the two categories, returning two sums.
 * @param {number[]} numbers one list of numbers
 * @returns {number[]} one array of two sums, even and odd indices
 * @linkcode Origami ./src/singleVertex/kawasakiMath.js 10
 */
const alternatingSum = (numbers) => [0, 1]
	.map(even_odd => numbers
		.filter((_, i) => i % 2 === even_odd)
		.reduce((a, b) => a + b, 0));
/**
 * @description alternatingSum, filter odd and even into two categories, then
 *  then set them to be the deviation from the average of the sum.
 * @param {number[]} sectors one list of numbers
 * @returns {number[]} one array of two numbers. if both alternating sets sum
 *  to the same, the result will be [0, 0]. if the first set is 2 more than the
 *  second, the result will be [1, -1]. (not [2, 0] or something with a 2 in it)
 * @linkcode Origami ./src/singleVertex/kawasakiMath.js 23
 */
const alternatingSumDifference = (sectors) => {
	const halfsum = sectors.reduce((a, b) => a + b, 0) / 2;
	return alternatingSum(sectors).map(s => s - halfsum);
};

// export const kawasaki_from_even_vectors = function (...vectors) {
//   return alternating_deviation(...interior_angles(...vectors));
// };
/**
 * @description given a set of edges around a single vertex (expressed as an array
 * of radian angles), find all possible single-ray additions which
 * when added to the set, the set satisfies Kawasaki's theorem.
 * @usage this is hard coded to work for flat-plane, where sectors sum to 360deg
 * @param {number[]} radians the angle of the edges in radians,
 * like vectors around a vertex. pre-sorted.
 * @returns {number[]} for every sector either one vector (as an angle in radians)
 * or undefined if that sector contains no solution.
 * @linkcode Origami ./src/singleVertex/kawasakiMath.js 42
 */
const kawasakiSolutionsRadians = (radians) => radians
	// counter clockwise angle between this index and the next
	.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
	.map(pair => math.core.counterClockwiseAngleRadians(...pair))
	// for every sector, make an array of all the OTHER sectors
	.map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
	// for every sector, use the sector score from the OTHERS two to split it
	.map(opposite_sectors => alternatingSum(opposite_sectors).map(s => Math.PI - s))
	// add the deviation to the edge to get the absolute position
	.map((kawasakis, i) => radians[i] + kawasakis[0])
	// sometimes this results in a solution OUTSIDE the sector. ignore these
	.map((angle, i) => (math.core.isCounterClockwiseBetween(
		angle,
		radians[i],
		radians[(i + 1) % radians.length],
	)
		? angle
		: undefined));
// or should we remove the indices so the array reports [ empty x2, ...]
/**
 * @description given a set of edges around a single vertex (expressed as an array
 * of vectors), find all possible single-ray additions which
 * when added to the set, the set satisfies Kawasaki's theorem.
 * @usage this is hard coded to work for flat-plane, where sectors sum to 360deg
 * @param {number[][]} vectors array of vectors, the edges around a single vertex. pre-sorted.
 * @returns {number[][]} for every sector either one vector
 * or undefined if that sector contains no solution.
 * @linkcode Origami ./src/singleVertex/kawasakiMath.js 71
 */
const kawasakiSolutionsVectors = (vectors) => {
	const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
	return kawasakiSolutionsRadians(vectors_radians)
		.map(a => (a === undefined
			? undefined
			: [Math.cos(a), Math.sin(a)]));
};

var kawasakiMath = /*#__PURE__*/Object.freeze({
	__proto__: null,
	alternatingSum: alternatingSum,
	alternatingSumDifference: alternatingSumDifference,
	kawasakiSolutionsRadians: kawasakiSolutionsRadians,
	kawasakiSolutionsVectors: kawasakiSolutionsVectors
});

/**
 * Rabbit Ear (c) Kraft
 */

const flat_assignment = {
	B: true, b: true, F: true, f: true, U: true, u: true,
};
/**
 * @description get all vertices indices which are adjacent to edges
 * with no mountain/valleys, only containing either flat, unassigned,
 * or boundary.
 */
const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => flat_assignment[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => (valid ? i : undefined))
	.filter(a => a !== undefined);

const folded_assignments = {
	M: true, m: true, V: true, v: true,
};
const maekawa_signs = {
	M: -1, m: -1, V: 1, v: 1,
};
/**
 * @description using edges_assignment, check if Maekawa's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * todo: this assumes that valley/mountain folds are flat folded.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 40
 */
const validateMaekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => maekawa_signs[edges_assignment[e]])
			.filter(a => a !== undefined)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	// overwrite any false values to true for all boundary vertices
	getBoundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
/**
 * @description using the vertices of the edges, check if Kawasaki's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 67
 */
const validateKawasaki = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	edges_vertices,
	edges_assignment,
	edges_vector,
}, epsilon = math.core.EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const is_valid = makeVerticesVerticesVector({
		vertices_coords, vertices_vertices, edges_vertices, edges_vector,
	})
		.map((vectors, v) => vectors
			.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => (vectors.length > 1
			? math.core.counterClockwiseSectors2(vectors)
			: [0, 0]))
		.map(sectors => alternatingSum(sectors))
		.map(pair => Math.abs(pair[0] - pair[1]) < epsilon);

	// overwrite any false values to true for all boundary vertices
	getBoundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};

var validateSingleVertex = /*#__PURE__*/Object.freeze({
	__proto__: null,
	validateMaekawa: validateMaekawa,
	validateKawasaki: validateKawasaki
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const CreasePattern = {};
CreasePattern.prototype = Object.create(GraphProto);
CreasePattern.prototype.constructor = CreasePattern;
/**
 * how many segments will curves be converted into.
 * todo: user should be able to change this
 */
const arcResolution = 96;

const make_edges_array = function (array) {
	array.mountain = (degrees = -180) => {
		array.forEach(i => {
			this.edges_assignment[i] = "M";
			this.edges_foldAngle[i] = degrees;
		});
		return array;
	};
	array.valley = (degrees = 180) => {
		array.forEach(i => {
			this.edges_assignment[i] = "V";
			this.edges_foldAngle[i] = degrees;
		});
		return array;
	};
	array.flat = () => {
		array.forEach(i => {
			this.edges_assignment[i] = "F";
			this.edges_foldAngle[i] = 0;
		});
		return array;
	};
	return array;
};

// ["line", "ray", "segment"].forEach(type => {
//   CreasePattern.prototype[type] = function () {
//     const primitive = math[type](...arguments);
//     if (!primitive) { return; }
//     const segment = clip(this, primitive);
//     if (!segment) { return; }
//     const vertices = addVertices(this, segment);
//     const edges = addEdges(this, vertices);
//     const map = fragment(this).edges.map;
//     populate(this);
//     return make_edges_array.call(this, edges.map(e => map[e])
//       .reduce((a, b) => a.concat(b), []));
//   };
// });

["line", "ray", "segment"].forEach(type => {
	CreasePattern.prototype[type] = function () {
		const primitive = math[type](...arguments);
		if (!primitive) { return; }
		const segment = clip(this, primitive);
		if (!segment) { return; }
		const edges = addPlanarSegment(this, segment[0], segment[1]);
		return make_edges_array.call(this, edges);
	};
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
	CreasePattern.prototype[fName] = function () {
		const primitive = math[fName](...arguments);
		if (!primitive) { return; }
		const segments = primitive.segments(arcResolution)
			.map(segment => math.segment(segment))
			.map(segment => clip(this, segment))
			.filter(a => a !== undefined);
		if (!segments) { return; }
		const vertices = [];
		const edges = [];
		segments.forEach(segment => {
			const verts = addVertices(this, segment);
			vertices.push(...verts);
			edges.push(...addEdges(this, verts));
		});
		const { map } = fragment(this).edges;
		populate(this);
		return make_edges_array.call(this, edges.map(e => map[e])
			.reduce((a, b) => a.concat(b), []));
	};
});

// ["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
//   CreasePattern.prototype[fName] = function () {
//     const primitive = math[fName](...arguments);
//     if (!primitive) { return; }
//     const segments = primitive.segments(arcResolution)
//       .map(segment => math.segment(segment))
//       .map(segment => clip(this, segment))
//       .filter(a => a !== undefined);
//     if (!segments) { return; }
//     const vertices = [];
//     // const edges = [];
//     const edges = segments.map(segment => {
//       return addPlanarSegment(this, segment[0], segment[1]);
//     });
//     console.log("verts, edges", vertices, edges);
//     // return make_edges_array.call(this, edges
//     //   .reduce((a, b) => a.concat(b), []));
//   };
// });

CreasePattern.prototype.removeEdge = function (edge) {
	const vertices = this.edges_vertices[edge];
	removePlanarEdge(this, edge);
	vertices
		.map(v => isVertexCollinear(this, v))
		.map((collinear, i) => (collinear ? vertices[i] : undefined))
		.filter(a => a !== undefined)
		.sort((a, b) => b - a)
		.forEach(v => removePlanarVertex(this, v));
	return true;
};

CreasePattern.prototype.validate = function (epsilon) {
	const valid = validate$1(this, epsilon);
	valid.vertices.kawasaki = validateKawasaki(this, epsilon);
	valid.vertices.maekawa = validateMaekawa(this);
	if (this.edges_foldAngle) {
		valid.edges.not_flat = this.edges_foldAngle
			.map((angle, i) => (edgeFoldAngleIsFlat(angle) ? undefined : i))
			.filter(a => a !== undefined);
	}
	if (valid.summary === "valid") {
		if (valid.vertices.kawasaki.length || valid.vertices.maekawa.length) {
			valid.summary = "invalid";
		} else if (valid.edges.not_flat.length) {
			valid.summary = "not flat";
		}
	}
	return valid;
};

var CreasePatternProto = CreasePattern.prototype;

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this builds a new faces_layer array. it first separates the
 * folding faces from the non-folding using faces_folding, an array of [t,f].
 * it flips the folding faces over, appends them to the non-folding ordering,
 * and (re-indexes/normalizes) all the z-index values to be the minimum
 * whole number set starting with 0.
 * @param {number[]} each index is a face, each value is the z-layer order.
 * @param {boolean[]} each index is a face, T/F will the face be folded over?
 * @returns {number[]} each index is a face, each value is the z-layer order.
 */
const foldFacesLayer = (faces_layer, faces_folding) => {
	const new_faces_layer = [];
	// filter face indices into two arrays, those folding and not folding
	const arr = faces_layer.map((_, i) => i);
	const folding = arr.filter(i => faces_folding[i]);
	const not_folding = arr.filter(i => !faces_folding[i]);
	// sort all the non-folding indices by their current layer, bottom to top,
	// give each face index a new layering index.
	// compress whatever current layer numbers down into [0...n]
	not_folding
		.sort((a, b) => faces_layer[a] - faces_layer[b])
		.forEach((face, i) => { new_faces_layer[face] = i; });
	// sort the folding faces in reverse order (flip them), compress their
	// layers down into [0...n] and and set each face to this layer index
	folding
		.sort((a, b) => faces_layer[b] - faces_layer[a]) // reverse order here
		.forEach((face, i) => { new_faces_layer[face] = not_folding.length + i; });
	return new_faces_layer;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this determines which side of a line (using cross product)
 * a face lies in a folded form, except, the face is the face in
 * the crease pattern and the line (vector origin) is transformed
 * by the face matrix. because of this, we use face_winding to know
 * if this face was flipped over, reversing the result.
 * @note by flipping the < and > in the return, this one change
 * will modify the entire method to toggle which side of the line
 * are the faces which will be folded over.
 */
const make_face_side = (vector, origin, face_center, face_winding) => {
	const center_vector = math.core.subtract2(face_center, origin);
	const determinant = math.core.cross2(vector, center_vector);
	return face_winding ? determinant > 0 : determinant < 0;
};
/**
 * for quickly determining which side of a crease a face lies
 * this uses point average, not centroid, faces must be convex
 * and again it's not precise, but this doesn't matter because
 * the faces which intersect the line (and could potentially cause
 * discrepencies) don't use this method, it's only being used
 * for faces which lie completely on one side or the other.
 */
const make_face_center = (graph, face) => (!graph.faces_vertices[face]
	? [0, 0]
	: graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / graph.faces_vertices[face].length));

const unfolded_assignment = {
	F: true, f: true, U: true, u: true,
};
const opposite_lookup = {
	M: "V", m: "V", V: "M", v: "M",
};
/**
 * @description for a mountain or valley, return the opposite.
 * in the case of any other crease (boundary, flat, ...) return the input.
 */
const get_opposite_assignment = assign => opposite_lookup[assign] || assign;
/**
 * @description shallow copy these entries for one face in the graph.
 * this is intended to capture the values, in the case of the face
 * being removed from the graph (not deep deleted, just unreferenced).
 */
const face_snapshot = (graph, face) => ({
	center: graph.faces_center[face],
	matrix: graph.faces_matrix2[face],
	winding: graph.faces_winding[face],
	crease: graph.faces_crease[face],
	side: graph.faces_side[face],
	layer: graph.faces_layer[face],
});
/**
 * @description make a crease that passes through the entire origami and modify the
 * faces order to simulate one side of the faces flipped over and set on top.
 * @param {object} graph a FOLD graph in crease pattern form, will be modified in place
 * @param {number[]} vector a 2D vector describing the line as an array of numbers
 * @param {number[]} origin a 2D origin describing the line as an array of numbers
 * @param {string} assignment (M/V/F) a FOLD spec encoding of the direction of the fold
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to faces/edges.
 * @algorithm Because we want to return the new modified origami in crease pattern form,
 * as we iterate through the faces, splitting faces which cross the crease
 * line, we have to be modifying the crease pattern, as opposed to modifying
 * a folded form then unfolding the vertices, which would be less precise.
 * So, we will create copies of the crease line, one per face, transformed
 * into place by its face's matrix, which superimposes many copies of the
 * crease line onto the crease pattern, each in place
 * @linkcode Origami ./src/graph/flatFold/index.js 86
 */
const flatFold = (graph, vector, origin, assignment = "V", epsilon = math.core.EPSILON) => {
	const opposite_assignment = get_opposite_assignment(assignment);
	// make sure the input graph contains the necessary data.
	// this takes care of all standard FOLD-spec arrays.
	// todo: this could be optimized by trusting that the existing arrays
	// are accurate, checking if they exist and skipping them if so.
	populate(graph);
	// additionally, we need to ensure faces layer exists.
	// todo: if it doesn't exist, should we use the solver?
	if (!graph.faces_layer) {
		graph.faces_layer = Array(graph.faces_vertices.length).fill(0);
	}
	// these will be properties on the graph. as we iterate through faces,
	// splitting (removing 1 face, adding 2) inside "splitFace", the remove
	// method will automatically shift indices for arrays starting with "faces_".
	// we will remove these arrays at the end of this method.
	graph.faces_center = graph.faces_vertices
		.map((_, i) => make_face_center(graph, i));
	// faces_matrix is built from the crease pattern, but reflects
	// the faces in their folded state.
	if (!graph.faces_matrix2) {
		graph.faces_matrix2 = makeFacesMatrix2(graph, 0);
	}
	graph.faces_winding = makeFacesWindingFromMatrix2(graph.faces_matrix2);
	graph.faces_crease = graph.faces_matrix2
		.map(math.core.invertMatrix2)
		.map(matrix => math.core.multiplyMatrix2Line2(matrix, vector, origin));
	graph.faces_side = graph.faces_vertices
		.map((_, i) => make_face_side(
			graph.faces_crease[i].vector,
			graph.faces_crease[i].origin,
			graph.faces_center[i],
			graph.faces_winding[i],
		));
	// before we start splitting faces, we have to handle the case where
	// a flat crease already exists along the fold crease, already splitting
	// two faces (assignment "F" or "U" only), the splitFace method
	// will not catch these. we need to find these edges before we modify
	// the graph, find the face they are attached to and whether the face
	// is flipped, and set the edge to the proper "V" or "M" (and foldAngle).
	const vertices_coords_folded = multiplyVerticesFacesMatrix2(
		graph,
		graph.faces_matrix2,
	);
	// get all (folded) edges which lie parallel and overlap the crease line
	const collinear_edges = makeEdgesLineParallelOverlap({
		vertices_coords: vertices_coords_folded,
		edges_vertices: graph.edges_vertices,
	}, vector, origin, epsilon)
		.map((is_collinear, e) => (is_collinear ? e : undefined))
		.filter(e => e !== undefined)
		.filter(e => unfolded_assignment[graph.edges_assignment[e]]);
	// get the first valid adjacent face for each edge, get that face's winding,
	// which determines the crease assignment, and assign it to the edge
	collinear_edges
		.map(e => graph.edges_faces[e].find(f => f != null))
		.map(f => graph.faces_winding[f])
		.map(winding => (winding ? assignment : opposite_assignment))
		.forEach((assign, e) => {
			graph.edges_assignment[collinear_edges[e]] = assign;
			graph.edges_foldAngle[collinear_edges[e]] = edgeAssignmentToFoldAngle(
				assign,
			);
		});
	// before we start splitting, capture the state of face 0. we will use
	// it when rebuilding the graph's matrices after all splitting is finished.
	const face0 = face_snapshot(graph, 0);
	// now, iterate through faces (reverse order), rebuilding the custom
	// arrays for the newly added faces when a face is split.
	const split_changes = graph.faces_vertices
		.map((_, i) => i)
		.reverse()
		.map((i) => {
			// this is the face about to be removed. if the face is successfully
			// split the face will be removed but we still need to reference
			// values from it to complete the 2 new faces which replace it.
			const face = face_snapshot(graph, i);
			// split the polygon (if possible), get back a summary of changes.
			const change = splitFace(
				graph,
				i,
				face.crease.vector,
				face.crease.origin,
				epsilon,
			);
			// console.log("split convex polygon change", change);
			if (change === undefined) { return undefined; }
			// const face_winding = folded.faces_winding[i];
			// console.log("face change", face, change);
			// update the assignment of the newly added edge separating the 2 new faces
			graph.edges_assignment[change.edges.new] = face.winding
				? assignment
				: opposite_assignment;
			graph.edges_foldAngle[change.edges.new] = edgeAssignmentToFoldAngle(
				graph.edges_assignment[change.edges.new]);
			// these are the two faces that replaced the removed face after the split
			const new_faces = change.faces.map[change.faces.remove];
			new_faces.forEach(f => {
				// no need right now to build faces_winding, faces_matrix, ...
				graph.faces_center[f] = make_face_center(graph, f);
				graph.faces_side[f] = make_face_side(
					face.crease.vector,
					face.crease.origin,
					graph.faces_center[f],
					face.winding,
				);
				graph.faces_layer[f] = face.layer;
			});
			return change;
		})
		.filter(a => a !== undefined);
	// all faces have been split. get a summary of changes to the graph.
	// "faces_map" is actually needed. the others are just included in the return
	const faces_map = mergeNextmaps(...split_changes.map(el => el.faces.map));
	const edges_map = mergeNextmaps(...split_changes.map(el => el.edges.map)
		.filter(a => a !== undefined));
	const faces_remove = split_changes.map(el => el.faces.remove).reverse();
	// const vert_dict = {};
	// split_changes.forEach(el => el.vertices.forEach(v => { vert_dict[v] = true; }));
	// const new_vertices = Object.keys(vert_dict).map(s => parseInt(s));
	// build a new face layer ordering
	graph.faces_layer = foldFacesLayer(
		graph.faces_layer,
		graph.faces_side,
	);
	// build new face matrices for the folded state. use face 0 as reference
	// we need its original matrix, and if face 0 was split we need to know
	// which of its two new faces doesn't move as the new faces matrix
	// calculation requires we provide the one face that doesn't move.
	const face0_was_split = faces_map && faces_map[0] && faces_map[0].length === 2;
	const face0_newIndex = (face0_was_split
		? faces_map[0].filter(f => graph.faces_side[f]).shift()
		: 0);
	// only if face 0 lies on the not-flipped side (sidedness is false),
	// and it wasn't creased-through, can we use its original matrix.
	// if face 0 lies on the flip side (sidedness is true), or it was split,
	// face 0 needs to be multiplied by its crease's reflection matrix, but
	// only for valley or mountain folds, "flat" folds need to copy the matrix
	let face0_preMatrix = face0.matrix;
	// only if the assignment is valley or mountain, do this. otherwise skip
	if (assignment !== opposite_assignment) {
		face0_preMatrix = (!face0_was_split && !graph.faces_side[0]
			? face0.matrix
			: math.core.multiplyMatrices2(
				face0.matrix,
				math.core.makeMatrix2Reflect(
					face0.crease.vector,
					face0.crease.origin,
				),
			)
		);
	}
	// build our new faces_matrices using face 0 as the starting point,
	// setting face 0 as the identity matrix, then multiply every
	// face's matrix by face 0's actual starting matrix
	graph.faces_matrix2 = makeFacesMatrix2(graph, face0_newIndex)
		.map(matrix => math.core.multiplyMatrices2(face0_preMatrix, matrix));
	// these are no longer needed. some of them haven't even been fully rebuilt.
	delete graph.faces_center;
	delete graph.faces_winding;
	delete graph.faces_crease;
	delete graph.faces_side;
	// summary of changes to the graph
	return {
		faces: { map: faces_map, remove: faces_remove },
		edges: { map: edges_map },
		// vertices: { new: new_vertices },
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @name Origami
 * @description A model of an origami paper. Empty parameter initialization will
 * create a single-face graph with a unit square boundary.
 * @prototype Graph
 * @param {FOLD} [graph] an optional FOLD object
 * @linkcode Origami ./src/classes/origami.js 13
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
	const line = math.core.getLine(arguments);
	flatFold(this, line.vector, line.origin);
	return this;
};

var OrigamiProto = Origami.prototype;

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Check a FOLD object's frame_classes for the presence of "foldedForm".
 * @param {FOLD} graph a FOLD object
 * @returns {boolean} true if the graph is folded.
 * @linkcode Origami ./src/graph/query.js 8
 */
const isFoldedForm = (graph) => (
	(graph.frame_classes && graph.frame_classes.includes("foldedForm"))
		|| (graph.file_classes && graph.file_classes.includes("foldedForm"))
);

var query = /*#__PURE__*/Object.freeze({
	__proto__: null,
	isFoldedForm: isFoldedForm
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Return an ExF matrix (number of: E=edges, F=faces), relating every edge
 * to every face. Value will contain true if the edge and face overlap each other, excluding
 * the space around the edge's endpoints, and the edges of the face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} matrix relating edges to faces, answering, do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 18
 */
const makeEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// convert parallel into NOT parallel.
	const matrix = edges_vertices
		.map(() => Array.from(Array(faces_vertices.length)));

	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));

	const edges_vertices_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_vertices_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
		// .map((polygon, f) => faces_winding[f] ? polygon : polygon.reverse());
	for (let f = 0; f < faces_winding.length; f += 1) {
		if (!faces_winding[f]) { faces_vertices_coords[f].reverse(); }
	}
	matrix.forEach((row, e) => row.forEach((val, f) => {
		if (val === false) { return; }
		// both segment endpoints, true if either one of them is inside the face.
		const point_in_poly = edges_vertices_coords[e]
			.map(point => math.core.overlapConvexPolygonPoint(
				faces_vertices_coords[f],
				point,
				math.core.exclude,
				epsilon,
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { matrix[e][f] = true; return; }
		const edge_intersect = math.core.intersectConvexPolygonLine(
			faces_vertices_coords[f],
			edges_vector[e],
			edges_origin[e],
			math.core.excludeS,
			math.core.excludeS,
			epsilon,
		);
		if (edge_intersect) { matrix[e][f] = true; return; }
		matrix[e][f] = false;
	}));
	return matrix;
};

// const makeFacesFacesOverlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
//   const matrix = Array.from(Array(faces_vertices.length))
//     .map(() => Array.from(Array(faces_vertices.length)));
//   const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
//   for (let i = 0; i < faces_vertices.length - 1; i++) {
//     for (let j = i + 1; j < faces_vertices.length; j++) {
//       const intersection = math.core.intersect_polygon_polygon(
//         faces_polygon[i],
//         faces_polygon[j],
//         // math.core.exclude,
//         epsilon);
//       console.log("testing", faces_polygon[i], faces_polygon[j], intersection, epsilon);
//       const overlap = intersection.length !== 0;
//       matrix[i][j] = overlap;
//       matrix[j][i] = overlap;
//     }
//   }
//   return matrix;
// };
/**
 * @description Compare every face to every face to answer: do the two faces overlap?
 * Return the result in the form of a matrix, an array of arrays of booleans,
 * where both halves of the matrix are filled, matrix[i][j] === matrix[j][i].
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} matrix relating edges to faces, answering, do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 95
 */
const makeFacesFacesOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = math.core.EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
	const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
	for (let i = 0; i < faces_vertices.length - 1; i += 1) {
		for (let j = i + 1; j < faces_vertices.length; j += 1) {
			const overlap = math.core.overlapConvexPolygons(
				faces_polygon[i],
				faces_polygon[j],
				epsilon,
			);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};

var overlap = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeEdgesFacesOverlap: makeEdgesFacesOverlap,
	makeFacesFacesOverlap: makeFacesFacesOverlap
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Create an NxN matrix (N number of edges) that relates edges to each other,
 * inside each entry is true/false, true if the two edges are parallel within an epsilon.
 * Both sides of the matrix are filled, the diagonal is left undefined.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} a boolean matrix, are two edges parallel?
 * @todo wait, no, this is not setting the main diagonal undefined now. what is up?
 * @linkcode Origami ./src/graph/edgesEdges.js 14
 */
const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => { // = math.core.EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edge_count = edges_vector.length;
	const edges_edges_parallel = Array
		.from(Array(edge_count))
		.map(() => Array.from(Array(edge_count)));
	for (let i = 0; i < edge_count - 1; i += 1) {
		for (let j = i + 1; j < edge_count; j += 1) {
			const p = math.core.parallel(edges_vector[i], edges_vector[j], epsilon);
			edges_edges_parallel[i][j] = p;
			edges_edges_parallel[j][i] = p;
		}
	}
	// for (let i = 0; i < edge_count; i++) {
	//   edges_edges_parallel[i][i] = undefined;
	// }
	return edges_edges_parallel;
};

// const edges_radians = edges_vector
//   .map(v => Math.atan2(v[1], v[0]));
// const sorted = edges_radians
//   .map(rad => rad > 0 ? rad : rad + Math.PI)
//   .map((radians, i) => ({ radians, i }))
//   .sort((a, b) => a.radians - b.radians);

// const similar_num = (a, b, epsilon = 0.001) => Math
//   .abs(a - b) < epsilon;

// const parallel_groups = [
//   []
// ];
// let group_i = 0;

// const edges_parallel = Array
//   .from(Array(edge_count))
//   .map(() => []);
// let walk = 0;
// for (let i = 1; i < edge_count; i++) {
//   while (!similar_num(sorted[walk].radians, sorted[i].radians) && walk < i) {
//     walk++;
//   }
//   for (let j = walk; j < i; j++) {
//     edges_parallel[j].push(i);
//   }
// }

/**
 * @description A subroutine for the two methods below.
 * given a matrix which was already worked on, consider only the true values,
 * compute the overlapLineLine method for each edge-pairs.
 * provide a comparison function (func) to specify inclusive/exclusivity.
 */
const overwriteEdgesOverlaps = (matrix, vectors, origins, func, epsilon) => {
	// relationship between i and j is non-directional.
	for (let i = 0; i < matrix.length - 1; i += 1) {
		for (let j = i + 1; j < matrix.length; j += 1) {
			// if value is are already false, skip.
			if (!matrix[i][j]) { continue; }
			matrix[i][j] = math.core.overlapLineLine(
				vectors[i],
				origins[i],
				vectors[j],
				origins[j],
				func,
				func,
				epsilon,
			);
			matrix[j][i] = matrix[i][j];
		}
	}
};
/**
 * @description Find all edges which cross other edges, "cross" meaning
 * the segment overlaps the other segment in a non-parallel way. This also
 * excludes the epsilon space around the endpoints so that adjacent edges
 * are automatically considered not crossing. All parallel line pairs,
 * even if overlapping, are marked false.
 * @param {object} fold a FOLD graph.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean[][]} a boolean matrix, do two edges cross each other?
 */
const makeEdgesEdgesCrossing = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// convert parallel into NOT parallel.
	const matrix = makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon)
		.map(row => row.map(b => !b));
	for (let i = 0; i < matrix.length; i += 1) {
		matrix[i][i] = undefined;
	}
	// if edges are parallel (not this value), skip.
	overwriteEdgesOverlaps(matrix, edges_vector, edges_origin, math.core.excludeS, epsilon);
	return matrix;
};
// todo, improvement suggestion:
// first grouping edges into categories with edges which share parallel-ness.
// then, express every edge's endpoints in terms of the length along
// the vector. converting it into 2 numbers, and now all you have to do is
// test if these two numbers overlap other edges' two numbers.
/**
 * @description Find all edges which are parallel to each other AND they overlap.
 * The epsilon space around vertices is not considered, so, edges must be
 * truly overlapping for them to be true.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} a boolean matrix, do two edges cross each other?
 */
const makeEdgesEdgesParallelOverlap = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// start with edges-edges parallel matrix
	const matrix = makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	// only if lines are parallel, then run the more expensive overlap method
	overwriteEdgesOverlaps(matrix, edges_vector, edges_origin, math.core.excludeS, epsilon);
	return matrix;
};
/**
 * we want to include this case, where one edge may not overlap another
 * but it still gets included because both are overlapped by a common edge.
 *
 *  |----a-----|    |-------c------|
 *          |-----b----|
 *
 * "a" and "c" are included together because b causes them to be so.
 */
/**
 * @description folds the graph then groups edges into categories if edges
 * overlap and are parallel. groups are only formed for groups of 2 or more.
 * any edges which is isolated in the folded form will be ignored.
 */
/*
const make_groups_edges = (graph, epsilon) => {
	// gather together all edges which lie on top of one another in the
	// folded state. take each edge's two adjacent faces,
	const overlap_matrix = makeEdgesEdgesParallelOverlap(graph, epsilon)
	const overlapping_edges = booleanMatrixToIndexedArray(overlap_matrix);
	// each index will be an edge, each value is a group, starting with 0,
	// incrementing upwards. for all unique edges, array will be [0, 1, 2, 3...]
	// if edges 0 and 3 share a group, array will be [0, 1, 2, 0, 3...]
	const edges_group = makeSelfRelationalArrayClusters(overlapping_edges);
	// gather groups, but remove groups with only one edge, and from the
	// remaining sets, remove any edges which lie on the boundary.
	// finally, remove sets with only one edge (after removing).
	return invertMap(edges_group)
		.filter(el => typeof el === "object")
		.map(edges => edges
			.filter(edge => graph.edges_faces[edge].length === 2))
		.filter(edges => edges.length > 1);
};
*/

var edgesEdges = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeEdgesEdgesParallel: makeEdgesEdgesParallel,
	makeEdgesEdgesCrossing: makeEdgesEdgesCrossing,
	makeEdgesEdgesParallelOverlap: makeEdgesEdgesParallelOverlap
});

/**
 * Rabbit Ear (c) Kraft
 */

const subgraph = (graph, components) => {
	const remove_indices = {};
	const sorted_components = {};
	[_faces, _edges, _vertices].forEach(key => {
		remove_indices[key] = Array.from(Array(count[key](graph))).map((_, i) => i);
		sorted_components[key] = uniqueSortedIntegers(components[key] || []).reverse();
	});
	Object.keys(sorted_components)
		.forEach(key => sorted_components[key]
			.forEach(i => remove_indices[key].splice(i, 1)));
	const res = JSON.parse(JSON.stringify(graph));
	Object.keys(remove_indices)
		.forEach(key => removeGeometryIndices(res, key, remove_indices[key]));
	return res;
};

/**
 * Rabbit Ear (c) Kraft
 */
// import addVertices_splitEdges from "./add/addVertices_splitEdges";

var graph_methods = Object.assign(
	Object.create(null),
	{
		count,
		countImplied,
		validate: validate$1,
		clean,
		populate,
		remove: removeGeometryIndices,
		replace: replaceGeometryIndices,
		removePlanarVertex,
		removePlanarEdge,
		addVertices,
		addEdges,
		splitEdge,
		splitFace,
		flatFold,
		addPlanarSegment,
		// assign,
		subgraph,
		clip,
		fragment,
		getVerticesClusters,
		clone,
	},
	make,
	boundary,
	walk,
	nearest,
	fold_spec,
	sort,
	span,
	maps,
	query,
	intersect,
	overlap,
	transform,
	verticesViolations,
	edgesViolations,
	vertices_collinear,
	// facesLayer,
	edgesEdges,
	verticesCoordsFolded,
	faceSpanningTree,
	facesMatrix,
	facesWinding,
	explodeFacesMethods,
	arrays,
);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description a set of constructors which make a new simple FOLD graph,
 * like a single-face boundary-only polygon, or a traditional origami base.
 * @returns {object} a populated FOLD object
 */
const Create = {};
const make_rect_vertices_coords = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
/**
 * @description given an already initialized vertices_coords array,
 * create a fully-populated graph that sets these vertices to be
 * the closed boundary of a polygon.
 */
const make_closed_polygon = (vertices_coords) => populate({
	vertices_coords,
	edges_vertices: vertices_coords
		.map((_, i, arr) => [i, (i + 1) % arr.length]),
	edges_assignment: Array(vertices_coords.length).fill("B"),
});

// const polygon_names = [
// 	undefined,
// 	undefined,
// 	undefined,
// 	"triangle",
// 	undefined,
// 	"pentagon",
// 	"hexagon",
// 	"heptagon",
// 	"octagon",
// 	"nonagon",
// 	"decagon",
// 	"hendecagon",
// 	"dodecagon"
// ];
/**
 * create an array/object with only the keys and polygon names used below.
 */
// polygon_names
// 	.map((str, i) => str === undefined ? i : undefined)
// 	.filter(a => a !== undefined)
// 	.forEach(i => delete polygon_names[i]);
/**
 * fill the "Create" object with constructors under polygon-named keys.
 */
/**
 * @description make vertices_coords for a regular polygon,
 * centered at the origin and with side lengths of 1,
 * except for square, centered at [0.5, 0.5]
 * @param {number} number of sides of the desired regular polygon
 * @returns {number[][]} 2D vertices_coords, vertices of the polygon
 */
// polygon_names.forEach((name, i) => {
// 	Create[name] = () => make_closed_polygon(math.core
// 		.makePolygonSideLength(i));
// });
/**
 * special cases
 *
 * square and rectangle are axis-aligned with one vertex at (0, 0)
 * circle asks for # of sides, and also sets radius to be 1,
 *  instead of side-length to be 1.
 */
/**
 * @description Create a new FOLD object which contains one square face,
 * including vertices and boundary edges.
 * @param {number} [scale=1] the length of the sides.
 * @returns {FOLD} a FOLD object
 */
Create.square = (scale = 1) => (
	make_closed_polygon(make_rect_vertices_coords(scale, scale)));
/**
 * @description Create a new FOLD object which contains one rectangular face,
 * including vertices and boundary edges.
 * @param {number} [width=1] the width of the rectangle
 * @param {number} [height=1] the height of the rectangle
 * @returns {FOLD} a FOLD object
 */
Create.rectangle = (width = 1, height = 1) => (
	make_closed_polygon(make_rect_vertices_coords(width, height)));
/**
 * @description Create a new FOLD object with a regular-polygon shaped boundary.
 * @param {number} [sides=3] the number of sides to the polygon
 * @param {number} [radius=1] the circumradius
 * @returns {FOLD} a FOLD object
 */
Create.polygon = (sides = 3, radius = 1) => (
	make_closed_polygon(math.core.makePolygonCircumradius(sides, radius)));
// Create.circle = (sides = 90) =>
// 	make_closed_polygon(math.core.makePolygon(sides));
// origami bases. todo: more
/**
 * @description Create a kite base FOLD object, in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
Create.kite = () => populate({
	vertices_coords: [
		[0, 0], [Math.sqrt(2) - 1, 0], [1, 0], [1, 1 - (Math.sqrt(2) - 1)], [1, 1], [0, 1],
	],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
	edges_assignment: Array.from("BBBBBBVVF"),
});

/**
 * Rabbit Ear (c) Kraft
 */

// if we ever need to call any of these constructors from somewhere
// else inside the library (creating a circular dependency)
// move this line into a file "Constructors.js", and remove the
// export at the bottom. have all files point to "Constructors.js"
// instead, and all circular dependencies will be avoided.
const ObjectConstructors = Object.create(null);

const ConstructorPrototypes = {
	graph: GraphProto,
	cp: CreasePatternProto,
	origami: OrigamiProto,
};

const default_graph = {
	graph: () => {},
	cp: Create.square,
	origami: Create.square,
};

const CustomProperties = {
	graph: () => ({ file_spec, file_creator }),
	cp: () => ({ file_spec, file_creator, frame_classes: ["creasePattern"] }),
	origami: () => ({ file_spec, file_creator, frame_classes: ["foldedForm"] }),
};
/**
 * Calling the initializer also runs populate(), which does
 * take some computation time but it's very quick.
 */
Object.keys(ConstructorPrototypes).forEach(name => {
	ObjectConstructors[name] = function () {
		const argFolds = Array.from(arguments)
			.filter(a => isFoldObject(a))
			 // deep copy input graph
			.map(obj => JSON.parse(JSON.stringify(obj)));
		return populate(Object.assign(
			Object.create(ConstructorPrototypes[name]),
			(argFolds.length ? {} : default_graph[name]()),
			...argFolds,
			CustomProperties[name]()
		));
	};

// const graph = function () { return create("graph", arguments); };
// const cp = function () { return create("cp", arguments); };
// const origami = function () { return create("origami", arguments); };

	// tried to improve it. broke it.
	// ObjectConstructors[name] = function () {
	//   const certain = Array.from(arguments)
	//     .map(arg => ({ arg, certainty: isFoldObject(arg) }))
	//     .sort((a, b) => a.certainty - b.certainty);
	//   const fold = certain.length && certain[0].certainty > 0.1
	//     ? JSON.parse(JSON.stringify(certain.shift().arg))
	//     : default_graph[name]();
	//   console.log("FOLD", fold);
	//   // const otherArguments = certain
	//   //   .map(el => el.arg);
	//   // const argFold = Array.from(arguments)
	//   //   .map(arg => ({ arg, certainty: isFoldObject(arg) }))
	//   //   .sort((a, b) => a.certainty - b.certainty)
	//   //   .shift();
	//   // const start = argFold
	//   //   ? clone(argFold)
	//   //   : default_graph[name]()
	//   //   .map(obj => JSON.parse(JSON.stringify(obj)));
	//   return Object.assign(
	//     Object.create(ConstructorPrototypes[name]),
	//     // (argFolds.length ? {} : default_graph[name]()),
	//     fold,
	//     // ...otherArguments,
	//     { file_spec, file_creator }
	//   );
	// };
	ObjectConstructors[name].prototype = ConstructorPrototypes[name];
	ObjectConstructors[name].prototype.constructor = ObjectConstructors[name];
	// wrap static constructors with "this" initializer
	// all the polygon names
	Object.keys(Create).forEach(funcName => {
		ObjectConstructors[name][funcName] = function () {
			return ObjectConstructors[name](Create[funcName](...arguments));
		};
	});
});

Object.assign(ObjectConstructors.graph, graph_methods);

/**
 * Rabbit Ear (c) Kraft
 * this section contains code from Robert Lang's Reference Finder
 */
/*           _                       _              _
						(_)                     (_)            (_)
	 ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
	/ _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
	\___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
								__/ |
							 |___/
*/
const intersectionUD = (line1, line2) => {
	const det = math.core.cross2(line1.normal, line2.normal);
	if (Math.abs(det) < math.core.EPSILON) { return undefined; }
	const x = line1.distance * line2.normal[1] - line2.distance * line1.normal[1];
	const y = line2.distance * line1.normal[0] - line1.distance * line2.normal[0];
	return [x / det, y / det];
};
/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 27
 */
const normalAxiom1 = (point1, point2) => {
	const normal = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
	return {
		normal,
		distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0,
	};
};
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 41
 */
const normalAxiom2 = (point1, point2) => {
	const normal = math.core.normalize2(math.core.subtract2(point2, point1));
	return {
		normal,
		distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0,
	};
};
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {UniqueLine} line1 one 2D line in {vector, origin} form
 * @param {UniqueLine} line2 one 2D line in {vector, origin} form
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 56
 */
const normalAxiom3 = (line1, line2) => {
	// if no intersect, lines are parallel, only one solution exists
	const intersect = intersectionUD(line1, line2);
	return intersect === undefined
		? [{
			normal: line1.normal,
			distance: (line1.distance + line2.distance * math.core.dot2(line1.normal, line2.normal)) / 2,
		}]
		: [math.core.add2, math.core.subtract2]
			.map(f => math.core.normalize2(f(line1.normal, line2.normal)))
			.map(normal => ({ normal, distance: math.core.dot2(intersect, normal) }));
};
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {UniqueLine} line one 2D line in {normal, distance} form
 * @param {number[]} point one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 76
 */
const normalAxiom4 = (line, point) => {
	const normal = math.core.rotate90(line.normal);
	const distance = math.core.dot2(point, normal);
	return { normal, distance };
};
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {UniqueLine} line one 2D line in {normal, distance} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 90
 */
const normalAxiom5 = (line, point1, point2) => {
	const p1base = math.core.dot2(point1, line.normal);
	const a = line.distance - p1base;
	const c = math.core.distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = math.core.scale2(line.normal, a);
	const base_center = math.core.add2(point1, a_vec);
	const base_vector = math.core.scale2(math.core.rotate90(line.normal), b);
	// if b is near 0 we have one solution, otherwise two
	const mirrors = b < math.core.EPSILON
		? [base_center]
		: [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => math.core.normalize2(math.core.subtract2(point2, pt)))
		.map(normal => ({ normal, distance: math.core.dot2(point1, normal) }));
};

// cube root preserve sign
const cubrt = n => (n < 0
	? -Math.pow(-n, 1 / 3)
	: Math.pow(n, 1 / 3));

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
	case 1: return [-d / c];
	case 2: {
		// quadratic
		const discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
		// no solution
		if (discriminant < -math.core.EPSILON) { return []; }
		// one solution
		const q1 = -c / (2.0 * b);
		if (discriminant < math.core.EPSILON) { return [q1]; }
		// two solutions
		const q2 = Math.sqrt(discriminant) / (2.0 * b);
		return [q1 + q2, q1 - q2];
	}
	case 3: {
		// cubic
		// Cardano's formula. convert to depressed cubic
		const a2 = b / a;
		const a1 = c / a;
		const a0 = d / a;
		const q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
		const r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
		const d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
		const u = -a2 / 3.0;
		// one solution
		if (d0 > 0.0) {
			const sqrt_d0 = Math.sqrt(d0);
			const s = cubrt(r + sqrt_d0);
			const t = cubrt(r - sqrt_d0);
			return [u + s + t];
		}
		// two solutions
		if (Math.abs(d0) < math.core.EPSILON) {
			const s = Math.pow(r, 1.0 / 3.0);
			// const S = cubrt(R);
			// instead of checking if S is NaN, check if R was negative
			// if (isNaN(S)) { break; }
			if (r < 0.0) { return []; }
			return [u + 2.0 * s, u - s];
		}
		// three solutions
		const sqrt_d0 = Math.sqrt(-d0);
		const phi = Math.atan2(sqrt_d0, r) / 3.0;
		const r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0 / 6.0);
		const s_r = r_s * Math.cos(phi);
		const s_i = r_s * Math.sin(phi);
		return [
			u + 2.0 * s_r,
			u - s_r - Math.sqrt(3.0) * s_i,
			u - s_r + Math.sqrt(3.0) * s_i,
		];
	}
	default: return [];
	}
};
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {UniqueLine} line1 one 2D line in {normal, distance} form
 * @param {UniqueLine} line2 one 2D line in {normal, distance} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 181
 */
const normalAxiom6 = (line1, line2, point1, point2) => {
	// at least pointA must not be on lineA
	// for some reason this epsilon is much higher than 1e-6
	if (Math.abs(1.0 - (math.core.dot2(line1.normal, point1) / line1.distance)) < 0.02) { return []; }
	// line vec is the first line's vector, along the line, not the normal
	const line_vec = math.core.rotate90(line1.normal);
	const vec1 = math.core.subtract2(
		math.core.add2(point1, math.core.scale2(line1.normal, line1.distance)),
		math.core.scale2(point2, 2.0),
	);
	const vec2 = math.core.subtract2(math.core.scale2(line1.normal, line1.distance), point1);
	const c1 = math.core.dot2(point2, line2.normal) - line2.distance;
	const c2 = 2.0 * math.core.dot2(vec2, line_vec);
	const c3 = math.core.dot2(vec2, vec2);
	const c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
	const c5 = math.core.dot2(vec1, vec2);
	const c6 = math.core.dot2(line_vec, line2.normal);
	const c7 = math.core.dot2(vec2, line2.normal);
	const a = c6;
	const b = c1 + c4 * c6 + c7;
	const c = c1 * c2 + c5 * c6 + c4 * c7;
	const d = c1 * c3 + c5 * c7;
	// construct the solution from the root, the solution being the parameter
	// point reflected across the fold line, lying on the parameter line
	let polynomial_degree = 0;
	if (Math.abs(c) > math.core.EPSILON) { polynomial_degree = 1; }
	if (Math.abs(b) > math.core.EPSILON) { polynomial_degree = 2; }
	if (Math.abs(a) > math.core.EPSILON) { polynomial_degree = 3; }
	return polynomial(polynomial_degree, a, b, c, d)
		.map(n => math.core.add2(
			math.core.scale2(line1.normal, line1.distance),
			math.core.scale2(line_vec, n),
		))
		.map(p => ({ p, normal: math.core.normalize2(math.core.subtract2(p, point1)) }))
		.map(el => ({
			normal: el.normal,
			distance: math.core.dot2(el.normal, math.core.midpoint2(el.p, point1)),
		}));
};
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {UniqueLine} line1 one 2D line in {normal, distance} form,
 * the line the point will be brought onto.
 * @param {UniqueLine} line2 one 2D line in {normal, distance} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {UniqueLine | undefined} the line in {normal, distance} form
 * or undefined if the given lines are parallel
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 232
 */
const normalAxiom7 = (line1, line2, point) => {
	const normal = math.core.rotate90(line1.normal);
	const norm_norm = math.core.dot2(normal, line2.normal);
	// if norm_norm is close to 0, the two input lines are parallel, no solution
	if (Math.abs(norm_norm) < math.core.EPSILON) { return undefined; }
	const a = math.core.dot2(point, normal);
	const b = math.core.dot2(point, line2.normal);
	const distance = (line2.distance + 2.0 * a * norm_norm - b) / (2.0 * norm_norm);
	return { normal, distance };
};

var AxiomsND = /*#__PURE__*/Object.freeze({
	__proto__: null,
	normalAxiom1: normalAxiom1,
	normalAxiom2: normalAxiom2,
	normalAxiom3: normalAxiom3,
	normalAxiom4: normalAxiom4,
	normalAxiom5: normalAxiom5,
	normalAxiom6: normalAxiom6,
	normalAxiom7: normalAxiom7
});

/**
 * Rabbit Ear (c) Kraft
 */
/*           _                       _              _
						(_)                     (_)            (_)
	 ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
	/ _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
	\___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
								__/ |
							 |___/
/**
 * these origami axioms assume 2D geometry in the 2D plane,
 * where points are parameterized as vectors (Javascript arrays of numbers)
 * and lines are in vector-origin form (Javascript objects with "origin" and "vector")
 *   (themselves are Javascript Arrays, same as "points")
 * where the direction of the vector is along the line, and
 * is not necessarily normalized.
 */

/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 28
 */
const axiom1 = (point1, point2) => ({
	vector: math.core.normalize2(math.core.subtract2(...math.core.resizeUp(point2, point1))),
	origin: point1,
});
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 39
 */
const axiom2 = (point1, point2) => ({
	vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
		...math.core.resizeUp(point2, point1),
	))),
	origin: math.core.midpoint2(point1, point2),
});
// todo: make sure these all get a resizeUp or whatever is necessary
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {RayLine} line1 one 2D line in {vector, origin} form
 * @param {RayLine} line2 one 2D line in {vector, origin} form
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 54
 */
const axiom3 = (line1, line2) => math.core
	.bisectLines2(line1.vector, line1.origin, line2.vector, line2.origin);
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {RayLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 64
 */
const axiom4 = (line, point) => ({
	vector: math.core.rotate90(math.core.normalize2(line.vector)),
	origin: point,
});
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {RayLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 77
 */
const axiom5 = (line, point1, point2) => (
	math.core.intersectCircleLine(
		math.core.distance2(point1, point2),
		point1,
		line.vector,
		line.origin,
		math.core.include_l,
	) || []).map(sect => ({
	vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
		...math.core.resizeUp(sect, point2),
	))),
	origin: math.core.midpoint2(point2, sect),
}));
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {RayLine} line1 one 2D line in {vector, origin} form
 * @param {RayLine} line2 one 2D line in {vector, origin} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 100
 */
const axiom6 = (line1, line2, point1, point2) => normalAxiom6(
	math.core.rayLineToUniqueLine(line1),
	math.core.rayLineToUniqueLine(line2),
	point1,
	point2,
).map(math.core.uniqueLineToRayLine);
// .map(Constructors.line);
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {RayLine} line1 one 2D line in {vector, origin} form,
 * the line the point will be brought onto.
 * @param {RayLine} line2 one 2D line in {vector, origin} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {RayLine | undefined} the line in {vector, origin} form
 * or undefined if the given lines are parallel
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 119
 */
const axiom7 = (line1, line2, point) => {
	const intersect = math.core.intersectLineLine(
		line1.vector,
		line1.origin,
		line2.vector,
		point,
		math.core.include_l,
		math.core.include_l,
	);
	return intersect === undefined
		? undefined
		: ({
		// todo: switch this out, but test it as you do
			vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
				...math.core.resizeUp(intersect, point),
			))),
			// vector: math.core.normalize2(math.core.rotate90(line2.vector)),
			origin: math.core.midpoint2(point, intersect),
		});
};

var AxiomsVO = /*#__PURE__*/Object.freeze({
	__proto__: null,
	axiom1: axiom1,
	axiom2: axiom2,
	axiom3: axiom3,
	axiom4: axiom4,
	axiom5: axiom5,
	axiom6: axiom6,
	axiom7: axiom7
});

/**
 * @description The core axiom methods return arrays for *some* of the axioms.
 * Standardize the output so that all of them are inside arrays.
 * @param {number} the axiom number
 * @param {Line|Line[]} the solutions from having run the axiom method
 * @returns {Line[]} the solution lines, now consistently inside an array.
 */
const arrayify = (axiomNumber, solutions) => {
	switch (axiomNumber) {
	case 3: case "3":
	case 5: case "5":
	case 6: case "6": return solutions;
	// 7 is the only axiom which can return a single undefined (not in an array)
	case 7: case "7": return solutions === undefined ? [] : [solutions];
	default: return [solutions];
	}
};
/**
 * @description convert an array of solutions into the original state,
 * which means for axiom 3, 5, 6 it remains an array,
 * and for 1, 2, 4, 7 the first (only) element is returned.
 */
const unarrayify = (axiomNumber, solutions) => {
	switch (axiomNumber) {
	case 3: case "3":
	case 5: case "5":
	case 6: case "6": return solutions;
	default: return solutions ? solutions[0] : undefined;
	}
};

/**
 * Rabbit Ear (c) Kraft
 */

const reflectPoint = (foldLine, point) => {
	const matrix = math.core.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return math.core.multiplyMatrix2Vector2(matrix, point);
};
/**
 * @description To validate axiom 1 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 17
 */
const validateAxiom1 = (params, boundary) => params.points
	.map(p => math.core.overlapConvexPolygonPoint(boundary, p, math.core.include))
	.reduce((a, b) => a && b, true);
/**
 * @description To validate axiom 2 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 28
 */
const validateAxiom2 = validateAxiom1;
/**
 * @description Validate axiom 3.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 37
 */
const validateAxiom3 = (params, boundary, results) => {
	const segments = params.lines
		.map(line => math.core.clipLineConvexPolygon(boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.includeL));
	// if line parameters lie outside polygon, no solution possible
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	// test A:
	// make sure the results themselves lie in the polygon
	// exclusive! an exterior line collinear to polygon's point is excluded
	// const results_clip = results
	//   .map(line => line === undefined ? undefined : math.core
	//     .intersectConvexPolygonLine(
	//       boundary,
	//       line.vector,
	//       line.origin,
	//       math.core.includeS,
	//       math.core.excludeL));
	const results_clip = results.map(line => (line === undefined
		? undefined
		: math.core.clipLineConvexPolygon(
			boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.includeL,
		)));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	// test B:
	// make sure that for each of the results, the result lies between two
	// of the parameters, in other words, reflect the segment 0 both ways
	// (both fold solutions) and make sure there is overlap with segment 1
	const seg0Reflect = results.map(foldLine => (foldLine === undefined
		? undefined
		: [
			reflectPoint(foldLine, segments[0][0]),
			reflectPoint(foldLine, segments[0][1]),
		]));
	const reflectMatch = seg0Reflect.map(seg => (seg === undefined
		? false
		: (math.core.overlapLinePoint(
			math.core.subtract(segments[1][1], segments[1][0]),
			segments[1][0],
			seg[0],
			math.core.includeS,
		)
		|| math.core.overlapLinePoint(
			math.core.subtract(segments[1][1], segments[1][0]),
			segments[1][0],
			seg[1],
			math.core.includeS,
		)
		|| math.core.overlapLinePoint(
			math.core.subtract(seg[1], seg[0]),
			seg[0],
			segments[1][0],
			math.core.includeS,
		)
		|| math.core.overlapLinePoint(
			math.core.subtract(seg[1], seg[0]),
			seg[0],
			segments[1][1],
			math.core.includeS,
		))));
	// valid if A and B
	return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};
/**
 * @description To validate axiom 4 check if the input point lies within
 * the boundary and the intersection between the solution line and the
 * input line lies within the boundary.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 117
 */
const validateAxiom4 = (params, boundary) => {
	const intersect = math.core.intersectLineLine(
		params.lines[0].vector,
		params.lines[0].origin,
		math.core.rotate90(params.lines[0].vector),
		params.points[0],
		math.core.includeL,
		math.core.includeL,
	);
	return [params.points[0], intersect]
		.filter(a => a !== undefined)
		.map(p => math.core.overlapConvexPolygonPoint(boundary, p, math.core.include))
		.reduce((a, b) => a && b, true);
};
/**
 * @description Validate axiom 5.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 139
 */
const validateAxiom5 = (params, boundary, results) => {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	const testReflections = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	return testReflections.map(ref => ref && testParamPoints);
};
/**
 * @description Validate axiom 6.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 157
 */
const validateAxiom6 = function (params, boundary, results) {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return results.map(() => false); }
	const testReflect0 = results
		.map(foldLine => reflectPoint(foldLine, params.points[0]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	const testReflect1 = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};
/**
 * @description Validate axiom 7.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 178
 */
const validateAxiom7 = (params, boundary, result) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = math.core
		.overlapConvexPolygonPoint(boundary, params.points[0], math.core.include);
	// check if the reflected point on the fold line is inside the polygon
	if (result === undefined) { return [false]; }
	const reflected = reflectPoint(result, params.points[0]);
	const reflectTest = math.core.overlapConvexPolygonPoint(boundary, reflected, math.core.include);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (math.core.intersectConvexPolygonLine(
		boundary,
		params.lines[1].vector,
		params.lines[1].origin,
		math.core.includeS,
		math.core.includeL,
	) !== undefined);
	// same test we do for axiom 4
	const intersect = math.core.intersectLineLine(
		params.lines[1].vector,
		params.lines[1].origin,
		result.vector,
		result.origin,
		math.core.includeL,
		math.core.includeL,
	);
	const intersectInsideTest = intersect
		? math.core.overlapConvexPolygonPoint(boundary, intersect, math.core.include)
		: false;
	return paramPointTest && reflectTest && paramLineTest && intersectInsideTest;
};
/**
 * @description Validate an axiom, this will run one of the submethods ("validateAxiom1", ...).
 * @param {number} number the axiom number, 1-7
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean|boolean[]} for every solution, true if valid. Axioms 1, 2, 4, 7
 * return one boolean, 3, 5, 6 return arrays of booleans.
 * @linkcode Origami ./src/axioms/validate.js 218
 */
const validate = (number, params, boundary, results) => arrayify(number, [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](params, boundary, unarrayify(number, results)));

var Validate = /*#__PURE__*/Object.freeze({
	__proto__: null,
	validateAxiom1: validateAxiom1,
	validateAxiom2: validateAxiom2,
	validateAxiom3: validateAxiom3,
	validateAxiom4: validateAxiom4,
	validateAxiom5: validateAxiom5,
	validateAxiom6: validateAxiom6,
	validateAxiom7: validateAxiom7,
	validate: validate
});

const paramsVecsToNorms = (params) => ({
	points: params.points,
	lines: params.lines.map(math.core.uniqueLineToRayLine),
});
/**
 * @description All axiom method arguments are ordered such that all lines are
 * listed first, followed by all points. convert the axiom params object
 * (with "points", "lines" keys) into a single flat array
 */
const spreadParams = (params) => {
	const lines = params.lines ? params.lines : [];
	const points = params.points ? params.points : [];
	return [...lines, ...points];
};
/**
 * @description Perform one of the seven origami axioms, and provide a boundary so that
 * only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are only {RayLine} lines.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/axiomsInBoundary.js 30
 */
const axiomInBoundary = (number, params = {}, boundary) => {
	const solutions = arrayify(
		number,
		AxiomsVO[`axiom${number}`](...spreadParams(params)),
	).map(l => math.line(l));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](params, boundary, solutions))
			.forEach((valid, i) => (valid ? i : undefined))
			.filter(a => a !== undefined)
			.forEach(i => delete solutions[i]);
	}
	return solutions;
};
/**
 * @description Perform one of the seven origami axioms, and provide a boundary so that
 * only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are only {UniqueLine} lines.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {UniqueLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/axiomsInBoundary.js 54
 */
const normalAxiomInBoundary = (number, params = {}, boundary) => {
	const solutions = arrayify(
		number,
		AxiomsND[`normalAxiom${number}`](...spreadParams(params)),
	).map(l => math.line.fromNormalDistance(l));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](paramsVecsToNorms(params), boundary, solutions))
			.forEach((valid, i) => (valid ? i : undefined))
			.filter(a => a !== undefined)
			.forEach(i => delete solutions[i]);
	}
	return solutions;
};

var BoundaryAxioms = /*#__PURE__*/Object.freeze({
	__proto__: null,
	axiomInBoundary: axiomInBoundary,
	normalAxiomInBoundary: normalAxiomInBoundary
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Perform one of the seven origami axioms. Supply an optional boundary
 * so that only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are either {RayLine} or {UniqueLine}.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/index.js 17
 */
const axiom = (number, params = {}, boundary) => axiomInBoundary(number, params, boundary);

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsND).forEach(key => { axiom[key] = AxiomsND[key]; });
Object.keys(BoundaryAxioms).forEach(key => { axiom[key] = BoundaryAxioms[key]; });
Object.keys(Validate).forEach(key => { axiom[key] = Validate[key]; });

/**
 * Rabbit Ear (c) Kraft
 */

const line_line_for_arrows = (a, b) => math.core.intersectLineLine(
	a.vector,
	a.origin,
	b.vector,
	b.origin,
	math.core.includeL,
	math.core.includeL,
);

const diagram_reflect_point = (foldLine, point) => {
	const matrix = math.core.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return math.core.multiplyMatrix2Vector2(matrix, point);
};

const boundary_for_arrows$1 = ({ vertices_coords }) => math.core
	.convexHull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows$1(graph);
	if (point === undefined) {
		const foldSegment = math.core.clipLineConvexPolygon(
			boundary,
			foldLine.vector,
			foldLine.origin,
			math.core.exclude,
			math.core.includeL,
		);
		point = math.core.midpoint(...foldSegment);
	}
	const perpVector = math.core.rotate270(foldLine.vector);
	const smallest = math.core
		.clipLineConvexPolygon(
			boundary,
			perpVector,
			point,
			math.core.exclude,
			math.core.includeL,
		).map(pt => math.core.distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
	return math.segment(
		math.core.add(point, math.core.flip(scaled)),
		math.core.add(point, scaled),
	);
};
/**
 * like in axiom 3 when two segments don't intersect and the fold
 * line lies exactly between them
 */
const between_2_segments = (params, segments, foldLine) => {
	const midpoints = segments
		.map(seg => math.core.midpoint(seg[0], seg[1]));
	const midpointLine = math.line.fromPoints(...midpoints);
	const origin = math.intersect(foldLine, midpointLine);
	const perpLine = math.line(foldLine.vector.rotate90(), origin);
	return math.segment(params.lines.map(line => math.intersect(line, perpLine)));
};

const between_2_intersecting_segments = (params, intersect, foldLine, boundary) => {
	const paramVectors = params.lines.map(l => l.vector);
	const flippedVectors = paramVectors.map(math.core.flip);
	const paramRays = paramVectors
		.concat(flippedVectors)
		.map(vec => math.ray(vec, intersect));
	// 4 points based on quadrants
	const a1 = paramRays.filter(ray => (
		math.core.dot(ray.vector, foldLine.vector) > 0
		&& math.core.cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const a2 = paramRays.filter(ray => (
		math.core.dot(ray.vector, foldLine.vector) > 0
		&& math.core.cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const b1 = paramRays.filter(ray => (
		math.core.dot(ray.vector, foldLine.vector) < 0
		&& math.core.cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const b2 = paramRays.filter(ray => (
		math.core.dot(ray.vector, foldLine.vector) < 0
		&& math.core.cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const rayEndpoints = [a1, a2, b1, b2]
		.map(ray => math.core.intersectConvexPolygonLine(
			boundary,
			ray.vector,
			ray.origin,
			math.core.excludeS,
			math.core.excludeR,
		).shift()
			.shift());
	const rayLengths = rayEndpoints
		.map(pt => math.core.distance(pt, intersect));
	const arrowStart = (rayLengths[0] < rayLengths[1]
		? rayEndpoints[0]
		: rayEndpoints[1]);
	const arrowEnd = (rayLengths[0] < rayLengths[1]
		? math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]))
		: math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1])));
	const arrowStart2 = (rayLengths[2] < rayLengths[3]
		? rayEndpoints[2]
		: rayEndpoints[3]);
	const arrowEnd2 = (rayLengths[2] < rayLengths[3]
		? math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]))
		: math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3])));
	return [
		math.segment(arrowStart, arrowEnd),
		math.segment(arrowStart2, arrowEnd2),
	];
};

const axiom_1_arrows = (params, graph) => axiom(1, params)
	.map(foldLine => [widest_perp(graph, foldLine)]);

const axiom_2_arrows = params => [
	[math.segment(params.points)],
];

const axiom_3_arrows = (params, graph) => {
	const boundary = boundary_for_arrows$1(graph);
	const segs = params.lines.map(l => math.core
		.clipLineConvexPolygon(
			boundary,
			l.vector,
			l.origin,
			math.core.exclude,
			math.core.includeL,
		));
	const segVecs = segs.map(seg => math.core.subtract(seg[1], seg[0]));
	const intersect = math.core.intersectLineLine(
		segVecs[0],
		segs[0][0],
		segVecs[1],
		segs[1][0],
		math.core.excludeS,
		math.core.excludeS,
	);
	return !intersect
		? [between_2_segments(params, segs, axiom(3, params)
			.filter(a => a !== undefined).shift())]
		: axiom(3, params).map(foldLine => between_2_intersecting_segments(
			params,
			intersect,
			foldLine,
			boundary,
		));
};

const axiom_4_arrows = (params, graph) => axiom(4, params)
	.map(foldLine => [widest_perp(
		graph,
		foldLine,
		line_line_for_arrows(foldLine, params.lines[0]),
	)]);

const axiom_5_arrows = (params) => axiom(5, params)
	.map(foldLine => [math.segment(
		params.points[1],
		diagram_reflect_point(foldLine, params.points[1]),
	)]);

const axiom_6_arrows = (params) => axiom(6, params)
	.map(foldLine => params.points
		.map(pt => math.segment(pt, diagram_reflect_point(foldLine, pt))));

const axiom_7_arrows = (params, graph) => axiom(7, params)
	.map(foldLine => [
		math.segment(params.points[0], diagram_reflect_point(foldLine, params.points[0])),
		widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1])),
	]);

const arrow_functions = [null,
	axiom_1_arrows,
	axiom_2_arrows,
	axiom_3_arrows,
	axiom_4_arrows,
	axiom_5_arrows,
	axiom_6_arrows,
	axiom_7_arrows,
];

delete arrow_functions[0];

const axiomArrows = (number, params = {}, ...args) => {
	const points = params.points
		? params.points.map(p => math.core.getVector(p))
		: undefined;
	const lines = params.lines
		? params.lines.map(l => math.core.getLine(l))
		: undefined;
	return arrow_functions[number]({ points, lines }, ...args);
};

Object.keys(arrow_functions).forEach(number => {
	axiomArrows[number] = (...args) => axiomArrows(number, ...args);
});

/**
 * Rabbit Ear (c) Kraft
 */

const boundary_for_arrows = ({ vertices_coords }) => math.core
	.convexHull(vertices_coords);

const widest_perpendicular = (polygon, foldLine, point) => {
	if (point === undefined) {
		const foldSegment = math.core.clipLineConvexPolygon(
			polygon,
			foldLine.vector,
			foldLine.origin,
			math.core.exclude,
			math.core.includeL,
		);
		if (foldSegment === undefined) { return; }
		point = math.core.midpoint(...foldSegment);
	}
	const perpVector = math.core.rotate90(foldLine.vector);
	const smallest = math.core
		.clipLineConvexPolygon(
			polygon,
			perpVector,
			point,
			math.core.exclude,
			math.core.includeL,
		)
		.map(pt => math.core.distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
	return math.segment(
		math.core.add(point, math.core.flip(scaled)),
		math.core.add(point, scaled)
	);
};
/**
 * @description given an origami model and a fold line, without knowing
 * any of the parameters that determined the fold line, find an arrow
 * that best fits the origami as a diagram step.
 * @param {object} graph a FOLD object
 * @param {object} a line specifying the crease.
 * @returns {SVGElement} one SVG element containing an arrow that matches
 * the dimensions of the FOLD graph.
 */
const simpleArrow = (graph, line) => {
	const hull = boundary_for_arrows(graph);
	const box = math.core.boundingBox(hull);
	const segment = widest_perpendicular(hull, line);
	if (segment === undefined) { return undefined; }
	const vector = math.core.subtract(segment[1], segment[0]);
	const length = math.core.magnitude(vector);
	const direction = math.core.dot(vector, [1, 0]);
	const vmin = box.span[0] < box.span[1] ? box.span[0] : box.span[1];

	segment.head = {
		width: vmin * 0.1,
		height: vmin * 0.15,
	};
	segment.bend = direction > 0 ? 0.3 : -0.3;
	segment.padding = length * 0.05;
	return segment;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description A collection of methods for drawing origami diagrams.
 */
var diagram = Object.assign(
	Object.create(null),
	// arrows, {
	{
		axiom_arrows: axiomArrows,
		simple_arrow: simpleArrow,
	},
);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description makeTortillaTortillaEdgesCrossing
 * @param {object} graph a FOLD object graph
 * @param {todo} todo todo
 * @param {number} [epsilon=1e-6] optional epsilon value
 * @returns todo
 */
const makeTortillaTortillaEdgesCrossing = (graph, edges_faces_side, epsilon) => {
	// get all tortilla edges. could also be done by searching
	// "edges_assignment" for all instances of F/f. perhaps this way is better.
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => bool ? i : undefined)
		.filter(a => a !== undefined);
	// get all edges which cross these tortilla edges. these edges can even be
	// boundary edges, it doesn't matter how many adjacent faces they have.
	const edges_crossing_matrix = makeEdgesEdgesCrossing(graph, epsilon);
	const edges_crossing = booleanMatrixToIndexedArray(edges_crossing_matrix);
	// parallel arrays. tortilla_edge_indices contains the edge index.
	// tortilla_edges_crossing contains an array of the crossing edge indices.
	const tortilla_edges_crossing = tortilla_edge_indices
		.map(i => edges_crossing[i]);
	// combine parallel arrays into one object.
	// tortilla_edge is a number. crossing_edges is an array of numbers.
	return tortilla_edges_crossing.map((edges, i) => ({
		tortilla_edge: tortilla_edge_indices[i],
		crossing_edges: edges,
	})).filter(el => el.crossing_edges.length);
};

const makeTortillasFacesCrossing = (graph, edges_faces_side, epsilon) => {
	const faces_winding = makeFacesWinding(graph);
	const faces_polygon = makeFacesPolygon(graph, epsilon);
	for (let i = 0; i < faces_polygon.length; i++) {
		if (!faces_winding[i]) { faces_polygon[i].reverse(); }
	}
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => bool ? i : undefined)
		.filter(a => a !== undefined);
	const edges_coords = tortilla_edge_indices
		.map(e => graph.edges_vertices[e])
		.map(edge => edge
			.map(vertex => graph.vertices_coords[vertex]));
	const edges_vector = edges_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));
	const matrix = [];
	tortilla_edge_indices.forEach(e => { matrix[e] = []; });
	// console.log("clip", tortilla_edge_indices
		// .map((e, ei) => faces_polygon
		// 	.map((poly, f) => math.core.clipLineConvexPolygon(
		// 		poly,
		// 		edges_vector[ei],
		// 		edges_coords[ei][0],
		// 		math.core.exclude,
		// 		math.core.excludeS,
		// 		epsilon))));
	const result = tortilla_edge_indices
		.map((e, ei) => faces_polygon
			.map((poly, f) => math.core.clipLineConvexPolygon(
				poly,
				edges_vector[ei],
				edges_coords[ei][0],
				math.core.exclude,
				math.core.excludeS,
				epsilon))
			.map((result, f) => result !== undefined));
	// const result = tortilla_edge_indices
	// 	.map((e, ei) => faces_polygon
	// 		.map((poly, f) => math.core.intersectConvexPolygonLine(
	// 			poly,
	// 			edges_vector[ei],
	// 			edges_coords[ei][0],
	// 			math.core.excludeS,
	// 			math.core.includeL ))
	// 			// epsilon))
	// 		.map((result, f) => result !== undefined));
	result.forEach((faces, ei) => faces
		.forEach((overlap, f) => {
			if (overlap) {
				matrix[tortilla_edge_indices[ei]].push(f);
			}
		}));
	// console.log("faces_polygon", faces_polygon);
	// console.log("tortilla_edge_indices", tortilla_edge_indices);
	// console.log("edges_coords", edges_coords);
	// console.log("edges_vector", edges_vector);
	// console.log("result", result);
	// console.log("matrix", matrix);
	return matrix;
};

const makeTortillaTortillaFacesCrossing = (graph, edges_faces_side, epsilon) => {
	makeTortillaTortillaEdgesCrossing(graph, edges_faces_side, epsilon);
	// console.log("tortilla_tortilla_edges", tortilla_tortilla_edges);
	const tortillas_faces_crossing = makeTortillasFacesCrossing(graph, edges_faces_side, epsilon);
	const tortilla_faces_results = tortillas_faces_crossing
		.map((faces, e) => faces.map(face => [graph.edges_faces[e], [face, face]]))
		.reduce((a, b) => a.concat(b), []);

	// const tortilla_tortilla_results = tortilla_tortilla_edges
	// 	.map(el => ({
	// 		tortilla_faces: graph.edges_faces[el.tortilla_edge],
	// 		crossing_faces: el.crossing_edges.map(edge => graph.edges_faces[edge]),
	// 	}))
	// 	.map(el => el.crossing_faces
	// 		// note, adjacent_faces could be singular in the case of a boundary edge,
	// 		// and this is still valid.
	// 		.map(adjacent_faces => adjacent_faces
	// 			.map(face => [el.tortilla_faces, [face, face]]))
	// 		.reduce((a, b) => a.concat(b), []))
	// 	.reduce((a, b) => a.concat(b), []);
	// console.log("tortillas_faces_crossing", tortillas_faces_crossing);
	// console.log("tortilla_tortilla_results", tortilla_tortilla_results);
	// console.log("tortilla_faces_results", tortilla_faces_results);
	// return tortilla_tortilla_results;
	return tortilla_faces_results;
};

var tortillaTortilla = /*#__PURE__*/Object.freeze({
	__proto__: null,
	makeTortillaTortillaEdgesCrossing: makeTortillaTortillaEdgesCrossing,
	makeTortillasFacesCrossing: makeTortillasFacesCrossing,
	makeTortillaTortillaFacesCrossing: makeTortillaTortillaFacesCrossing
});

/**
 * Rabbit Ear (c) Kraft
 */

const makeEdgesFacesSide = (graph, faces_center) => {
	const edges_origin = graph.edges_vertices
		.map(vertices => graph.vertices_coords[vertices[0]]);
	const edges_vector = graph.edges_vertices
		.map(vertices => math.core.subtract2(
			graph.vertices_coords[vertices[1]],
			graph.vertices_coords[vertices[0]],
		));
	return graph.edges_faces
		.map((faces, i) => faces
			.map(face => math.core.cross2(
				math.core.subtract2(
					faces_center[face],
					edges_origin[i]),
					edges_vector[i]))
			.map(cross => Math.sign(cross)));
};
/**
 * @description having already pre-computed a the tacos in the form of
 * edges and the edges' adjacent faces, give each face a +1 or -1 based
 * on which side of the edge it is on. "side" determined by the cross-
 * product against the edge's vector.
 */
const makeTacosFacesSide = (graph, faces_center, tacos_edges, tacos_faces) => {
	// there are two edges involved in a taco, grab the first one.
	// we have to use the same origin/vector so that the face-sidedness is
	// consistent globally, not local to its edge.
	const tacos_edge_coords = tacos_edges
		.map(edges => graph.edges_vertices[edges[0]]
			.map(vertex => graph.vertices_coords[vertex]));
	const tacos_edge_origin = tacos_edge_coords
		.map(coords => coords[0]);
	const tacos_edge_vector = tacos_edge_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));

	const tacos_faces_center = tacos_faces
		.map(faces => faces
			.map(face_pair => face_pair
				.map(face => faces_center[face])));

	return tacos_faces_center
		.map((faces, i) => faces
			.map(pairs => pairs
				.map(center => math.core.cross2(
					math.core.subtract2(
						center,
						tacos_edge_origin[i]),
						tacos_edge_vector[i]))
				.map(cross => Math.sign(cross))));
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description classify a pair of adjacent faces encoded as +1 or -1
 * depending on which side they are on into one of 3 types:
 * - "both": tortilla (faces lie on both sides of the edge)
 * - "left": a taco facing left
 * - "right": a taco facing right
 */
const classify_faces_pair = (pair) => {
	if ((pair[0] === 1 && pair[1] === -1) ||
		(pair[0] === -1 && pair[1] === 1)) {
		return "both";
	}
	if ((pair[0] === 1 && pair[1] === 1)) { return "right"; }
	if ((pair[0] === -1 && pair[1] === -1)) { return "left"; }
};

// pairs of tacos are valid taco-taco if they are both "left" or "right".
const is_taco_taco = (classes) => {
	return classes[0] === classes[1] && classes[0] !== "both";
};

// pairs of tortillas are valid tortillas if both of them are "both".
const is_tortilla_tortilla = (classes) => {
	return classes[0] === classes[1] && classes[0] === "both";
};

// pairs of face-pairs are valid taco-tortillas if one is "both" (tortilla)
// and the other is either a "left" or "right" taco.
const is_taco_tortilla = (classes) => {
	return classes[0] !== classes[1]
		&& (classes[0] === "both" || classes[1] === "both");
};
/**
 * @description this kind of taco-tortilla is edge-aligned with a tortilla
 * that is made of two faces. there are 4 faces involved, we only need 3.
 * given the direction of the taco ("left" or "right"), get the similarly-
 * facing side of the tortilla and return this along with the taco.
 */
const make_taco_tortilla = (face_pairs, types, faces_side) => {
	const direction = types[0] === "left" || types[1] === "left" ? -1 : 1;
	// deep copy these objects. ensures that no arrays share pointers.
	const taco = types[0] === "both" ? [...face_pairs[1]] : [...face_pairs[0]];
	// get only one side of the tortilla
	const index = types[0] === "both" ? 0 : 1;
	const tortilla = faces_side[index][0] === direction
		? face_pairs[index][0]
		: face_pairs[index][1];
	return { taco, tortilla };
};
const make_tortilla_tortilla = (face_pairs, tortillas_sides) => {
	if (face_pairs === undefined) { return undefined; }
	return (tortillas_sides[0][0] === tortillas_sides[1][0])
		? face_pairs
		: [face_pairs[0], [face_pairs[1][1], face_pairs[1][0]]];
};
/**
 * @description given a FOLD object, find all instances of edges overlapping which
 * classify as taco/tortillas to determine layer order.
 * @param {object} a FOLD graph. vertices_coords should already be folded.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {object} an object containing keys: taco_taco, tortilla_tortilla, taco_tortilla
 *
 * due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
 */
const makeTacosTortillas = (graph, epsilon = math.core.EPSILON) => {
	// given a graph which is already in its folded state,
	// find which edges are tacos, or in other words, find out which
	// edges overlap with another edge.
	const faces_center = makeFacesCenter(graph);
	const edges_faces_side = makeEdgesFacesSide(graph, faces_center);
	// for every edge, find all other edges which are parallel to this edge and
	// overlap the edge, excluding the epsilon space around the endpoints.
	const edge_edge_overlap_matrix = makeEdgesEdgesParallelOverlap(graph, epsilon);
	// convert this matrix into unique pairs ([4, 9] but not [9, 4])
	// thse pairs are also sorted such that the smaller index is first.
	const tacos_edges = booleanMatrixToUniqueIndexPairs(edge_edge_overlap_matrix)
		.filter(pair => pair
			.map(edge => graph.edges_faces[edge].length > 1)
			.reduce((a, b) => a && b, true));
	const tacos_faces = tacos_edges
		.map(pair => pair
			.map(edge => graph.edges_faces[edge]));
	// convert every face into a +1 or -1 based on which side of the edge is it on.
	// ie: tacos will have similar numbers, tortillas will have one of either.
	// the +1/-1 is determined by the cross product to the vector of the edge.
	const tacos_faces_side = makeTacosFacesSide(graph, faces_center, tacos_edges, tacos_faces);
	// each pair of faces is either a "left" or "right" (taco) or "both" (tortilla).
	const tacos_types = tacos_faces_side
		.map((faces, i) => faces
			.map(classify_faces_pair));
	// this completes taco-taco, however both tortilla-tortilla and taco-tortilla
	// has two varieties.
	// tortilla-tortilla has both (1) edge-aligned tortillas where 4 unique faces
	// are involved, and (2) the case where an edge crosses one tortilla, where
	// only 3 faces are involved.
	// taco-tortilla: (1) those tacos which are edge-aligned with another
	// tortilla-tortilla, and (2) those tacos which simply cross through the
	// middle of a face. this completes taco-tortilla (1).
	const taco_taco = tacos_types
		.map((pair, i) => is_taco_taco(pair) ? tacos_faces[i] : undefined)
		.filter(a => a !== undefined);
	// tortilla-tortilla contains one additional required ordering:
	// [a,b], [c,d] means a and b are connected, and c and d are connected,
	// additionally, a is above/below c and b is above/below d.
	// get the first of the two tacos_edges, use this as the origin/vector.
	// recompute the face-sidedness using these. see: make_tortilla_tortilla.
	const tortilla_tortilla_aligned = tacos_types
		.map((pair, i) => is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined)
		.map((pair, i) => make_tortilla_tortilla(pair, tacos_faces_side[i]))
		.filter(a => a !== undefined);
	const tortilla_tortilla_crossing = makeTortillaTortillaFacesCrossing(graph, edges_faces_side, epsilon);
	// console.log("tortilla_tortilla_aligned", tortilla_tortilla_aligned);
	// console.log("tortilla_tortilla_crossing", tortilla_tortilla_crossing);
	const tortilla_tortilla = tortilla_tortilla_aligned
		.concat(tortilla_tortilla_crossing);
	// taco-tortilla (1), first case. taco overlaps tortilla.
	const taco_tortilla_aligned = tacos_types
		.map((pair, i) => is_taco_tortilla(pair)
			? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i])
			: undefined)
		.filter(a => a !== undefined);
	// taco-tortilla (2), the second of two cases, when a taco overlaps a face.
	const edges_faces_overlap = makeEdgesFacesOverlap(graph, epsilon);
	const edges_overlap_faces = booleanMatrixToIndexedArray(edges_faces_overlap)
		.map((faces, e) => edges_faces_side[e].length > 1
			&& edges_faces_side[e][0] === edges_faces_side[e][1]
				? faces
				: []);
	const taco_tortillas_crossing = edges_overlap_faces
		.map((tortillas, edge) => ({ taco: graph.edges_faces[edge], tortillas }))
		.filter(el => el.tortillas.length);
	const taco_tortilla_crossing = taco_tortillas_crossing
		.map(el => el.tortillas
			.map(tortilla => ({ taco: [...el.taco], tortilla })))
		.reduce((a, b) => a.concat(b), []);
	// finally, join both taco-tortilla cases together into one.
	// unnecessary, but sort them, why not.
	const taco_tortilla = taco_tortilla_aligned
		.concat(taco_tortilla_crossing)
		.sort((a, b) => a.tortilla - b.tortilla);

	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @param {object} graph a FOLD graph
 * @param {boolean[][]} overlap_matrix an overlap-relationship between every face
 * @param {boolean[]} faces_winding a boolean for each face, true for counter-clockwise.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} list of arrays containing three face indices.
 */
const makeTransitivityTrios = (graph, overlap_matrix, faces_winding, epsilon = math.core.EPSILON) => {
	if (!overlap_matrix) {
		overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
	}
	if (!faces_winding) {
		faces_winding = makeFacesWinding(graph);
	}
	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	const polygons = graph.faces_vertices
		.map(face => face
			.map(v => graph.vertices_coords[v]));
	polygons.forEach((face, i) => {
		if (!faces_winding[i]) { face.reverse(); }
	});
	const matrix = graph.faces_vertices.map(() => []);
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			if (!overlap_matrix[i][j]) { continue; }
			const polygon = math.core.clipPolygonPolygon(polygons[i], polygons[j], epsilon);
			if (polygon) { matrix[i][j] = polygon; }
		}
	}
	const trios = [];
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			if (!matrix[i][j]) { continue; }
			for (let k = j + 1; k < matrix.length; k++) {
				if (i === k || j === k) { continue; }
				if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
				const polygon = math.core.clipPolygonPolygon(matrix[i][j], polygons[k], epsilon);
				if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
			}
		}
	}
	return trios;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a full set of transitivity conditions (trios of faces which
 * overlap each other), and the set of pre-computed taco-taco and
 * taco-tortilla events, remove any transitivity condition where the three
 * faces are already covered in a taco-taco case.
 */
const filterTransitivity = (transitivity_trios, tacos_tortillas) => {
	// will contain taco-taco and taco-tortilla events encoded as all
	// permutations of 3 faces involved in each event.
	const tacos_trios = {};
	// using the list of all taco-taco conditions, store all permutations of
	// the three faces (sorted low to high) into a dictionary for quick lookup.
	// store them as space-separated strings.
	tacos_tortillas.taco_taco.map(tacos => [
		[tacos[0][0], tacos[0][1], tacos[1][0]], // a b c
		[tacos[0][0], tacos[0][1], tacos[1][1]], // a b d
		[tacos[0][0], tacos[1][0], tacos[1][1]], // a c d
		[tacos[0][1], tacos[1][0], tacos[1][1]], // b c d
	])
	.forEach(trios => trios
		.map(trio => trio
			.sort((a, b) => a - b)
			.join(" "))
		.forEach(key => { tacos_trios[key] = true; }));
	// convert all taco-tortilla cases into similarly-formatted,
	// space-separated strings.
	tacos_tortillas.taco_tortilla.map(el => [
		el.taco[0], el.taco[1], el.tortilla
	])
	.map(trio => trio
		.sort((a, b) => a - b)
		.join(" "))
	.forEach(key => { tacos_trios[key] = true; });
	// return the filtered set of trios.
	return transitivity_trios
		.filter(trio => tacos_trios[trio.join(" ")] === undefined);
};

/**
 * Rabbit Ear (c) Kraft
 */
const to_signed_layer_convert = { 0:0, 1:1, 2:-1 };
const to_unsigned_layer_convert = { 0:0, 1:1, "-1":2 };
/**
 * @description convert a layer-encoding (above/below) object
 * from 1,2 to 1,-1.
 * The input parameter is MODIFIED IN PLACE!
 * @param {object} values are either 0, 1, 2.
 * @returns {object} values are either 0, 1, -1.
 */
const unsignedToSignedConditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_signed_layer_convert[conditions[key]];
	});
	return conditions;
};

const signedToUnsignedConditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_unsigned_layer_convert[conditions[key]];
	});
	return conditions;
};

var globalSolverGeneral = /*#__PURE__*/Object.freeze({
	__proto__: null,
	unsignedToSignedConditions: unsignedToSignedConditions,
	signedToUnsignedConditions: signedToUnsignedConditions
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Each taco/tortilla event involves the relationship between
 * 3 or 4 faces. The lookup table encodes the relationship between all
 * permutations of pairs of these faces in a particular order.
 * 6: taco-taco, 3: taco-tortilla, 2: tortilla-tortilla, 3: transitivity.
 */
const refactor_pairs = (tacos_tortillas, transitivity_trios) => {
	const pairs = {};
	// A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
	pairs.taco_taco = tacos_tortillas.taco_taco.map(el => [
		[el[0][0], el[0][1]],
		[el[1][0], el[1][1]],
		[el[1][0], el[0][1]],
		[el[0][0], el[1][1]],
		[el[0][0], el[1][0]],
		[el[0][1], el[1][1]],
	]);
	// A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
	// (A,C) (A,B) (B,C)
	pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
		[el.taco[0], el.taco[1]],
		[el.taco[0], el.tortilla],
		[el.tortilla, el.taco[1]],
	]);
	// // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// // (A,C) (B,D)
	// pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
	//   [el[0][0], el[0][1]],
	//   [el[1][0], el[1][1]],
	// ]);

	// A-B and C-D are connected, where A is above/below C and B is above/below D
	// A:[0][0] B:[0][1] C:[1][0] D:[1][1]
	// (A,C) (B,D)
	pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
		[el[0][0], el[1][0]],
		[el[0][1], el[1][1]],
	]);
	// transitivity. no relation between faces in the graph.
	// (A,B) (B,C) (C,A)
	pairs.transitivity = transitivity_trios.map(el => [
		[el[0], el[1]],
		[el[1], el[2]],
		[el[2], el[0]],
	]);
	return pairs;
};
/**
 * @description refactor_pairs converts all taco/tortilla events into
 * an array of (6/3/2/3) pairs of faces involved in the taco/tortilla.
 * this method converts the pairs into space-separated strings, like "3 17",
 * and stores a note whether the pairs of numbers had to be flipped to be
 * sorted small to large (the only encoding in the conditions list), implying
 * that the value will also need to be flipped when storing and extracting.
 * @returns {object[]} array of objects matching the length of the number
 * of taco/tortilla cases. each object represents one taco/tortilla event.
 * each object contains two keys, each value is an array.
 * "face_keys": array of face keys (length 6,3,2,3), like "3 17".
 * "keys_ordered": matching-length array noting if the pair had to be flipped.
 */
const make_maps = tacos_face_pairs => tacos_face_pairs
	.map(face_pairs => {
		const keys_ordered = face_pairs.map(pair => pair[0] < pair[1]);
		const face_keys = face_pairs.map((pair, i) => keys_ordered[i]
			? `${pair[0]} ${pair[1]}`
			: `${pair[1]} ${pair[0]}`);
		return { face_keys, keys_ordered };
	});

const makeTacoMaps = (tacos_tortillas, transitivity_trios) => {
	const pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
	// console.log("pairs", pairs);
	// keys_ordered answers "is the first face < than second face?" regarding
	// how this will be used to reference the conditions lookup table.
	return {
		taco_taco: make_maps(pairs.taco_taco),
		taco_tortilla: make_maps(pairs.taco_tortilla),
		tortilla_tortilla: make_maps(pairs.tortilla_tortilla),
		transitivity: make_maps(pairs.transitivity),
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this is the initial step for building a set of conditions.
 * store the relationships between all adjacent faces, built from
 * the crease assignment of the edge between the pair of faces, taking into
 * consideration if a face has been flipped (clockwise winding).
 * @returns {object} keys are space-separated face pairs, like "3 17".
 * values are layer orientations, 0 (unknown) 1 (a above b) 2 (b above a).
 */
const makeConditions = (graph, overlap_matrix, faces_winding) => {
	if (!faces_winding) {
		faces_winding = makeFacesWinding(graph);
	}
	if (!overlap_matrix) {
		overlap_matrix = makeFacesFacesOverlap(graph);
	}
	const conditions = {};
	// flip 1 and 2 to be the other, leaving 0 to be 0.
	const flip_condition = { 0:0, 1:2, 2:1 };
	// set all conditions (every pair of overlapping faces) initially to 0
	booleanMatrixToUniqueIndexPairs(overlap_matrix)
		.map(pair => pair.join(" "))
		.forEach(key => { conditions[key] = 0; });
	// neighbor faces determined by crease between them
	const assignment_direction = { M: 1, m: 1, V: 2, v: 2 };
	graph.edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = graph.edges_assignment[edge];
		const local_order = assignment_direction[assignment];
		// skip boundary edges or edges with confusing assignments.
		if (faces.length < 2 || local_order === undefined) { return; }
		// face[0] is the origin face.
		// the direction of "m" or "v" will be inverted if face[0] is flipped.
		const upright = faces_winding[faces[0]];
		// now we know from a global perspective the order between the face pair.
		const global_order = upright ? local_order : flip_condition[local_order];
		const key1 = `${faces[0]} ${faces[1]}`;
		const key2 = `${faces[1]} ${faces[0]}`;
		if (key1 in conditions) { conditions[key1] = global_order; }
		if (key2 in conditions) { conditions[key2] = flip_condition[global_order]; }
	});
	return conditions;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description algorithm designed by Jason Ku.
 * Every taco/tortilla event encodes the relationship between 3 or 4 faces,
 * and given a known subset of orders between faces involved, we can either:
 * (a) confirm that this layer order is valid (even if not yet finished)
 * (b) confirm that this layer order is invalid
 * (c) not only confirm validity (a) but also uncover another relationship
 * between other pairs of faces involved in the taco/tortilla event.
 * 
 * The values of each state above is encoded as:
 * (a) is true, (b) is false, (c) encodes which index needs to change and
 * what the new value should become (either a 1 or 2).
 * 
 * And the keys representing each state are n-long, one for every pair of
 * faces involved, and encodes each pair as a 0, 1, or 2, each meaning:
 * 0: order unknown, 1: face a is above b, 2: face b is above a.
 */
/**
 * @description each state encodes a valid layer combination. each number
 * describes a relationship between pairs of faces, indicating:
 * - 1: the first face is above the second face
 * - 2: the second face is above the first face
 * each taco/tortilla set has its own encoding of face pairs.
 */
// A-C and B-D are connected
// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
const taco_taco_valid_states = [
	"111112",
	"111121",
	"111222",
	"112111",
	"121112",
	"121222",
	"122111",
	"122212",
	"211121",
	"211222",
	"212111",
	"212221",
	"221222",
	"222111",
	"222212",
	"222221",
];
// A-C is the taco, B is the tortilla
// (A,C) (A,B) (B,C)
const taco_tortilla_valid_states = ["112", "121", "212", "221"];

// A-B and C-D are connected, A is above/below C, B is above/below D
// (A,C) (B,D)
// in the case of tortilla-crossing face, the crossing face
// appears twice, the same index appears in place of both C and D
const tortilla_tortilla_valid_states = ["11", "22"];

// const tortilla_face_valid_states = [];
// (A,B) (B,C) (C,A)
const transitivity_valid_states = [
	"112",
	"121",
	"122",
	"211",
	"212",
	"221",
];
/**
 * @param {object[]} states, array of objects containing permutations (keys)
 *  and their values (solution is possible or not)
 * @param {number} t, 0...N the index in "states" we are looking at.
 * @param {string} key, a layer order as a string, like "001221"
 */
const check_state = (states, t, key) => {
	// convert the key into an array of integers (0, 1, 2)
	const A = Array.from(key).map(char => parseInt(char));
	// for each "t" index of states, only include keys which contain
	// "t" number of unknowns (0s).
	if (A.filter(x => x === 0).length !== t) { return; }
	states[t][key] = false;
	// solution will either be 0, 1, or an array of modifications
	let solution = false;
	for (let i = 0; i < A.length; i++) {
		const modifications = [];
		// look at the unknown layers only (index is 0)
		if (A[i] !== 0) { continue; }
		// in place of the unknowns, try each of the possible states (1, 2)
		for (let x = 1; x <= 2; x++) {
			// temporarily set the state to this new possible state.
			A[i] = x;
			// if this state exists in the previous set, save this solution.
			if (states[t - 1][A.join("")] !== false) {
				modifications.push([i, x]);
			}
		}
		// reset the state back to 0
		A[i] = 0;
		// if we found modifications (even if we aren't using them), the
		// solution is no longer 0. solution is either 1 or modifications.
		if (modifications.length > 0 && solution === false) {
			solution = [];
		}
		// this round's modifications will be length of 2 if we added
		// both possible states (1, 2), if this happens, we can't infer anything.
		// only accept a modification when it's the only one (length is 1).
		if (modifications.length === 1) {
			solution.push(modifications[0]);
		}
	}
	// if we invalidated a 0 solution (solution impossible), and no modifications
	// were able to be added, solution is 1, meaning, currently valid (if unsolved).
	if (solution !== false && solution.length === 0) {
		solution = true;
	}
	states[t][key] = solution;
};
/**
 * @description make a lookup table for every possible state of a taco/
 * tortilla combination, given the particular taco/tortilla valid states.
 * the value of each state is one of 3 values (2 numbers, 1 array):
 * - 0: layer order is not valid
 * - 1: layer order is currently valid. and is either solved (key contains
 *   no zeros / unknowns), or it is not yet invalid and can still be solved.
 * - (Array): two numbers, [index, value], modify the current layer by
 *   changing the number at index to the value.
 * @param {string[]} valid_states, one of the 3 set of valid states above
 * @returns {object} keys are layer states, possible solution as values.
 */
// const flip = { 0:0, 1:2, 2:1 };
const make_lookup = (valid_states) => {
	// the choose count can be inferred by the length of the valid states
	// (assuming they are all the same length)
	const choose_count = valid_states[0].length;
	// array of empty objects
	const states = Array
		.from(Array(choose_count + 1))
		.map(() => ({}));
	// all permutations of 1s and 2s (no zeros), length of choose_count.
	// examples for (6): 111112, 212221
	// set the value of these to "false" (solution is impossible)
	// with the valid cases to be overwritten in the next step.
	Array.from(Array( Math.pow(2, choose_count) ))
		.map((_, i) => i.toString(2))
		.map(str => Array.from(str).map(n => parseInt(n) + 1).join(""))
		.map(str => ("11111" + str).slice(-choose_count))
		.forEach(key => { states[0][key] = false; });
	// set the valid cases to "true" (solution is possible)
	valid_states.forEach(s => { states[0][s] = true; });
	// "t" relates to the number of unknowns (# zeros). layer 0 is complete,
	// start at layer 1 and count up to choose_count.
	Array.from(Array(choose_count))
		.map((_, i) => i + 1)
		// make all permuations of 0s, 1s, and 2s now, length of choose_count.
		// (all possibile permuations of layer orders)
		.map(t => Array.from(Array( Math.pow(3, choose_count) ))
			.map((_, i) => i.toString(3))
			.map(str => ("000000" + str).slice(-choose_count))
			.forEach(key => check_state(states, t, key)));
	// todo: the filter at the beginning of check_state is throwing away
	// a lot of solutions, duplicating work, in the first array here, instead
	// of being smart about it, only doing one loop, and sorting them here
	// before entering check_state.
	// gather solutions together into one object. if a layer order has
	// multiple suggested modifications, grab the first one
	let outs = [];
	// array decrementing integers from [choose_count...0]
	Array.from(Array(choose_count + 1))
		.map((_, i) => choose_count - i)
		.forEach(t => {
			const A = [];
			// currently, each value is either a number (0 or 1), or
			// an array of multiple modifications, in which case, we only need one.
			Object.keys(states[t]).forEach(key => {
				let out = states[t][key];
				// multiple modifications are possible, get the first one.
				if (out.constructor === Array) { out = out[0]; }
				// if (out.constructor === Array) {
				//   const key_correct = Array.from(key);
				//   const key_flipped = Array.from(key);
				//   key_correct[out[0][0]] = out[0][1];
				//   key_flipped[out[0][0]] = flip[out[0][1]];
				//   out = {
				//     true: key_correct.join(""),
				//     false: key_flipped.join(""),
				//   };
				// }
				A.push([key, out]);
			});
			outs = outs.concat(A);
		});
	// this is unnecessary but because for Javascipt object keys,
	// insertion order is preserved, sort keys for cleaner output.
	outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
	// return data as an object.
	// recursively freeze result, this is intended to be an immutable reference
	const lookup = {};
	outs.forEach(el => { lookup[el[0]] = Object.freeze(el[1]); });
	return Object.freeze(lookup);
};

const slow_lookup = {
	taco_taco: make_lookup(taco_taco_valid_states),
	taco_tortilla: make_lookup(taco_tortilla_valid_states),
	tortilla_tortilla: make_lookup(tortilla_tortilla_valid_states),
	transitivity: make_lookup(transitivity_valid_states),
};

// const done_result = { 0: false, 1: true };
// const make_number = (key, value) => {
//   const arr = Array.from(key);
//   arr[value[0]] = value[1];
//   const base_three = arr.join("");
//   return parseInt(base_three, 3);
// };
// const quick_lookup = {};
// Object.keys(slow_lookup).forEach(type => {
//   quick_lookup[type] = [];
//   Object.keys(slow_lookup[type]).forEach(key => {
//     const base_ten = parseInt(key, 3);
//     const value = slow_lookup[type][key];
//     const done = value === 0 || value === 1;
//     const new_value = done ? done_result[value] : make_number(key, value);
//     quick_lookup[type][base_ten] = new_value;
//   });
// });

// export default quick_lookup;

/**
 * Rabbit Ear (c) Kraft
 */
// "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
const taco_types$2 = Object.freeze(Object.keys(slow_lookup));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flip_conditions = { 0:0, 1:2, 2:1 };

const fill_layers_from_conditions = (layers, maps, conditions, fill_indices) => {
	// todo, get the CHANGED conditions. changed from last time we updated things.
	// then, this return array "changed" will actually be relevant.
	// this is an object, so we can set the key and prevent duplicates.
	const changed = {};
	const iterators = fill_indices
		? fill_indices
		: Object.keys(layers);
	// layers.forEach((layer, i) => maps[i].face_keys
	iterators.forEach(i => maps[i].face_keys
		.forEach((key, j) => {
			// todo: possible this error will never show if we can guarantee that
			// tacos/tortillas have been properly built
			if (!(key in conditions)) {
				console.warn(key, "not in conditions");
				return;
			}
			// if conditions[key] is 1 or 2, not 0, apply the suggestion.
			if (conditions[key] !== 0) {
				// orient the suggestion based on if the face pair was flipped or not.
				const orientation = maps[i].keys_ordered[j]
					? conditions[key]
					: flip_conditions[conditions[key]];
				// now it's possible that this face pair has already been set (not 0).
				// if so, double check that the previously set value is the same as
				// the new one, otherwise the conflict means that this layer
				// arrangement is unsolvable and needs to report the fail all the way
				// back up to the original recursive call.
				if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
					throw "fill conflict";
				}
				layers[i][j] = orientation;
				changed[i] = true;
			}
		}));
	return changed;
};
const infer_next_steps = (layers, maps, lookup_table, changed_indices) => {
	const iterators = changed_indices
		? changed_indices
		: Object.keys(layers);
	return iterators.map(i => {
		const map = maps[i];
		const key = layers[i].join("");
		const next_step = lookup_table[key];
		if (next_step === false) { throw "unsolvable"; }
		if (next_step === true) { return; }
		if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
			throw "infer conflict";
		}
		layers[i][next_step[0]] = next_step[1];
		// if (layers[i].indexOf(0) === -1) { delete layers[i]; }
		// format this next_step change into face-pair-key and above/below value
		// so that it can be added to the conditions object.
		const condition_key = map.face_keys[next_step[0]];
		const condition_value = map.keys_ordered[next_step[0]]
			? next_step[1]
			: flip_conditions[next_step[1]];
		// console.log("conditions value", map.keys_ordered[next_step[0]], map.face_keys[next_step[0]]);
		// if (avoid[condition_key] === condition_value) { throw "avoid"; }
		// if (map.face_keys[0] === "3 6") {
		//   console.log("layer, map, next_step", layer, map, next_step);
		//   console.log("condition key value", condition_key, condition_value);
		// }
		return [condition_key, condition_value];
	}).filter(a => a !== undefined);
};

/**
 * @description completeSuggestionsLoop
 */
const completeSuggestionsLoop = (layers, maps, conditions, pair_layer_map) => {
	// given the current set of conditions, complete them as much as possible
	// only adding the determined results certain from the current state.
	// let time_one = 0;
	// let time_two = 0;
	let next_steps;
	let next_steps_indices = {};
	do {
		try {
			// inner_inner_loop_count++;
			// for each: taco_taco, taco_tortilla, tortilla_tortilla, transitivity
			// const start_one = new Date();
			const fill_changed = {};
			taco_types$2.forEach(taco_type => { fill_changed[taco_type] = {}; });
			for (let t = 0; t < taco_types$2.length; t++) {
				const type = taco_types$2[t];
				fill_changed[type] = fill_layers_from_conditions(layers[type], maps[type], conditions, next_steps_indices[type]);
			}
			taco_types$2.forEach(type => {
				fill_changed[type] = Object.keys(fill_changed[type]);
			});
			// console.log("fill_changed", fill_changed);
			// time_one += (Date.now() - start_one);
			// const start_two = new Date();
			next_steps = taco_types$2
				.flatMap(type => infer_next_steps(layers[type], maps[type], slow_lookup[type], fill_changed[type]));
			next_steps.forEach(el => { conditions[el[0]] = el[1]; });
			// reset next_step_indices
			taco_types$2.forEach(type => { next_steps_indices[type] = {}; });
			// each next step is [condition_key, condition_value]. get the key.
			taco_types$2.forEach(taco_type => next_steps
				.forEach(el => pair_layer_map[taco_type][el[0]]
					.forEach(i => {
						next_steps_indices[taco_type][i] = true;
					})));
			taco_types$2.forEach(type => {
				next_steps_indices[type] = Object.keys(next_steps_indices[type]);
			});
			// console.log("next steps changed", next_steps_indices);
			// time_two += (Date.now() - start_two);
		} catch (error) { return false; } // no solution on this branch
	} while (next_steps.length > 0);
	// console.log("complete", time_one, time_two);
	return true;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description a javascript re-implementation of Java's .hashCode()
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 * @linkcode Origami ./src/general/hashCode.js 7
 */
const hashCode = (string) => {
	let hash = 0;
	for (let i = 0; i < string.length; i += 1) {
		hash = ((hash << 5) - hash) + string.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/**
 * Rabbit Ear (c) Kraft
 */

const count_zeros = conditions => Object
	.keys(conditions)
	.filter(key => conditions[key] === 0).length;

const taco_types$1 = Object.freeze(Object.keys(slow_lookup));

const duplicate_unsolved_layers$1 = (layers) => {
	const duplicate = {};
	taco_types$1.forEach(type => { duplicate[type] = []; });
	taco_types$1.forEach(type => layers[type]
		.forEach((layer, i) => {
			if (layer.indexOf(0) !== -1) {
				duplicate[type][i] = [...layer];
			}
		}));
	return duplicate;
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.
/**
 * @description find only one layer solution to a folded graph.
 * @param {object} graph a FOLD graph
 * @param {object[]} maps the result of calling makeTacoMaps
 * @param {object} conditions space-separated face-pairs as keys, values are initially all 0, the result of calling makeConditions
 * @returns {object} solution where keys are space-separated face pairs and values are +1 or -1 describing if the second face is above or below the first.
 */
const singleSolver = (graph, maps, conditions) => {
	const startDate = new Date();
	let recurse_count = 0;
	let inner_loop_count = 0;
	// successful conditions will often be duplicates of one another.
	// filter only a set of unique conditions. use a hash table to compare.
	const successes_hash = {};

	let layers = {
		taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
		taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
		tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
		transitivity: maps.transitivity.map(el => Array(3).fill(0)),
	};

	// pair_layer_map[taco_type][face_pair] = [] array of indices in map
	const pair_layer_map = {};
	taco_types$1.forEach(taco_type => { pair_layer_map[taco_type] = {}; });
	taco_types$1.forEach(taco_type => Object.keys(conditions)
		.forEach(pair => { pair_layer_map[taco_type][pair] = []; }));
	taco_types$1
		.forEach(taco_type => maps[taco_type]
			.forEach((el, i) => el.face_keys
				.forEach(pair => {
					pair_layer_map[taco_type][pair].push(i);
				})));
	// console.log("pair_layer_map", pair_layer_map);



	if (!completeSuggestionsLoop(layers, maps, conditions, pair_layer_map)) {
		return undefined;
	}

	let solution;

	do {
		// console.time(`recurse ${this_recurse_count}`);
		recurse_count++;
		const zero_keys = Object.keys(conditions)
			.map(key => conditions[key] === 0 ? key : undefined)
			.filter(a => a !== undefined);
		// solution found. exit.
		if (zero_keys.length === 0) {
			solution = conditions;
			break;
		}
		// console.log("recurse. # zero keys", zero_keys.length);
		// for every unknown face-pair relationship (zero_keys), try setting both
		// above/below cases, test it out, and if it's a success the inner loop
		// will either encounter a fail state, in which case reject it, or it
		// reaches a stable state where all suggestions have been satisfied.
		const avoid = {};

		const successes = zero_keys
			.map((key, i) => [1, 2]
				.map(dir => {
					if (avoid[key] && avoid[key][dir]) { return; }
					// if (precheck(layers, maps, key, dir)) {
					//   console.log("precheck caught!"); return;
					// }
					const clone_conditions = JSON.parse(JSON.stringify(conditions));
					if (successes_hash[JSON.stringify(clone_conditions)]) {
						console.log("early hash caught!"); return;
					}
					const clone_layers = duplicate_unsolved_layers$1(layers);
					clone_conditions[key] = dir;
					inner_loop_count++;
					if (!completeSuggestionsLoop(clone_layers, maps, clone_conditions, pair_layer_map)) {
						return undefined;
					}
					Object.keys(clone_conditions)
						.filter(key => conditions[key] === 0)
						.forEach(key => {
							if (!avoid[key]) { avoid[key] = {}; }
							avoid[key][dir] = true;
						});
					return {
						conditions: clone_conditions,
						layers: clone_layers,
						zero_count: count_zeros(clone_conditions),
					};
				})
				.filter(a => a !== undefined))
			.reduce((a, b) => a.concat(b), [])
			.sort((a, b) => b.zero_count - a.zero_count);

		const unique_successes = successes
			.map(success => JSON.stringify(success.conditions))
			.map(string => hashCode(string))
			.map((hash, i) => {
				if (successes_hash[hash]) { return; }
				successes_hash[hash] = successes[i];
				return successes[i];
			})
			.filter(a => a !== undefined);

		// console.log("successes", successes);
		// console.log("unique_successes", unique_successes);
		// console.log("unique_successes", unique_successes.length);

		// console.timeEnd(`recurse ${this_recurse_count}`);
		if (!unique_successes.length) {
			console.warn("layer solver, no solutions found");
			return;
		}
		conditions = unique_successes[0].conditions;
		layers = unique_successes[0].layers;

	} while (solution === undefined);

	// convert solutions from (1,2) to (+1,-1)
	unsignedToSignedConditions(solution);

	// console.log("solutions", solutions);
	// console.log("successes_hash", successes_hash);
	// console.log("avoid", avoid);
	const duration = Date.now() - startDate;
	if (duration > 50) {
		console.log(`${duration}ms recurse_count`, recurse_count, "inner_loop_count", inner_loop_count);
	}
	return solution;
};

/**
 * Rabbit Ear (c) Kraft
 */

const taco_types = Object.freeze(Object.keys(slow_lookup));

const duplicate_unsolved_layers = (layers) => {
	const duplicate = {};
	taco_types.forEach(type => { duplicate[type] = []; });
	taco_types.forEach(type => layers[type]
		.forEach((layer, i) => {
			if (layer.indexOf(0) !== -1) {
				duplicate[type][i] = [...layer];
			}
		}));
	return duplicate;
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.
/**
 * @description recursively find all solutions to a folded graph.
 * @param {object} graph a FOLD graph
 * @param {object[]} maps the result of calling makeTacoMaps
 * @param {object} conditions space-separated face-pairs as keys, values are initially all 0, the result of calling makeConditions
 * @returns {object[]} array of solutions where keys are space-separated face pairs and values are +1 or -1 describing if the second face is above or below the first.
 */
const recursiveSolver = (graph, maps, conditions_start) => {
	const startDate = new Date();
	let recurse_count = 0;
	let inner_loop_count = 0;
	let avoidcount = 0;
	let failguesscount = 0;
	// time
	let clone_time = 0;
	let solve_time = 0;

	// pair_layer_map[taco_type][face_pair] = [] array of indices in map
	const pair_layer_map = {};
	taco_types.forEach(taco_type => { pair_layer_map[taco_type] = {}; });
	taco_types.forEach(taco_type => Object.keys(conditions_start)
		.forEach(pair => { pair_layer_map[taco_type][pair] = []; }));
	taco_types
		.forEach(taco_type => maps[taco_type]
			.forEach((el, i) => el.face_keys
				.forEach(pair => {
					pair_layer_map[taco_type][pair].push(i);
				})));
	// console.log("pair_layer_map", pair_layer_map);

	// todo: it appears this never happens, remove after testing.
	// successful conditions will often be duplicates of one another.
	// filter only a set of unique conditions. use a hash table to compare.
	// not only do we store hashes of the final solutions, but,
	// each round of the recurse involves guessing, and, after we complete
	// the conditions as much as possible after each guess, store these
	// partially-completed conditions here too. this dramatically reduces the
	// number of recursive branches.
	// const successes_hash = {};
	/**
	 * the input parameters will not be modified. they will be copied,
	 * their copies modified, then passed along to the next recurse.
	 */
	const recurse = (layers, conditions) => {
		// console.time(`recurse ${this_recurse_count}`);
		recurse_count++;
		const zero_keys = Object.keys(conditions)
			.map(key => conditions[key] === 0 ? key : undefined)
			.filter(a => a !== undefined);
		// solution found. exit.
		if (zero_keys.length === 0) { return [conditions]; }
		// console.log("recurse. # zero keys", zero_keys.length);
		// for every unknown face-pair relationship (zero_keys), try setting both
		// above/below cases, test it out, and if it's a success the inner loop
		// will either encounter a fail state, in which case reject it, or it
		// reaches a stable state where all suggestions have been satisfied.
		// "avoid":
		// within this one recursive round, we can be sure that all of our guesses
		// only need to happen once, since the source data is the same. so, if inside
		// one guess, more face relationships are uncovered, store those newly found
		// relationships inside "avoid". later as we continue our guessing, we can
		// avoid any guesses which are stored inside "avoid", as the outcome
		// has already been determined.
		const avoid = {};
		const successes = zero_keys
			.map((key, i) => [1, 2]
				.map(dir => {
					if (avoid[key] && avoid[key][dir]) { avoidcount++; return; }
					// console.log("recursing with", key, dir);
					// todo: it appears that this never happens. remove after testing.
					// if (precheck(layers, maps, key, dir)) {
					//   console.log("precheck caught!"); return;
					// }
					const clone_start = new Date();
					const clone_conditions = JSON.parse(JSON.stringify(conditions));
					clone_time += (Date.now() - clone_start);

					// todo: it appears that this never happens. remove after testing.
					// if (successes_hash[JSON.stringify(clone_conditions)]) {
					//   console.log("early hash caught!"); return;
					// }
					const clone_layers = duplicate_unsolved_layers(layers);
					clone_conditions[key] = dir;
					inner_loop_count++;
					const solve_start = new Date();
					if (!completeSuggestionsLoop(clone_layers, maps, clone_conditions, pair_layer_map)) {
						failguesscount++;
						solve_time += (Date.now() - solve_start);
						return;
					}
					solve_time += (Date.now() - solve_start);
					Object.keys(clone_conditions)
						.filter(key => conditions[key] === 0)
						.forEach(key => {
							if (!avoid[key]) { avoid[key] = {}; }
							avoid[key][dir] = true;
						});
					return { conditions: clone_conditions, layers: clone_layers };
				})
				.filter(a => a !== undefined))
			.reduce((a, b) => a.concat(b), []);

		// todo: it appears that this never happens. remove after testing.
		// const unique_successes = successes
		//   .map(success => JSON.stringify(success.conditions))
		//   .map(string => hashCode(string))
		//   .map((hash, i) => {
		//     if (successes_hash[hash]) { return; }
		//     successes_hash[hash] = successes[i];
		//     return successes[i];
		//   })
		//   .filter(a => a !== undefined);

		// console.log("recurse", unique_successes.length, successes.length);

		// console.log("successes", successes);
		// console.log("successes_hash", successes_hash);
		// console.log("unique_successes", unique_successes);
		// console.log("unique_successes", unique_successes.length);

		// console.timeEnd(`recurse ${this_recurse_count}`);
		return successes
		// return unique_successes
			.map(success => recurse(success.layers, success.conditions))
			.reduce((a, b) => a.concat(b), []);
	};

	const layers_start = {
		taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
		taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
		tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
		transitivity: maps.transitivity.map(el => Array(3).fill(0)),
	};

	// this could be left out and simply starting the recursion. however,
	// we want to capture the "certain" relationships, the ones decided
	// after consulting the table before any guessing or recursion is done.
	if (!completeSuggestionsLoop(layers_start, maps, conditions_start, pair_layer_map)) {
		// failure. do not proceed.
		// console.log("failure. do not proceed");
		return [];
	}
	// // the face orders that must be for every case.
	// const certain = conditions_start;
	// console.log("HERE 2", conditions_start);
	// the set of solutions as an array, with the certain values
	// under the key "certain".
	const solutions_before = recurse(layers_start, conditions_start);


	// todo: it appears that this never happens. remove after testing.
	const successes_hash = {};
	const solutions = solutions_before
		.map(conditions => JSON.stringify(conditions))
		.map(string => hashCode(string))
		.map((hash, i) => {
			if (successes_hash[hash]) { return; }
			successes_hash[hash] = solutions_before[i];
			return solutions_before[i];
		})
		.filter(a => a !== undefined);

	// solutions.certain = JSON.parse(JSON.stringify(certain));
	// algorithm is done!
	// convert solutions from (1,2) to (+1,-1)
	for (let i = 0; i < solutions.length; i++) {
		unsignedToSignedConditions(solutions[i]);
	}
	// unsignedToSignedConditions(solutions.certain);
	// console.log("solutions", solutions);
	// console.log("successes_hash", successes_hash);
	// console.log("avoid", avoid);
	const duration = Date.now() - startDate;
	if (duration > 50) {
		console.log(`${duration}ms recurses`, recurse_count, "inner loops", inner_loop_count, "avoided", avoidcount, "bad guesses", failguesscount, `solutions ${solutions_before.length}/${solutions.length}`, "durations: clone, solve", clone_time, solve_time);
	}
	return solutions;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description {object} unlike most methods in the layer solver, "graph"
 * here refers to the crease pattern, not the folded form
 */
const dividingAxis = (graph, line, conditions) => {
	const faces_side = makeFacesCenterQuick(graph)
		.map(center => math.core.subtract2(center, line.origin))
		.map(vector => math.core.cross2(line.vector, vector))
		.map(cross => Math.sign(cross));
	const sides = Object.keys(conditions)
		.map(key => {
			const pair = key.split(" ");
			if (conditions[key] === 0) { return }
			if (conditions[key] === 2) { pair.reverse(); }
			if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
				return true;
			}
			if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
				return false;
			}
			// pair of faces are on the same side of the axis
		}).filter(a => a !== undefined);
	const is_valid = sides.reduce((a, b) => a && (b === sides[0]), true);
	if (!is_valid) { console.warn("line is not a dividing axis"); return; }
	// there are two toggles going on. depending on the condition result (1 or 2)
	const side = sides[0];
	Object.keys(conditions)
		.forEach(key => {
			const pair = key.split(" ");
			if (conditions[key] !== 0) { return }
			if (faces_side[pair[0]] === faces_side[pair[1]]) { return; }
			if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
				if (side) { conditions[key] = 1; } // A is above B
				else      { conditions[key] = 2; } // B is above A
			}
			if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
				if (side) { conditions[key] = 2; } // B is above A
				else      { conditions[key] = 1; } // A is above B
			}
		});
};

/**
 * Rabbit Ear (c) Kraft
 */

const makeMapsAndConditions = (graph, epsilon = 1e-6) => {
	const overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
	const facesWinding = makeFacesWinding(graph);
	// conditions encodes every pair of overlapping faces as a space-separated
	// string, low index first, as the keys of an object.
	// initialize all values to 0, but set neighbor faces to either 1 or 2.
	const conditions = makeConditions(graph, overlap_matrix, facesWinding);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	const unfiltered_trios = makeTransitivityTrios(graph, overlap_matrix, facesWinding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
	// console.log("overlap_matrix", overlap_matrix);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("maps", maps);
	// console.log("conditions", conditions);
	return { maps, conditions };
};
/**
 * @description iteratively calculate only one solution to layer order, ignoring any other solutions
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs and values are +1 or -1, the relationship of the two faces.
 */
const oneLayerConditions = (graph, epsilon = 1e-6) => {
	const data = makeMapsAndConditions(graph, epsilon);
	const solution = singleSolver(graph, data.maps, data.conditions);
	return solution;
};
/**
 * @description recursively calculate all solutions to layer order
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs and values are +1 or -1, the relationship of the two faces.
 */
const allLayerConditions = (graph, epsilon = 1e-6) => {
	const data = makeMapsAndConditions(graph, epsilon);
	const solutions = recursiveSolver(graph, data.maps, data.conditions);
	solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
	return solutions;
};

const makeMapsAndConditionsDividingAxis = (folded, cp, line, epsilon = 1e-6) => {
	const overlap_matrix = makeFacesFacesOverlap(folded, epsilon);
	const faces_winding = makeFacesWinding(folded);
	const conditions = makeConditions(folded, overlap_matrix, faces_winding);
	dividingAxis(cp, line, conditions);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(folded, epsilon);
	const unfiltered_trios = makeTransitivityTrios(folded, overlap_matrix, faces_winding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
	return { maps, conditions };
};
/**
 * @description iteratively calculate only one solution to layer order, ignoring any other solutions, enforcing a symmetry line where two sets of faces never cross above/below each other
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs and values are +1 or -1, the relationship of the two faces.
 */
const oneLayerConditionsWithAxis = (folded, cp, line, epsilon = 1e-6) => {
	const data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
	const solution = singleSolver(folded, data.maps, data.conditions);
	return solution;
};
/**
 * @description recursively calculate all solutions to layer order, enforcing a symmetry line where two sets of faces never cross above/below each other
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs and values are +1 or -1, the relationship of the two faces.
 */
const allLayerConditionsWithAxis = (folded, cp, line, epsilon = 1e-6) => {
	const data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
	const solutions = recursiveSolver(folded, data.maps, data.conditions);
	solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
	return solutions;
};

var globalSolvers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	oneLayerConditions: oneLayerConditions,
	allLayerConditions: allLayerConditions,
	oneLayerConditionsWithAxis: oneLayerConditionsWithAxis,
	allLayerConditionsWithAxis: allLayerConditionsWithAxis
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description find a topological ordering from a set of conditions
 * @param {object} conditions a solution of face layer conditions where the keys are space-separated pair of faces, and the value is +1 0 or -1.
 * @param {object} graph a FOLD graph
 * @returns {number[]} layers_face, for every layer (key) which face (value) inhabits it.
 */
const topologicalOrder = (conditions, graph) => {
	if (!conditions) { return []; }
	const faces_children = [];
	// use the conditions face pair relationships to fill an array where
	// index: face, value: array of the face's children (faces below the face)
	Object.keys(conditions).map(key => {
		const pair = key.split(" ").map(n => parseInt(n));
		if (conditions[key] === -1) { pair.reverse(); }
		if (faces_children[pair[0]] === undefined) {
			faces_children[pair[0]] = [];
		}
		faces_children[pair[0]].push(pair[1]);
	});
	// not all faces are encoded in the conditions. use the graph to fill in
	// any remaining faces with empty arrays (no child faces / faces below)
	if (graph && graph.faces_vertices) {
		graph.faces_vertices.forEach((_, f) => {
			if (faces_children[f] === undefined) {
				faces_children[f] = [];
			}
		});
	}
	// console.log("faces_children", JSON.parse(JSON.stringify(faces_children)));
	const layers_face = [];
	const faces_visited = [];
	let protection = 0;
	for (let f = 0; f < faces_children.length; f++) {
		if (faces_visited[f]) { continue; }
		const stack = [f];
		while (stack.length && protection < faces_children.length * 2) {
			const stack_end = stack[stack.length - 1];
			if (faces_children[stack_end].length) {
				const next = faces_children[stack_end].pop();
				if (!faces_visited[next]) { stack.push(next); }
				continue;
			} else {
				// we reached a leaf, add it to the layers.
				layers_face.push(stack_end);
				faces_visited[stack_end] = true;
				stack.pop();
			}
			protection++;
		}
	}
	// console.log("faces_children", faces_children);
	// console.log("protection", protection);
	if (protection >= faces_children.length * 2) {
		console.warn("fix protection in topological order");
	}
	// console.log("layers_face", layers_face);
	// console.log("faces_visited", faces_visited);
	return layers_face;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description for a flat-foldable origami, this will return
 * ONLY ONE of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} graph a FOLD object, make sure the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon value
 * @returns {number[]} a faces_layer object, describing,
 * for each face (key) which layer the face inhabits (value)
 */
const makeFacesLayer = (graph, epsilon) => {
	const conditions = oneLayerConditions(graph, epsilon);
	return invertMap(topologicalOrder(conditions, graph));
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description for a flat-foldable origami, this will return
 * all of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} graph a FOLD object, make sure the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon value
 * @returns {number[][]} an array of faces_layer objects, describing,
 * for each face (key) which layer the face inhabits (value)
 */
const makeFacesLayers = (graph, epsilon) => allLayerConditions(graph, epsilon)
	.map(conditions => topologicalOrder(conditions, graph))
	.map(invertMap);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description flip a model over by reversing the order of the faces
 * @param {object} faces_layer a faces_layer array
 * @returns {object} a new faces_layer array
 */
const flipFacesLayer = faces_layer => invertMap(
	invertMap(faces_layer).reverse(),
);

/**
 * Rabbit Ear (c) Kraft
 */

const facesLayerToEdgesAssignments = (graph, faces_layer) => {
	const edges_assignment = [];
	const faces_winding = makeFacesWinding(graph);
	// set boundary creases
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	edges_faces.forEach((faces, e) => {
		if (faces.length === 1) { edges_assignment[e] = "B"; }
		if (faces.length === 2) {
			const windings = faces.map(f => faces_winding[f]);
			if (windings[0] === windings[1]) { return "F"; }
			const layers = faces.map(f => faces_layer[f]);
			const local_dir = layers[0] < layers[1];
			const global_dir = windings[0] ? local_dir : !local_dir;
			edges_assignment[e] = global_dir ? "V" : "M";
		}
	});  
	return edges_assignment;
};


// export const layer_conditions_to_edges_assignments = (graph, conditions) => {
//   const edges_assignment = [];
//   const faces_winding = makeFacesWinding(graph);
//   // set boundary creases
//   const edges_faces = graph.edges_faces
//     ? graph.edges_faces
//     : makeEdgesFaces(graph);
//  
//   return edges_assignment;
// };

var edgesAssignments = /*#__PURE__*/Object.freeze({
	__proto__: null,
	facesLayerToEdgesAssignments: facesLayerToEdgesAssignments
});

/**
 * Rabbit Ear (c) Kraft
 */
// todo: is it okay to remove the filter?
const conditionsToMatrix = (conditions) => {
	const condition_keys = Object.keys(conditions);
	const face_pairs = condition_keys
		.map(key => key.split(" ").map(n => parseInt(n)));
	const faces = [];
	face_pairs
		.reduce((a, b) => a.concat(b), [])
		.forEach(f => faces[f] = undefined);
	const matrix = faces.map(() => []);
	face_pairs
		// .filter((_, i) => conditions[condition_keys[i]] !== 0)
		.map(([a, b]) => {
			matrix[a][b] = conditions[`${a} ${b}`];
			matrix[b][a] = -conditions[`${a} ${b}`];
		});
	return matrix;
};

/**
 * Rabbit Ear (c) Kraft
 */

// todo, should epsilon be multiplied by 2?

/**
 * @description make an array of objects where each object represents one
 * fold line, and contains all the tacos and tortillas sharing the fold line.
 * @returns {object[]} array of taco objects. each taco object represents one
 * fold location shared by multiple tacos. each taco object contains keys:
 * "both", "left", "right" where the values are an array of pairs of faces,
 * the pairs of adjacent faces around the taco edge. "left": [ [2,3] [6,0] ]
 */
const makeFoldedStripTacos = (folded_faces, is_circular, epsilon) => {
	// center of each face, will be used to see if a taco faces left or right
	const faces_center = folded_faces
		.map((ends) => ends ? (ends[0] + ends[1]) / 2 : undefined);
	const locations = [];
	// gather all fold locations that match, add them to the same group.
	// for every fold location, make one of these objects where the pairs are
	// the two adjacent faces on either side of the crease line.
	// {
	//   min: -0.1,
	//   max: 0.1,
	//   pairs: [ [2,3], [0,1] ],
	// };
	folded_faces.forEach((ends, i) => {
		if (!ends) { return; }
		// if the strip is not circular, skip the final round and don't wrap around
		if (!is_circular && i === folded_faces.length - 1) { return; }
		const fold_end = ends[1];
		const min = fold_end - (epsilon * 2);
		const max = fold_end + (epsilon * 2);
		const faces = [i, (i+1) % folded_faces.length];
		// which side of the crease is the face on?
		// false = left (-), true = right (+)
		const sides = faces
			.map(f => faces_center[f])
			.map(center => center > fold_end);
		// place left tacos at index 1, right at 2, and neither (tortillas) at 0
		const taco_type = (!sides[0] && !sides[1]) * 1 + (sides[0] && sides[1]) * 2;
		// todo: this searches every time. could be improved with a sorted array.
		const match = locations
			.filter(el => el.min < fold_end && el.max > fold_end)
			.shift();
		const entry = { faces, taco_type };
		if (match) {
			match.pairs.push(entry);
		} else {
			locations.push({ min, max, pairs: [entry] });
		}
	});
	// ignore stacks which have only one taco. we know they pass the test.
	// technically we can also filter out after they have been separated
	// as we can ignore the case with 1 left and 1 right. it always passes too.
	// but these will get ignored in the next function anyway
	return locations
		.map(el => el.pairs)
		.filter(pairs => pairs.length > 1)
		.map(pairs => ({
			both: pairs.filter(el => el.taco_type === 0).map(el => el.faces),
			left: pairs.filter(el => el.taco_type === 1).map(el => el.faces),
			right: pairs.filter(el => el.taco_type === 2).map(el => el.faces),
		}));
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given two indices, return a copy of the array between them,
 * excluding the elements at the indices themselves.
 * @returns {any[]} the subarray exclusively between the two indices.
 */
const between = (arr, i, j) => (i < j)
	? arr.slice(i + 1, j)
	: arr.slice(j + 1, i);
/**
 * because this test is meant to run during the intermediate steps while
 * the a strip is being assembled, the strip may eventually be circular,
 * but currently it isn't.
 * 
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "foldStripWithAssignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} does a violation occur. "false" means all good.
 */
const validateTacoTortillaStrip = (faces_folded, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
	// for every sector/face, the value is its index in the layers_face array
	const faces_layer = invertMap(layers_face);
	// for every sector, the location of the end of the sector after folding
	// (the far end, the second end visited by the walk)
	const fold_location = faces_folded
		.map(ends => ends ? ends[1] : undefined);
	// for every sector, the location of the end which lies nearest to -Infinity
	const faces_mins = faces_folded
		.map(ends => ends ? Math.min(...ends) : undefined)
		.map(n => n + epsilon);
	// for every sector, the location of the end which lies nearest to +Infinity
	const faces_maxs = faces_folded
		.map(ends => ends ? Math.max(...ends) : undefined)
		.map(n => n - epsilon);
	// we can't test the loop back around when j==end and i==0 because they only
	// connect after the piece has been completed,
	// but we do need to test it when that happens
	// const max = layers_face.length + (layers_face.length === sectors.length ? 0 : -1);
	// const faces_array_circular = is_circular
	//   && faces_layer.length === faces_folded.length;
	const max = faces_layer.length + (is_circular ? 0 : -1);
	// iterate through all the faces, take each face together with the next face,
	// establish the fold line between them, then check the layer stacking and
	// gather all faces that exist between this pair of faces, test each
	// of them to see if they cross through this pair's fold line.
	for (let i = 0; i < max; i += 1) {
		// this is the next face in the folding sequence
		const j = (i + 1) % faces_layer.length;
		// if two adjacent faces are in the same layer, they will not be causing an
		// overlap, at least not at their crease (because there is no crease).
		if (faces_layer[i] === faces_layer[j]) { continue; }
		// todo consider prebuilding a table of comparing fold locations with face mins and maxs
		// result of between contains both numbers and arrays: [5,[0,1],2,[3,4]]
		// the reduce will bring everything to the top level: [5,0,1,2,3,4]
		const layers_between = between(layers_face, faces_layer[i], faces_layer[j])
			.flat();
		// check if the fold line is (below/above) ALL of the sectors between it
		// it will be above if
		const all_below_min = layers_between
			.map(index => fold_location[i] < faces_mins[index])
			.reduce((a, b) => a && b, true);
		const all_above_max = layers_between
			.map(index => fold_location[i] > faces_maxs[index])
			.reduce((a, b) => a && b, true);
		if (!all_below_min && !all_above_max) { return false; }
	}
	return true;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description test a stack of tacos (all left or right) for self-intersection.
 * for a collection of tacos which all point in the same direction,
 * all pairs of faces in a taco-taco stack have a shared edge,
 * give each pair a unique identifier (simplest, a unique integer 0...n),
 * now we refer to each face simply by its pair identifier. so now a face
 * layer stack would appear like: [1, 1, 0, 5, 5, 0] (which is a valid stack).
 * a bad layer stack would be: [1, 5, 1, 5].
 * @param {number[]} stacking order of each face where each face is
 * encoded as its pair number identifier.
 * @returns {boolean} true if the taco stack passes this test. false if fails.
 */
const validateTacoTacoFacePairs = (face_pair_stack) => {
	// create a copy of "stack" that removes single faces currently missing
	// their other pair partner. this removes boundary faces (with no adj. face)
	// as well as stacks which are in the process of being constructed but not
	// yet final
	const pair_stack = removeSingleInstances(face_pair_stack);
	const pairs = {};
	let count = 0;
	for (let i = 0; i < pair_stack.length; i++) {
		if (pairs[pair_stack[i]] === undefined) {
			count++;
			pairs[pair_stack[i]] = count;
		}
		// if we have seen this layer pair already, it MUST be appearing
		// in the correct order, that is, as it gets popped off the stack,
		// it must be the next-most-recently added pair to the stack.
		else if (pairs[pair_stack[i]] !== undefined) {
			if (pairs[pair_stack[i]] !== count) { return false; }
			count--;
			pairs[pair_stack[i]] = undefined;
		}
	}
	return true;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a layers_face (ensure that it is flat/only numbers)
 * convert a stack of taco_faces in the form of [[f1,f2], [f3,f4]]
 * into a flat array of the layers_face where each face is now an index
 * to the location of the pair the face is inside of in taco_faces.
 */
const build_layers = (layers_face, faces_pair) => layers_face
	.map(f => faces_pair[f])
	.filter(a => a !== undefined);

const validateLayerSolver = (faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon) => {
	// if the strip contains "F" assignments, layers_face will contain
	// a mix of numbers and arrays of numbers, like: [1, 0, 5, [3, 4], 2]
	// as [3,4] are on the same "layer".
	// flatten this array so all numbers get pushed onto the top level, like:
	// [1, 0, 5, [3, 4], 2] into [1, 0, 5, 3, 4, 2].
	// now, this does create a layer preference between (3 and 4 in this example),
	// but in this specific use case we can be guaranteed that only one of those
	// will be used in the build_layers, as only one of a set of flat-
	// strip faces can exist in one taco stack location.
	const flat_layers_face = math.core.flattenArrays(layers_face);
	// taco-tortilla intersections
	if (!validateTacoTortillaStrip(
		faces_folded, layers_face, circ_and_done, epsilon
	)) { return false; }
	// taco-taco intersections
	for (let i = 0; i < taco_face_pairs.length; i++) {
		const pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
		if (!validateTacoTacoFacePairs(pair_stack)) { return false; }
	}
	return true;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
/**
 * these are the only creases that change the direction of the paper
 */
const change_map = { V: true, v: true, M: true, m: true };
/**
 * @description convert a list of assignments into an array of
 * booleans stating if that face between the pair of assignments
 * has been flipped (true) or not (false). the first face is false.
 * 
 * another way of saying this is if a face is "false", the face is
 * moving to the right, if "true" moving to the left.
 */
const assignmentsToFacesFlip = (assignments) => {
	let counter = 0;
	// because fencepost, and we are hard-coding the first face to be false,
	// we don't need to append the first post back to the end of this slice.
	const shifted_assignments = assignments.slice(1);
	// globally, the location that each fold takes place along the +X
	return [false].concat(shifted_assignments
		.map(a => change_map[a] ? ++counter : counter)
		.map(count => count % 2 === 1));
};
/**
 * model the movement of layers above or below the previous layer after a fold.
 * valley fold sets the paper above the previous sector (and mountain below),
 * but a valley fold AFTER a valley fold moves the paper below.
 */
const up_down = { V: 1, v: 1, M: -1, m: -1 };
const upOrDown = (mv, i) => i % 2 === 0
	?  (up_down[mv] || 0)
	: -(up_down[mv] || 0);
/**
 * @description convert a list of assignments into an array of
 * numbers stating if that face between the pair of assignments
 * has been raised above or below the previous face in the +Z axis.
 * 
 * +1 means this face lies above the previous face, -1 below.
 * the first face implicitly starts at 0.
 * 
 * These values describe the relationship between the current index
 * and the next face (i + 1)%length index. and it describes the location
 * of the second of the pair.
 * index [0] indicates how face [1] is above/below face[0].
 * @returns {number[]} unit directionality. +1 for up, -1 down
 */
const assignmentsToFacesVertical = (assignments) => {
	let iterator = 0;
	// because fencepost, we are relating assignments[1] to face[0]
	return assignments
		.slice(1)
		.concat([assignments[0]])
		.map(a => {
			const updown = upOrDown(a, iterator);
			iterator += up_down[a] === undefined ? 0 : 1;
			return updown;
		});
};
/**
 * @description Given an array of sectors (defined by length),
 * and a fenceposted-array of fold assignments, fold the sectors
 * along the numberline, returning each sector as a pair of numbers
 * that mark the two ends of the of the folded sector: [end1, end2].
 * The first sector is always starts at 0, and spans [0, sector].
 * 
 * When a boundary edge is encountered, the walk stops, no sectors after
 * the boundary will be included in the result. The algorithm will walk in
 * one direction, incrementing, starting at index "start", stopping at "end".
 * 
 * @returns array of sector positions. any sectors caught between
 * multiple boundaries will be undefined.
 */
const foldStripWithAssignments = (faces, assignments) => {
	// one number for each sector, locally, the movement away from 0.
	const faces_end = assignmentsToFacesFlip(assignments)
		.map((flip, i) => faces[i] * (flip ? -1 : 1));
	// the cumulative position for each sector, stored as an array of 2:
	// [ the start of the sector, the end of the sector ]
	const cumulative = faces.map(() => undefined);
	cumulative[0] = [0, faces_end[0]];
	for (let i = 1; i < faces.length; i++) {
		if (assignments[i] === "B" || assignments[i] === "b") { break; }
		const prev = (i - 1 + faces.length) % faces.length;
		const prev_end = cumulative[prev][1];
		cumulative[i] = [prev_end, prev_end + faces_end[i]];
	}
	return cumulative;
};

var foldAssignments = /*#__PURE__*/Object.freeze({
	__proto__: null,
	assignmentsToFacesFlip: assignmentsToFacesFlip,
	assignmentsToFacesVertical: assignmentsToFacesVertical,
	foldStripWithAssignments: foldStripWithAssignments
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
const is_boundary = { "B": true, "b": true };
/**
 * @description given an ordered set of faces and crease assignments
 * between the faces, this recursive algorithm finds every combination
 * of layer orderings that work without causing any self-intersections.
 * "faces" could be 1D lines, the term could be switched out here.
 * @param {number[]} ordered unsigned scalars, the length of paper between folds
 * @param {string[]} array of "M","V", assignment of fold between faces
 * @returns {number[][]} array of arrays. each inner array is a solution.
 * each solution is an ordering of faces_order, where each index is a
 * face and each value is the layer the face occupies.
 */
const singleVertexSolver = (ordered_scalars, assignments, epsilon = math.core.EPSILON) => {
	const faces_folded = foldStripWithAssignments(ordered_scalars, assignments);
	const faces_updown = assignmentsToFacesVertical(assignments);
	// todo: we only really need to check index [0] and [length-1]
	const is_circular = assignments
		.map(a => !(is_boundary[a]))
		.reduce((a, b) => a && b, true);
	// if the sector contains no boundary (cuts), check if the folded state
	// start and end line up, if not, it's clear no solution is possible.
	if (is_circular) {
		const start = faces_folded[0][0];
		const end = faces_folded[faces_folded.length - 1][1];
		if (Math.abs(start - end) > epsilon) { return []; }
	}	// prepare tacos ahead of time, since we know the fold locations
	// only grab the left and right tacos. return their adjacent faces in the
	// form of which pair they are a part of, as an inverted array.
	// taco-tortilla testing will happen using a different data structure.
	const taco_face_pairs = makeFoldedStripTacos(faces_folded, is_circular, epsilon)
		.map(taco => [taco.left, taco.right]
			.map(invertMap)
			.filter(arr => arr.length > 1))
		.reduce((a, b) => a.concat(b), []);
	/**
	 * @description Consectively visit each face from 0...n, recursively
	 * inserting it above or below the current position (in all slots above
	 * or below). At the beginning of the recusive function check if there is a
	 * violation where the newly-inserted face is causing a self-intersection.
	 * @param {number[]} layering is an inverted form of the final return value.
	 * indices represent layers, from 0 to N, moving upwards in +Z space,
	 * and faces will be inserted into layers as we search for a layer ordering.
	 * @param {number} iteration count, relates directly to the face index
	 * @param {number} layer, the +Z index layer currently being added to,
	 * this is the splice index of layers_face we will be adding the face to.
	 */
	const recurse = (layers_face = [0], face = 0, layer = 0) => {
		const next_face = face + 1;
		// will the next face be above or below the current face's position?
		const next_dir = faces_updown[face];
		// because this test will run during the intermediate assembly of a strip.
		// the strip may eventually be circular, but currently it isn't.
		// set this boolean to be true only if we are also at the end.
		const is_done = face >= ordered_scalars.length - 1;
		// is circular AND is done (just added the final face)
		const circ_and_done = is_circular && is_done;
		// test for any self-intersections throughout the entire layering
		if (!validateLayerSolver(
			faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon
		)) {
			return [];
		}
		// just before exit.
		// the final crease must turn the correct direction back to the start.
		if (circ_and_done) {
			// next_dir is now indicating the direction from the final face to the
			// first face, test if this also matches the orientation of the faces.
			const faces_layer = invertMap(layers_face);
			const first_face_layer = faces_layer[0];
			const last_face_layer = faces_layer[face];
			if (next_dir > 0 && last_face_layer > first_face_layer) { return []; }
			if (next_dir < 0 && last_face_layer < first_face_layer) { return []; }
			// todo: what about === 0 ?
		}    

		// Exit case. all faces have been traversed.
		if (is_done) { return [layers_face]; }
		// Continue case.
		// depending on the direction of the next face (above, below, same level),
		// insert the face into one or many places, then repeat the recursive call.
		// note: causing a self-intersection is possible, hence, check at beginning
		if (next_dir === 0) {
			// append the next face into this layer (making it an array if necessary)
			// and repeat the recursion with no additional layers, just this one.
			layers_face[layer] = [next_face].concat(layers_face[layer]);
			// no need to call .slice() on layers_face. only one path forward.
			return recurse(layers_face, next_face, layer);
		}
		// given our current position (layer) and next_dir (up or down),
		// get the subarray that's either above or below the current layer.
		// these are all the indices we will attempt to insert the new face.
		// - below: [0, layer]. includes layer
		// - above: (layer, length]. excludes layer. includes length (# of faces)
		// this way all indices (including +1 at the end) are covered once.
		// these are used in the splice() method, 0...Length, inserting an element
		// will place the new element before the old element at that same index.
		// so, we need +1 indices (at the end) to be able to append to the end.
		const splice_layers = next_dir === 1
			? Array.from(Array(layers_face.length - layer))
				.map((_, i) => layer + i + 1)
			: Array.from(Array(layer + 1))
				.map((_, i) => i);
		// recursively attempt to fit the next folded face at all possible layers.
		// make a deep copy of the layers_face arrays.
		const next_layers_faces = splice_layers.map(i => clone(layers_face));
		// insert the next_face into all possible valid locations (above or below)
		next_layers_faces
			.forEach((layers, i) => layers.splice(splice_layers[i], 0, next_face));
		// recursively call 
		return next_layers_faces
			.map((layers, i) => recurse(layers, next_face, splice_layers[i]))
			.reduce((a, b) => a.concat(b), []);
	};
	// after collecting all layers_face solutions, convert them into faces_layer
	return recurse().map(invertMap);
};

/**
 * Rabbit Ear (c) Kraft
 */
const get_unassigned_indices = (edges_assignment) => edges_assignment
	.map((_, i) => i)
	.filter(i => edges_assignment[i] === "U" || edges_assignment[i] === "u");

// sectors and assignments are fenceposted.
// sectors[i] is bounded by assignment[i] assignment[i + 1]
/**
 * @description given a set of assignments (M/V/F/B/U characters), which contains
 * some U (unassigned), find all permutations of mountain valley to replace all U.
 * This function solves only one single vertex, the assignments are sorted radially
 * around the vertex. This validates according to Maekawa's theorem only.
 * @param {string[]} vertices_edges_assignments array of single character
 * FOLD spec edges assignments.
 * @returns {string[][]} array of arrays of strings, all permutations where "U"
 * assignments have been replaced with "V" or "M".
 * @linkcode Origami ./src/singleVertex/maekawaAssignments.js 19
 */
const maekawaAssignments = (vertices_edges_assignments) => {
	const unassigneds = get_unassigned_indices(vertices_edges_assignments);
	const permuts = Array.from(Array(2 ** unassigneds.length))
		.map((_, i) => i.toString(2))
		.map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
		.map(str => Array.from(str).map(l => (l === "0" ? "V" : "M")));
	const all = permuts.map(perm => {
		const array = vertices_edges_assignments.slice();
		unassigneds.forEach((index, i) => { array[index] = perm[i]; });
		return array;
	});
	if (vertices_edges_assignments.includes("B")
		|| vertices_edges_assignments.includes("b")) {
		return all;
	}
	const count_m = all.map(a => a.filter(l => l === "M" || l === "m").length);
	const count_v = all.map(a => a.filter(l => l === "V" || l === "v").length);
	return all.filter((_, i) => Math.abs(count_m[i] - count_v[i]) === 2);
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
const assignmentSolver = (faces, assignments, epsilon) => {
	if (assignments == null) {
		assignments = faces.map(() => "U");
	}
	// enumerate all possible assignments by replacing "U" with both "M" and "V"
	const all_assignments = maekawaAssignments(assignments);
	const layers = all_assignments
		.map(assigns => singleVertexSolver(faces, assigns, epsilon));
	return all_assignments
		.map((_, i) => i)
		.filter(i => layers[i].length > 0)
		.map(i => ({
			assignment: all_assignments[i],
			layer: layers[i],
		}));
};

/**
 * Rabbit Ear (c) Kraft
 */
// import * as edges_crossing from "./matrix/edges_crossing";
// import * as relationships from "./matrix/relationships";
// import * as pleat_paths from "./matrix/pleat_paths";

/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
var layer = Object.assign(
	Object.create(null),
	{
		makeFacesLayer,
		makeFacesLayers,
		flipFacesLayer,

		assignmentSolver,
		singleVertexSolver,
		validateLayerSolver,
		validateTacoTacoFacePairs,
		validateTacoTortillaStrip,

		table: slow_lookup,
		makeConditions,
		makeTacoMaps,
		recursiveSolver,
		singleSolver,
		dividingAxis,
		topologicalOrder,
		conditionsToMatrix,

		makeTacosTortillas,
		makeFoldedStripTacos,
		makeTransitivityTrios,
	},
	globalSolvers,
	globalSolverGeneral,
	edgesAssignments,
	tortillaTortilla,
	foldAssignments,
);

/**
 * Rabbit Ear (c) Kraft
 */
const odd_assignment = (assignments) => {
	let ms = 0;
	let vs = 0;
	for (let i = 0; i < assignments.length; i += 1) {
		if (assignments[i] === "M" || assignments[i] === "m") { ms += 1; }
		if (assignments[i] === "V" || assignments[i] === "v") { vs += 1; }
	}
	for (let i = 0; i < assignments.length; i += 1) {
		if (ms > vs && (assignments[i] === "V" || assignments[i] === "v")) { return i; }
		if (vs > ms && (assignments[i] === "M" || assignments[i] === "m")) { return i; }
	}
	return undefined;
};
/**
 * @description fold a degree-4 single vertex in 3D.
 * @usage this only works for degree-4 vertices
 * @param {number[]} sectors an array of sector angles, sorted, around the single vertex.
 * @param {string[]} assignments an array of FOLD spec characters, "M" or "V".
 * @param {number} t the fold amount between 0 and 1.
 * @returns {number[]} four fold angles as numbers in an array.
 * @linkcode Origami ./src/singleVertex/foldAngles4.js 24
 */
const foldAngles4 = (sectors, assignments, t = 0) => {
	const odd = odd_assignment(assignments);
	if (odd === undefined) { return; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];

	// const pab = (odd + 2) % sectors.length;
	// const pbc = (odd + 3) % sectors.length;
	const pbc = Math.PI * t;

	const cosE = -Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc)
		- ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))
		/ (1 - cosE);

	const pab = -Math.acos(res) + Math.PI;
	return (odd % 2 === 0
		? [pab, pbc, pab, pbc].map((n, i) => (odd === i ? -n : n))
		: [pbc, pab, pbc, pab].map((n, i) => (odd === i ? -n : n)));
};

/**
 * Rabbit Ear (c) Kraft
 */

// todo: this is doing too much work in preparation
/**
 * @description given a single vertex in a graph which does not yet satisfy Kawasaki's theorem,
 * find all possible single-ray additions which when added to the set, the set
 * satisfies Kawasaki's theorem.
 * @usage this is hard coded to work for flat-plane, where sectors sum to 360deg
 * @param {object} graph a FOLD object
 * @param {number} vertex the index of the vertex
 * @returns {number[][]} for every sector either one vector or
 * undefined if that sector contains no solution.
 * @linkcode Origami ./src/singleVertex/kawasakiGraph.js 21
 */
const kawasakiSolutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
	// to calculate Kawasaki's theorem, we need the 3 edges
	// as vectors, and we need them sorted radially.
	if (!edges_vectors) {
		edges_vectors = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
	const sortedVectors = math.core.counterClockwiseOrder2(vectors)
		.map(i => vectors[i]);
	return kawasakiSolutionsVectors(sortedVectors);
};

var kawasakiGraph = /*#__PURE__*/Object.freeze({
	__proto__: null,
	kawasakiSolutions: kawasakiSolutions
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description A collection of operations done on single vertices
 * (one vertex in a graph typically surrounded by edges).
 */
var singleVertex = Object.assign(
	Object.create(null),
	{
		maekawaAssignments,
		foldAngles4,
	},
	kawasakiMath,
	kawasakiGraph,
	validateSingleVertex,
);

var ar = [
	null,
	"اصنع خطاً يمر بنقطتين",
	"اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى",
	"اصنع خطاً عن طريق طي خط واحد على آخر",
	"اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه",
	"اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط",
	"اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني",
	"اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه"
];
var de = [
	null,
	"Falte eine Linie durch zwei Punkte",
	"Falte zwei Punkte aufeinander",
	"Falte zwei Linien aufeinander",
	"Falte eine Linie auf sich selbst, falte dabei durch einen Punkt",
	"Falte einen Punkt auf eine Linie, falte dabei durch einen anderen Punkt",
	"Falte einen Punkt auf eine Linie und einen weiteren Punkt auf eine weitere Linie",
	"Falte einen Punkt auf eine Linie und eine weitere Linie in sich selbst zusammen"
];
var en = [
	null,
	"fold a line through two points",
	"fold two points together",
	"fold two lines together",
	"fold a line on top of itself, creasing through a point",
	"fold a point to a line, creasing through another point",
	"fold a point to a line and another point to another line",
	"fold a point to a line and another line onto itself"
];
var es = [
	null,
	"dobla una línea entre dos puntos",
	"dobla dos puntos juntos",
	"dobla y une dos líneas",
	"dobla una línea sobre sí misma, doblándola hacia un punto",
	"dobla un punto hasta una línea, doblándola a través de otro punto",
	"dobla un punto hacia una línea y otro punto hacia otra línea",
	"dobla un punto hacia una línea y otra línea sobre sí misma"
];
var fr = [
	null,
	"créez un pli passant par deux points",
	"pliez pour superposer deux points",
	"pliez pour superposer deux lignes",
	"rabattez une ligne sur elle-même à l'aide d'un pli qui passe par un point",
	"rabattez un point sur une ligne à l'aide d'un pli qui passe par un autre point",
	"rabattez un point sur une ligne et un autre point sur une autre ligne",
	"rabattez un point sur une ligne et une autre ligne sur elle-même"
];
var hi = [
	null,
	"एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है",
	"एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ",
	"एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ",
	"एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है",
	"एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है",
	"एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है",
	"एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है"
];
var jp = [
	null,
	"2点に沿って折り目を付けます",
	"2点を合わせて折ります",
	"2つの線を合わせて折ります",
	"点を通過させ、既にある線に沿って折ります",
	"点を線沿いに合わせ別の点を通過させ折ります",
	"線に向かって点を折り、同時にもう一方の線に向かってもう一方の点を折ります",
	"線に向かって点を折り、同時に別の線をその上に折ります"
];
var ko = [
	null,
	"두 점을 통과하는 선으로 접으세요",
	"두 점을 함께 접으세요",
	"두 선을 함께 접으세요",
	"그 위에 선을 접으면서 점을 통과하게 접으세요",
	"점을 선으로 접으면서, 다른 점을 지나게 접으세요",
	"점을 선으로 접고 다른 점을 다른 선으로 접으세요",
	"점을 선으로 접고 다른 선을 그 위에 접으세요"
];
var ms = [
	null,
	"lipat garisan melalui dua titik",
	"lipat dua titik bersama",
	"lipat dua garisan bersama",
	"lipat satu garisan di atasnya sendiri, melipat melalui satu titik",
	"lipat satu titik ke garisan, melipat melalui titik lain",
	"lipat satu titik ke garisan dan satu lagi titik ke garisan lain",
	"lipat satu titik ke garisan dan satu lagi garisan di atasnya sendiri"
];
var pt = [
	null,
	"dobre uma linha entre dois pontos",
	"dobre os dois pontos para uni-los",
	"dobre as duas linhas para uni-las",
	"dobre uma linha sobre si mesma, criando uma dobra ao longo de um ponto",
	"dobre um ponto até uma linha, criando uma dobra ao longo de outro ponto",
	"dobre um ponto até uma linha e outro ponto até outra linha",
	"dobre um ponto até uma linha e outra linha sobre si mesma"
];
var ru = [
	null,
	"сложите линию через две точки",
	"сложите две точки вместе",
	"сложите две линии вместе",
	"сверните линию сверху себя, сгибая через точку",
	"сложите точку в линию, сгибая через другую точку",
	"сложите точку в линию и другую точку в другую линию",
	"сложите точку в линию и другую линию на себя"
];
var tr = [
	null,
	"iki noktadan geçen bir çizgi boyunca katla",
	"iki noktayı birbirine katla",
	"iki çizgiyi birbirine katla",
	"bir noktadan kıvırarak kendi üzerindeki bir çizgi boyunca katla",
	"başka bir noktadan kıvırarak bir noktayı bir çizgiye katla",
	"bir noktayı bir çizgiye ve başka bir noktayı başka bir çizgiye katla",
	"bir noktayı bir çizgiye ve başka bir çizgiyi kendi üzerine katla"
];
var vi = [
	null,
	"tạo một nếp gấp đi qua hai điểm",
	"tạo nếp gấp bằng cách gấp một điểm này sang điểm khác",
	"tạo nếp gấp bằng cách gấp một đường lên một đường khác",
	"tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó",
	"tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng",
	"tạo một nếp gấp mang điểm đầu tiên đến đường đầu tiên và điểm thứ hai cho đường thứ hai",
	"tạo một nếp gấp mang lại một điểm cho một đường và đưa một đường thứ hai lên trên chính nó"
];
var zh = [
	null,
	"通過兩點折一條線",
	"將兩點折疊起來",
	"將兩條線折疊在一起",
	"通過一個點折疊一條線在自身上面",
	"將一個點，通過另一個點折疊成一條線，",
	"將一個點折疊為一條線，再將另一個點折疊到另一條線",
	"將一個點折疊成一條線，另一條線折疊到它自身上"
];
var axioms = {
	ar: ar,
	de: de,
	en: en,
	es: es,
	fr: fr,
	hi: hi,
	jp: jp,
	ko: ko,
	ms: ms,
	pt: pt,
	ru: ru,
	tr: tr,
	vi: vi,
	zh: zh
};

var fold = {
	es: "doblez"
};
var sink = {
};
var blintz = {
	zh: "坐墊基"
};
var squash = {
	zh: "壓摺"
};
var instructions = {
	fold: fold,
	"valley fold": {
	es: "doblez de valle",
	zh: "谷摺"
},
	"mountain fold": {
	es: "doblez de montaña",
	zh: "山摺"
},
	"inside reverse fold": {
	zh: "內中割摺"
},
	"outside reverse fold": {
	zh: "外中割摺"
},
	sink: sink,
	"open sink": {
	zh: "開放式沉壓摺"
},
	"closed sink": {
	zh: "封閉式沉壓摺"
},
	"rabbit ear": {
	zh: "兔耳摺"
},
	"double rabbit ear": {
	zh: "雙兔耳摺"
},
	"petal fold": {
	zh: "花瓣摺"
},
	blintz: blintz,
	squash: squash,
	"flip over": {
	es: "dale la vuelta a tu papel"
}
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description A multi-lingual raw-text reference containing a rudimentary
 * set of origami operations, the aim being to parameterize origami instructions
 * allowing us to be able to easily convert from one language to another.
 * @linkcode Origami ./src/text/index.js 10
 */
var text = {
	axioms,
	instructions,
};

/**
 * Rabbit Ear (c) Kraft
 */

// this method allows you to attach an outside library to this one
// this library RabbitEar will have been bound to "this"
const use = function (library) {
	if (library == null || typeof library.linker !== "function") {
		return;
	}
	library.linker(this);
};

/**
 * Rabbit Ear (c) Kraft
 */

const verticesCircle = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords) { return g; }
	graph.vertices_coords
		.map(v => root.svg.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g.appendChild(v));
	// default style
	g.setAttributeNS(null, "fill", _none);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

/**
 * Rabbit Ear (c) Kraft
 */
// import * as S from "../general/strings";
/**
 * @description given a FOLD object, gather all the class names and return
 * them in a single array
 * @param {object} FOLD graph
 * @returns {string[]} an array of class names
 */
// const foldClasses = graph => [
// 	(graph[S._file_classes] ? graph[S._file_classes] : []),
// 	(graph[S._frame_classes] ? graph[S._frame_classes] : []),
// ].reduce((a, b) => a.concat(b));

// export default foldClasses;

const addClassToClassList = (el, ...classes) => {
	if (!el) { return; }
	const hash = {};
	const getClass = el.getAttribute("class");
	const classArray = getClass ? getClass.split(" ") : [];
	classArray.push(...classes);
	classArray.forEach(str => { hash[str] = true; });
	const classString = Object.keys(hash).join(" ");
	el.setAttribute("class", classString);
};

/**
 * Rabbit Ear (c) Kraft
 */

const GROUP_FOLDED = {};

const GROUP_FLAT = {
	stroke: _black,
};

const STYLE_FOLDED = {};

const STYLE_FLAT = {
	M: { stroke: "red" },
	m: { stroke: "red" },
	V: { stroke: "blue" },
	v: { stroke: "blue" },
	F: { stroke: "lightgray" },
	f: { stroke: "lightgray" },
};

/**
 * @returns {object} an object with 5 keys, each value is an array
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 * if no edges_assignment, or only some defined, remaining edges become "unassigned"
 */
const edgesAssignmentIndices = (graph) => {
	const assignment_indices = {
		u: [], f: [], v: [], m: [], b: [],
	};
	const lowercase_assignment = graph[_edges_assignment]
		.map(a => a.toLowerCase());
	graph[_edges_vertices]
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
	return assignment_indices;
};

const edgesCoords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
/**
 * a segment is a line segment in the form: [[x1, y1], [x2, y2]]
 */
const segmentToPath = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;

const edgesPathData = (graph) => edgesCoords(graph)
	.map(segment => segmentToPath(segment)).join("");

const edgesPathDataAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edgesPathData({ vertices_coords, edges_vertices }) });
	}
	// const segments = edgesCoords({ vertices_coords, edges_vertices, edges_assignment });
	const data = edgesAssignmentIndices({ vertices_coords, edges_vertices, edges_assignment });
	// replace each value in data from array of indices [1,2,3] to path string "M2,3L2.."
	Object.keys(data).forEach(key => {
		data[key] = edgesPathData({
			vertices_coords,
			edges_vertices: data[key].map(i => edges_vertices[i]),
		});
	});
	Object.keys(data).forEach(key => {
		if (data[key] === "") { delete data[key]; }
	});
	return data;
};

/**
 * replace edgesPathDataAssign values from path strings "M2,3L.." to <path> elements
 */
const edgesPathsAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edgesPathDataAssign({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(assignment => {
		const path = root.svg.path(data[assignment]);
		addClassToClassList(path, edgesAssignmentNames[assignment]);
		// path.setAttributeNS(null, S._class, edgesAssignmentNames[assignment]);
		data[assignment] = path;
	});
	return data;
};

const applyEdgesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
const edgesPaths = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const paths = edgesPathsAssign(graph);
	Object.keys(paths).forEach(key => {
		addClassToClassList(paths[key], edgesAssignmentNames[key]);
		// paths[key].classList.add(edgesAssignmentNames[key]);
		// paths[key].setAttributeNS(null, S._class, edgesAssignmentNames[key]);
		applyEdgesStyle(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
		applyEdgesStyle(paths[key], attributes[key]);
		applyEdgesStyle(paths[key], attributes[edgesAssignmentNames[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edgesAssignmentNames[key], { get: () => paths[key] });
	});
	applyEdgesStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	// todo: everything else that isn't a class name. filter out classes
	// const no_class_attributes = Object.keys(attributes).filter(
	applyEdgesStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};

const angleToOpacity = (foldAngle) => (Math.abs(foldAngle) / 180);

const edgesLines = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: makeEdgesAssignment(graph))
		.map(assign => assign.toLowerCase());
	const groups_by_key = {};
	["b", "m", "v", "f", "u"].forEach(k => {
		const child_group = root.svg.g();
		group.appendChild(child_group);
		addClassToClassList(child_group, edgesAssignmentNames[k]);
		// child_group.classList.add(edgesAssignmentNames[k]);
		// child_group.setAttributeNS(null, S._class, edgesAssignmentNames[k]);
		applyEdgesStyle(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
		applyEdgesStyle(child_group, attributes[edgesAssignmentNames[k]]);
		Object.defineProperty(group, edgesAssignmentNames[k], {
			get: () => child_group,
		});
		groups_by_key[k] = child_group;
	});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => root.svg.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return; }
			line.setAttributeNS(null, "opacity", angleToOpacity(angle));
		});
	}
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));

	applyEdgesStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	applyEdgesStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});

	return group;
};

const drawEdges = (graph, attributes) => (
	edgesFoldAngleAreAllFlat(graph)
		? edgesPaths(graph, attributes)
		: edgesLines(graph, attributes)
);

// const make_edgesAssignmentNames = ({ edges_vertices, edges_assignment }) => {
// 	if (!edges_vertices) { return []; }
// 	if (!edges_assignment) { return edges_vertices.map(() => edgesAssignmentNames["u"]); }
// 	return edges_vertices
// 		.map((_, i) => edges_assignment[i])
// 		.map((a) => edgesAssignmentNames[(a ? a : "u")]);
// };

// const edgesLines = ({ vertices_coords, edges_vertices, edges_assignment }) => {
// 	if (!vertices_coords || !edges_vertices) { return []; }
//   const svg_edges = edgesCoords({ vertices_coords, edges_vertices })
//     .map(e => libraries.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
//   make_edgesAssignmentNames(graph)
//     .foreach((a, i) => svg_edges[i][k.setAttributeNS](null, k._class, a));
//   return svg_edges;
// };

/**
 * Rabbit Ear (c) Kraft
 */

const FACE_STYLE_FOLDED_ORDERED = {
	back: { fill: _white },
	front: { fill: "#ddd" },
};
const FACE_STYLE_FOLDED_UNORDERED = {
	back: { opacity: 0.1 },
	front: { opacity: 0.1 },
};
const FACE_STYLE_FLAT = {
	// back: { fill: "white", stroke: "none" },
	// front: { fill: "#ddd", stroke: "none" }
};
const GROUP_STYLE_FOLDED_ORDERED = {
	stroke: _black,
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FOLDED_UNORDERED = {
	stroke: _none,
	fill: _black,
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FLAT = {
	fill: _none,
};

const faces_sorted_by_layer = function (faces_layer) {
	return faces_layer.map((layer, i) => ({ layer, i }))
		.sort((a, b) => a.layer - b.layer)
		.map(el => el.i);
};

const applyFacesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @description this method will check for layer order, face windings,
 * and apply a style to each face accordingly, adds them to the group,
 * and applies style attributes to the group itself too.
 */
const finalize_faces = (graph, svg_faces, group, attributes) => {
	const isFolded = isFoldedForm(graph);
	// currently, layer order is determined by "faces_layer" key, and
	// ensuring that the length matches the number of faces in the graph.
	const orderIsCertain = graph[_faces_layer] != null
		&& graph[_faces_layer].length === graph[_faces_vertices].length;
	const classNames = [[_front], [_back]];
	const faces_winding = makeFacesWinding(graph);
	// counter-clockwise faces are "face up", their front facing the camera
	// clockwise faces means "flipped", their back is facing the camera.
	// set these class names, and apply the style as attributes on each face.
	faces_winding.map(w => (w ? classNames[0] : classNames[1]))
		.forEach((className, i) => {
			addClassToClassList(svg_faces[i], className);
			// svg_faces[i].classList.add(className);
			// svg_faces[i].setAttributeNS(null, S._class, className);
			applyFacesStyle(svg_faces[i], (isFolded
				? (orderIsCertain
					? FACE_STYLE_FOLDED_ORDERED[className]
					: FACE_STYLE_FOLDED_UNORDERED[className])
				: FACE_STYLE_FLAT[className]));
			applyFacesStyle(svg_faces[i], attributes[className]);
		});
	// if the layer-order exists, sort the faces in order of faces_layer
	const facesInOrder = (orderIsCertain
		? faces_sorted_by_layer(graph[_faces_layer]).map(i => svg_faces[i])
		: svg_faces);
	facesInOrder.forEach(face => group.appendChild(face));
	// these custom getters allows you to grab all "front" or "back" faces only.
	Object.defineProperty(group, _front, {
		get: () => svg_faces.filter((_, i) => faces_winding[i]),
	});
	Object.defineProperty(group, _back, {
		get: () => svg_faces.filter((_, i) => !faces_winding[i]),
	});
	// set style attributes to the group itself which contains the faces.
	applyFacesStyle(group, (isFolded
		? (orderIsCertain
			? GROUP_STYLE_FOLDED_ORDERED
			: GROUP_STYLE_FOLDED_UNORDERED)
		: GROUP_STYLE_FLAT));
	return group;
};
/**
 * @description build SVG faces using faces_vertices data. this is
 * slightly faster than the other method which uses faces_edges.
 * @returns {SVGElement[]} an SVG <g> group element containing all
 * of the <polygon> faces as children.
 */
const facesVerticesPolygon = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
	const svg_faces = graph.faces_vertices
		.map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
		.map(face => root.svg.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i)); // `${i}`));
	g.setAttributeNS(null, "fill", _white);
	return finalize_faces(graph, svg_faces, g, attributes);
};
/**
 * @description build SVG faces using faces_edges data. this is
 * slightly slower than the other method which uses faces_vertices.
 * @returns {SVGElement[]} an SVG <g> group element containing all
 * of the <polygon> faces as children.
 */
const facesEdgesPolygon = function (graph, attributes = {}) {
	const g = root.svg.g();
	if (!graph
		|| _faces_edges in graph === false
		|| _edges_vertices in graph === false
		|| _vertices_coords in graph === false) {
		return g;
	}
	const svg_faces = graph[_faces_edges]
		.map(face_edges => face_edges
			.map(edge => graph[_edges_vertices][edge])
			.map((vi, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
			// }).map(v => graph[S._vertices_coords][v]))
			}).map(v => [0, 1].map(i => graph[_vertices_coords][v][i])))
		.map(face => root.svg.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i)); // `${i}`));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, attributes);
};

/**
 * Rabbit Ear (c) Kraft
 */

const FOLDED = {
	// stroke: "none",
	fill: _none,
};
const FLAT = {
	stroke: _black,
	fill: _white,
};

const applyBoundariesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
const boundariesPolygon = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph
		|| !graph.vertices_coords
		|| !graph.edges_vertices
		|| !graph.edges_assignment) {
		return g;
	}
	const boundary = getBoundary(graph)
		.vertices
		.map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
	if (boundary.length === 0) { return g; }
	// create polygon, append to group
	const poly = root.svg.polygon(boundary);
	addClassToClassList(poly, _boundary);
	// poly.setAttributeNS(null, S._class, S._boundary);
	g.appendChild(poly);
	// style attributes on group container
	applyBoundariesStyle(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

/**
 * Rabbit Ear (c) Kraft
 */

// preference for using faces_vertices over faces_edges, it runs faster
const facesDrawFunction = (graph, options) => (
	graph != null && graph[_faces_vertices] != null
		? facesVerticesPolygon(graph, options)
		: facesEdgesPolygon(graph, options));

const svg_draw_func = {
	vertices: verticesCircle,
	edges: drawEdges, // edgesPaths
	faces: facesDrawFunction,
	boundaries: boundariesPolygon,
};

/**
 * @param {string} key will be either "vertices", "edges", "faces", "boundaries"
 */
const drawGroup = (key, graph, options) => {
	const group = options === false ? (root.svg.g()) : svg_draw_func[key](graph, options);
	// group.classList.add(key);
	addClassToClassList(group, key);
	// group.setAttributeNS(null, S._class, key);
	return group;
};
/**
 * @description renders a FOLD object into SVG elements, sorted into groups.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement[]} An array of four <g> elements: boundaries, faces,
 *  edges, vertices, each of the graph components drawn into an SVG group.
 */
const DrawGroups = (graph, options = {}) => [
	_boundaries,
	_faces,
	_edges,
	_vertices].map(key => drawGroup(key, graph, options[key]));

// static style draw methods for individual components
[_boundaries,
	_faces,
	_edges,
	_vertices,
].forEach(key => {
	DrawGroups[key] = function (graph, options = {}) {
		return drawGroup(key, graph, options[key]);
	};
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * link this library to the larger RabbitEar library. this allows
 * Rabbit Ear to be built with or without this extension.
 */
const linker = function (library) {
	// bind fold-to-svg
	library.graph.svg = this;

	const graphProtoMethods = {
		svg: this,
	};
	Object.keys(graphProtoMethods).forEach(key => {
		library.graph.prototype[key] = function () {
			return graphProtoMethods[key](this, ...arguments);
		};
	});
};

/**
 * Rabbit Ear (c) Kraft
 */

const DEFAULT_STROKE_WIDTH = 1 / 100;
const DEFAULT_CIRCLE_RADIUS = 1 / 50;
/**
 * @description get a bounding box from a FOLD graph by inspecting its vertices.
 * @param {object} FOLD object with vertices_coords
 * @returns {number[] | undefined} bounding box as [x, y, width, height]
 *  or undefined if no vertices_coords exist.
 */
const getBoundingRect = ({ vertices_coords }) => {
	if (vertices_coords == null || vertices_coords.length === 0) {
		return undefined;
	}
	const min = Array(2).fill(Infinity);
	const max = Array(2).fill(-Infinity);
	vertices_coords.forEach(v => {
		if (v[0] < min[0]) { min[0] = v[0]; }
		if (v[0] > max[0]) { max[0] = v[0]; }
		if (v[1] < min[1]) { min[1] = v[1]; }
		if (v[1] > max[1]) { max[1] = v[1]; }
	});
	const invalid = Number.isNaN(min[0])
		|| Number.isNaN(min[1])
		|| Number.isNaN(max[0])
		|| Number.isNaN(max[1]);
	return (invalid
		? undefined
		: [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const getViewBox$1 = (graph) => {
	const viewBox = getBoundingRect(graph);
	return viewBox === undefined
		? ""
		: viewBox.join(" ");
};
/**
 * @description given a group assumed to contain only circle elements,
 * set the "r" attribute on all circles.
 */
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i += 1) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};
/**
 * @description search up the parent-chain until we find an <svg>, or return undefined
 */
const findSVGInParents = (element) => {
	if ((element.nodeName || "").toUpperCase() === "SVG") { return element; }
	return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
};
/**
 * @description a subroutine of drawInto(). there are style properties which
 * are impossible to set universally, because they are dependent upon the input
 * FOLD object (imagine, FOLD within 1x1 square, and FOLD within 600x600).
 * this includes the viewBox, stroke width, and radius of circles.
 */
const applyTopLevelOptions = (element, groups, graph, options) => {
	const hasVertices = groups[3] && groups[3].childNodes.length;
	if (!(options.strokeWidth || options.viewBox || hasVertices)) { return; }
	const bounds = getBoundingRect(graph);
	const vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth
			? options.strokeWidth
			: options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: vmax * DEFAULT_STROKE_WIDTH;
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (hasVertices) {
		const userRadius = options.vertices && options.vertices.radius != null
			? options.vertices.radius
			: options.radius;
		const radius = typeof userRadius === "string" ? parseFloat(userRadius) : userRadius;
		const r = typeof radius === "number" && !Number.isNaN(radius)
			? vmax * radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], r);
	}
};
/**
 * @description Inspect the FOLD object for its classes, which will be
 * in "file_classes" and "frame_classes", and set these as classes on
 * the top level element.
 */
const applyTopLevelClasses = (element, graph) => {
	const newClasses = [
		graph.file_classes || [],
		graph.frame_classes || [],
	].flat();
	if (newClasses.length) {
		addClassToClassList(element, ...newClasses);
		// element.classList.add(...newClasses);
	}
};
/**
 * @name drawInto
 * @memberof graph
 * @description renders a FOLD object into an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} element an already initialized SVG DOM element.
 * @param {FOLD} graph a FOLD object
 * @param {object} options an optional options object to style the rendering
 * @returns {SVGElement} the first SVG parameter object.
 * @linkcode Origami ./src/svg/index.js 122
 */
const drawInto = (element, graph, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	applyTopLevelClasses(element, graph);
	// set custom getters on the element to grab the component groups
	Object.keys(DrawGroups)
		.filter(key => element[key] == null)
		.forEach((key, i) => Object.defineProperty(element, key, { get: () => groups[i] }));
	return element;
};
/**
 * @name svg
 * @memberof graph
 * @description renders a FOLD object as an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {object} graph a FOLD object
 * @param {object?} options optional options object to style components
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 * @linkcode Origami ./src/svg/index.js 145
 */
const FOLDtoSVG = (graph, options) => drawInto(root.svg(), graph, options);
/**
 * @description adding static-like methods to the main function, four for
 *  drawing the individual elements, and one drawInto for pre-initialized svgs.
 */
Object.keys(DrawGroups).forEach(key => { FOLDtoSVG[key] = DrawGroups[key]; });
FOLDtoSVG.drawInto = drawInto;
FOLDtoSVG.getViewBox = getViewBox$1;

// .use() to link library to Rabbit Ear, and optionally build without this.
Object.defineProperty(FOLDtoSVG, "linker", {
	enumerable: false,
	value: linker.bind(FOLDtoSVG),
});

/* SVG (c) Kraft, MIT License */
/**
 * SVG (c) Kraft
 */
const SVG_Constructor = {
	init: () => {},
};
/**
 * @name svg
 * @description Create an svg element, the object will be bound with instance
 * methods for creating children and styles.
 * @memberof svg
 * @param {Element} [parent=undefined] optional parent DOM element, this will append to.
 * @param {number} [width=undefined] optional width of viewBox (if present, include height)
 * @param {number} [height=undefined] optional height of viewBox (if present, include width)
 * @param {function} [callback=undefined] optional function which will be
 * executed upon completion of initialization.
 * @returns {Element} one svg DOM element
 * @example
 * var svg = ear.svg(document.body, 640, 480)
 * @example
 * ear.svg(640, 480, document.body, (svg) => {
 *   // window did load, and "svg" is scoped
 * })
 * @linkcode SVG ./src/library.js 24
 */
function SVG () {
	return SVG_Constructor.init(...arguments);
}

/**
 * SVG (c) Kraft
 */
// frequently-used strings
const str_class = "class";
const str_function = "function";
const str_undefined = "undefined";
const str_boolean = "boolean";
const str_number = "number";
const str_string = "string";
const str_object = "object";

const str_svg = "svg";
const str_path = "path";

const str_id = "id";
const str_style = "style";
const str_viewBox = "viewBox";
const str_transform = "transform";
const str_points = "points";
const str_stroke = "stroke";
const str_fill = "fill";
const str_none = "none";

const str_arrow = "arrow";
const str_head = "head";
const str_tail = "tail";

/**
 * SVG (c) Kraft
 */

// compare to "undefined", the string
const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;

const isNode = typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;

const svgErrors = [];

svgErrors[10] = "\"error 010: window\" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )";

/**
 * SVG (c) Kraft
 */

const svgWindowContainer = { window: undefined };

const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");

const setWindow = (newWindow) => {
	// make sure window has a document. xmldom does not, and requires it be built.
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
// if we are in the browser, by default use the browser's "window".
if (isBrowser) { svgWindowContainer.window = window; }
/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw svgErrors[10];
	}
	return svgWindowContainer.window;
};

/**
 * SVG (c) Kraft
 */
/** @description The namespace of an SVG element, the value of the attribute xmlns */
var NS = "http://www.w3.org/2000/svg";

/**
 * SVG (c) Kraft
 */
var NodeNames = {
	s: [  // svg
		"svg",
	],
	d: [  // defs
		"defs",      // can only be inside svg
	],
	h: [  // header
		"desc",      // anywhere, usually top level SVG, or <defs>
		"filter",    // anywhere, usually top level SVG, or <defs>
		"metadata",  // anywhere, usually top level SVG, or <defs>
		"style",     // anywhere, usually top level SVG, or <defs>
		"script",    // anywhere, usually top level SVG, or <defs>
		"title",     // anywhere, usually top level SVG, or <defs>
		"view",      // anywhere.  use attrs ‘viewBox’, ‘preserveAspectRatio’, ‘zoomAndPan’
	],
	c: [  // cdata
		"cdata",
	],
	g: [  // group
		"g",  // can contain drawings
	],
	v: [  // visible (drawing)
		"circle",
		"ellipse",
		"line",
		"path",
		"polygon",
		"polyline",
		"rect",
	],
	t: [  // text
		"text",
	],
	// can contain drawings
	i: [  // invisible
		"marker",    // anywhere, usually top level SVG, or <defs>
		"symbol",    // anywhere, usually top level SVG, or <defs>
		"clipPath",  // anywhere, usually top level SVG, or <defs>
		"mask",      // anywhere, usually top level SVG, or <defs>
	],
	p: [  // patterns
		"linearGradient", // <defs>
		"radialGradient", // <defs>
		"pattern",        // <defs>
	],
	cT: [ // children of text
		"textPath",   // <text>  path and href attributes
		"tspan",      // <text>
	],
	cG: [  // children of gradients
		"stop",           // <linearGradient> <radialGrandient>
	],
	cF: [  // children of filter
		"feBlend",             // <filter>
		"feColorMatrix",       // <filter>
		"feComponentTransfer", // <filter>
		"feComposite",         // <filter>
		"feConvolveMatrix",    // <filter>
		"feDiffuseLighting",   // <filter>
		"feDisplacementMap",   // <filter>
		"feDistantLight",      // <filter>
		"feDropShadow",        // <filter>
		"feFlood",             // <filter>
		"feFuncA",             // <filter>
		"feFuncB",             // <filter>
		"feFuncG",             // <filter>
		"feFuncR",             // <filter>
		"feGaussianBlur",      // <filter>
		"feImage",             // <filter>
		"feMerge",             // <filter>
		"feMergeNode",         // <filter>
		"feMorphology",        // <filter>
		"feOffset",            // <filter>
		"fePointLight",        // <filter>
		"feSpecularLighting",  // <filter>
		"feSpotLight",         // <filter>
		"feTile",              // <filter>
		"feTurbulence",        // <filter>
	],
};

/**
 * SVG (c) Kraft
 */
const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];

var svg_algebra = /*#__PURE__*/Object.freeze({
	__proto__: null,
	svg_add2: svg_add2,
	svg_sub2: svg_sub2,
	svg_scale2: svg_scale2,
	svg_magnitudeSq2: svg_magnitudeSq2,
	svg_magnitude2: svg_magnitude2,
	svg_distanceSq2: svg_distanceSq2,
	svg_distance2: svg_distance2,
	svg_polar_to_cart: svg_polar_to_cart
});

/**
 * SVG (c) Kraft
 */

const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
	if (endAngle == null) { return ""; }
	const start = svg_polar_to_cart(startAngle, radius);
	const end = svg_polar_to_cart(endAngle, radius);
	const arcVec = [end[0] - start[0], end[1] - start[1]];
	const py = start[0] * end[1] - start[1] * end[0];
	const px = start[0] * end[0] + start[1] * end[1];
	const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? `M ${x},${y} l ${start[0]},${start[1]} `
		: `M ${x + start[0]},${y + start[1]} `);
	d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
	if (includeCenter) { d += " Z"; }
	return d;
};

/**
 * SVG (c) Kraft
 */

const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];

var Arc = {
	arc: {
		nodeName: str_path,
		attributes: ["d"],
		args: arcArguments,
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
		},
	},
};

/**
 * SVG (c) Kraft
 */

const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];

var Wedge = {
	wedge: {
		nodeName: str_path,
		args: wedgeArguments,
		attributes: ["d"],
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
		},
	},
};

/**
 * SVG (c) Kraft
 */
const COUNT = 128;

const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
	.from(Array(COUNT + 1))
	.map((_, i) => ((i - (COUNT)) / COUNT) * 2 + 1)
	.map(i => [
		x + (i + 1) * width * 0.5,
		y + (i ** 2) * height,
	]);

const parabolaPathString = (a, b, c, d) => [
	parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" "),
];

/**
 * SVG (c) Kraft
 */

var Parabola = {
	parabola: {
		nodeName: "polyline",
		attributes: [str_points],
		args: parabolaPathString
	}
};

/**
 * SVG (c) Kraft
 */
const regularPolygonArguments = (sides, cX, cY, radius) => {
	const origin = [cX, cY];
	// default is point-aligned along the axis.
	// if we want edge-aligned, add this value to the angle.
	// const halfwedge = Math.PI / sides;
	return Array.from(Array(sides))
		.map((el, i) => 2 * Math.PI * (i / sides))
		.map(a => [Math.cos(a), Math.sin(a)])
		.map(pts => origin.map((o, i) => o + radius * pts[i]));
};

const polygonPathString = (sides, cX = 0, cY = 0, radius = 1) => [
	regularPolygonArguments(sides, cX, cY, radius)
		.map(a => `${a[0]},${a[1]}`).join(" "),
];

/**
 * SVG (c) Kraft
 */

var RegularPolygon = {
	regularPolygon: {
		nodeName: "polygon",
		attributes: [str_points],
		args: polygonPathString,
	},
};

/**
 * SVG (c) Kraft
 */
const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
	if (cornerRadius > width / 2) { cornerRadius = width / 2; }
	if (cornerRadius > height / 2) { cornerRadius = height / 2; }
	const w = width - cornerRadius * 2;
	const h = height - cornerRadius * 2;
	const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
	return [[`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ")];
};

/**
 * SVG (c) Kraft
 */

var RoundRect = {
	roundRect: {
		nodeName: str_path,
		attributes: ["d"],
		args: roundRectArguments,
	},
};

/**
 * SVG (c) Kraft
 */
var Case = {
	toCamel: s => s
		.replace(/([-_][a-z])/ig, $1 => $1
			.toUpperCase()
			.replace("-", "")
			.replace("_", "")),
	toKebab: s => s
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
		.toLowerCase(),
	capitalized: s => s
		.charAt(0).toUpperCase() + s.slice(1),
};

/**
 * SVG (c) Kraft
 */

const svg_is_iterable = (obj) => obj != null && typeof obj[Symbol.iterator] === str_function;
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @returns always an array
 */
const svg_semi_flatten_arrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return svg_is_iterable(arguments[0]) && typeof arguments[0] !== str_string
		? svg_semi_flatten_arrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (svg_is_iterable(a)
			? [...svg_semi_flatten_arrays(a)]
			: a));
	}
};

/**
 * SVG (c) Kraft
 */
/**
 * this will extract coordinates from a set of inputs
 * and present them as a stride-2 flat array. length % 2 === 0
 * a 1D array of numbers, alternating x y
 *
 * use flatten() everytime you call this!
 * it's necessary the entries sit at the top level of ...args
 * findCoordinates(...flatten(...args));
 */
var coordinates = (...args) => args
	.filter(a => typeof a === str_number)
	.concat(args
		.filter(a => typeof a === str_object && a !== null)
		.map((el) => {
			if (typeof el.x === str_number) { return [el.x, el.y]; }
			if (typeof el[0] === str_number) { return [el[0], el[1]]; }
			return undefined;
		}).filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []));
// [top-level numbers] concat [{x:,y:} and [0,1]] style

/**
 * SVG (c) Kraft
 */

const ends = [str_tail, str_head];
const stringifyPoint = p => p.join(",");
const pointsToPath = (points) => "M" + points.map(pt => pt.join(",")).join("L") + "Z";

const makeArrowPaths = function (options) {
	// throughout, tail is 0, head is 1
	let pts = [[0,1], [2,3]].map(pt => pt.map(i => options.points[i] || 0));
	let vector = svg_sub2(pts[1], pts[0]);
	let midpoint = svg_add2(pts[0], svg_scale2(vector, 0.5));
	// make sure arrow isn't too small
	const len = svg_magnitude2(vector);
	const minLength = ends
		.map(s => (options[s].visible
			? (1 + options[s].padding) * options[s].height * 2.5
			: 0))
		.reduce((a, b) => a + b, 0);
	if (len < minLength) {
		// check len === exactly 0. don't compare to epsilon here
		const minVec = len === 0 ? [minLength, 0] : svg_scale2(vector, minLength / len);
		pts = [svg_sub2, svg_add2].map(f => f(midpoint, svg_scale2(minVec, 0.5)));
		vector = svg_sub2(pts[1], pts[0]);
	}
	let perpendicular = [vector[1], -vector[0]];
	let bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const bezs = pts.map(pt => svg_sub2(bezPoint, pt));
	const bezsLen = bezs.map(v => svg_magnitude2(v));
	const bezsNorm = bezs.map((bez, i) => bezsLen[i] === 0
		? bez
		: svg_scale2(bez, 1 / bezsLen[i]));
	const vectors = bezsNorm.map(norm => svg_scale2(norm, -1));
	const normals = vectors.map(vec => [vec[1], -vec[0]]);
	// get padding from either head/tail options or root of options
	const pad = ends.map((s, i) => options[s].padding
		? options[s].padding
		: (options.padding ? options.padding : 0.0));
	const scales = ends
		.map((s, i) => options[s].height * (options[s].visible ? 1 : 0))
		.map((n, i) => n + pad[i]);
		// .map((s, i) => options[s].height * ((options[s].visible ? 1 : 0) + pad[i]));
	const arcs = pts.map((pt, i) => svg_add2(pt, svg_scale2(bezsNorm[i], scales[i])));
	// readjust bezier curve now that the arrow heads push inwards
	vector = svg_sub2(arcs[1], arcs[0]);
	perpendicular = [vector[1], -vector[0]];
	midpoint = svg_add2(arcs[0], svg_scale2(vector, 0.5));
	bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	// done adjust
	const controls = arcs
		.map((arc, i) => svg_add2(arc, svg_scale2(svg_sub2(bezPoint, arc), options.pinch)));
	const polyPoints = ends.map((s, i) => [
		svg_add2(arcs[i], svg_scale2(vectors[i], options[s].height)),
		svg_add2(arcs[i], svg_scale2(normals[i], options[s].width / 2)),
		svg_add2(arcs[i], svg_scale2(normals[i], -options[s].width / 2)),
	]);
	return {
		line: `M${stringifyPoint(arcs[0])}C${stringifyPoint(controls[0])},${stringifyPoint(controls[1])},${stringifyPoint(arcs[1])}`,
		tail: pointsToPath(polyPoints[0]),
		head: pointsToPath(polyPoints[1]),
	};
};

/**
 * SVG (c) Kraft
 */

// end is "head" or "tail"
const setArrowheadOptions = (element, options, which) => {
	if (typeof options === str_boolean) {
		element.options[which].visible = options;
	} else if (typeof options === str_object) {
		Object.assign(element.options[which], options);
		if (options.visible == null) {
			element.options[which].visible = true;
		}
	} else if (options == null) {
		element.options[which].visible = true;
	}
};

const setArrowStyle = (element, options = {}, which = str_head) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	// find options which translate to object methods (el.stroke("red"))
	Object.keys(options)
		.map(key => ({ key, fn: path[Case.toCamel(key)] }))
		.filter(el => typeof el.fn === str_function && el.key !== "class")
		.forEach(el => el.fn(options[el.key]));
	// find options which don't work as methods, set as attributes
	// Object.keys(options)
	// 	.map(key => ({ key, fn: path[Case.toCamel(key)] }))
	// 	.filter(el => typeof el.fn !== S.str_function && el.key !== "class")
	// 	.forEach(el => path.setAttribute(el.key, options[el.key]));
	//
	// apply a class attribute (add, don't overwrite existing classes)
	Object.keys(options)
		.filter(key => key === "class")
		.forEach(key => path.classList.add(options[key]));
};

const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0],
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden",
		));
	return element;
};

const setPoints$3 = (element, ...args) => {
	element.options.points = coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);
	return redraw(element);
};

const bend$1 = (element, amount) => {
	element.options.bend = amount;
	return redraw(element);
};

const pinch$1 = (element, amount) => {
	element.options.pinch = amount;
	return redraw(element);
};

const padding = (element, amount) => {
	element.options.padding = amount;
	return redraw(element);
};

const head = (element, options) => {
	setArrowheadOptions(element, options, str_head);
	setArrowStyle(element, options, str_head);
	return redraw(element);
};

const tail = (element, options) => {
	setArrowheadOptions(element, options, str_tail);
	setArrowStyle(element, options, str_tail);
	return redraw(element);
};

const getLine = element => element.getElementsByClassName(`${str_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${str_arrow}-${str_head}`)[0];
const getTail = element => element.getElementsByClassName(`${str_arrow}-${str_tail}`)[0];

var ArrowMethods = {
	setPoints: setPoints$3,
	points: setPoints$3,
	bend: bend$1,
	pinch: pinch$1,
	padding,
	head,
	tail,
	getLine,
	getHead,
	getTail,
};

/**
 * SVG (c) Kraft
 */
const endOptions = () => ({
	visible: false,
	width: 8,
	height: 10,
	padding: 0.0,
});

const makeArrowOptions = () => ({
	head: endOptions(),
	tail: endOptions(),
	bend: 0.0,
	padding: 0.0,
	pinch: 0.618,
	points: [],
});

/**
 * SVG (c) Kraft
 */

const arrowKeys = Object.keys(makeArrowOptions());

const matchingOptions = (...args) => {
	for (let a = 0; a < args.length; a += 1) {
		if (typeof args[a] !== str_object) { continue; }
		const keys = Object.keys(args[a]);
		for (let i = 0; i < keys.length; i += 1) {
			if (arrowKeys.includes(keys[i])) {
				return args[a];
			}
		}
	}
	return undefined;
};

const init = function (element, ...args) {
	element.classList.add(str_arrow);
	// element.setAttribute(S.str_class, S.str_arrow);
	const paths = ["line", str_tail, str_head]
		.map(key => SVG.path().addClass(`${str_arrow}-${key}`).appendTo(element));
	paths[0].setAttribute(str_style, "fill:none;");
	paths[1].setAttribute(str_stroke, str_none);
	paths[2].setAttribute(str_stroke, str_none);
	element.options = makeArrowOptions();
	ArrowMethods.setPoints(element, ...args);
	const options = matchingOptions(...args);
	if (options) {
		Object.keys(options)
			.filter(key => ArrowMethods[key])
			.forEach(key => ArrowMethods[key](element, options[key]));
	}
	return element;
};

/**
 * SVG (c) Kraft
 */

var Arrow = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [], // one function
		methods: ArrowMethods, // object of functions
		init,
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * @description totally flatten, recursive
 * @returns an array, always.
 */
const svg_flatten_arrays = function () {
	return svg_semi_flatten_arrays(arguments).reduce((a, b) => a.concat(b), []);
};

/**
 * SVG (c) Kraft
 */

// endpoints is an array of 4 numbers
const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
	const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
	const headPt = [endpoints[2] || 0, endpoints[3] || 0];
	const vector = svg_sub2(headPt, tailPt);
	const midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
	const perpendicular = [vector[1], -vector[0]];
	const bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
	const tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
	const headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
	return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
};

/**
 * SVG (c) Kraft
 */

const curveArguments = (...args) => [
	makeCurvePath(coordinates(...svg_flatten_arrays(...args))),
];

/**
 * SVG (c) Kraft
 */
const getNumbersFromPathCommand = str => str
	.slice(1)
	.split(/[, ]+/)
	.map(s => parseFloat(s));

// this gets the parameter numbers, in an array
const getCurveTos = d => d
	.match(/[Cc][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));

const getMoveTos = d => d
	.match(/[Mm][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));

const getCurveEndpoints = (d) => {
	// get only the first Move and Curve commands
	const move = getMoveTos(d).shift();
	const curve = getCurveTos(d).shift();
	const start = move
		? [move[move.length - 2], move[move.length - 1]]
		: [0, 0];
	const end = curve
		? [curve[curve.length - 2], curve[curve.length - 1]]
		: [0, 0];
	return [...start, ...end];
};

/**
 * SVG (c) Kraft
 */

const setPoints$2 = (element, ...args) => {
	const coords = coordinates(...svg_flatten_arrays(...args)).slice(0, 4);
	element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
	return element;
};

const bend = (element, amount) => {
	element._bend = amount;
	return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
};

const pinch = (element, amount) => {
	element._pinch = amount;
	return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
};

var curve_methods = {
	setPoints: setPoints$2,
	bend,
	pinch,
};

/**
 * SVG (c) Kraft
 */

var Curve = {
	curve: {
		nodeName: str_path,
		attributes: ["d"],
		args: curveArguments, // one function
		methods: curve_methods, // object of functions
	},
};

/**
 * SVG (c) Kraft
 */

const nodes = {};

Object.assign(
	nodes,
	// to include/exclude nodes from this library
	// comment out nodes below, rebuild
	Arc,
	Wedge,
	Parabola,
	RegularPolygon,
	RoundRect,
	Arrow,
	Curve,
);

/**
 * SVG (c) Kraft
 */

// arc, parabola, regularPolygon...
const customPrimitives = Object.keys(nodes);
// todo, get rid of custom primitives here if possible

const headerStuff = [NodeNames.h, NodeNames.p, NodeNames.i];
// const drawingShapes = [N.g, N.v, N.t];//, customPrimitives];
const drawingShapes = [NodeNames.g, NodeNames.v, NodeNames.t, customPrimitives];

const folders = {
	// VISIBLE
	svg: [NodeNames.s, NodeNames.d].concat(headerStuff).concat(drawingShapes),
	g: drawingShapes,
	text: [NodeNames.cT],
	linearGradient: [NodeNames.cG],
	radialGradient: [NodeNames.cG],
	// NON VISIBLE
	defs: headerStuff,
	filter: [NodeNames.cF],
	marker: drawingShapes,
	symbol: drawingShapes,
	clipPath: drawingShapes,
	mask: drawingShapes,
};

const nodesAndChildren = Object.create(null);
Object.keys(folders).forEach((key) => {
	nodesAndChildren[key] = folders[key].reduce((a, b) => a.concat(b), []);
});

/**
 * SVG (c) Kraft
 */

const viewBoxValue = function (x, y, width, height, padding = 0) {
	const scale = 1.0;
	const d = (width / scale) - width;
	const X = (x - d) - padding;
	const Y = (y - d) - padding;
	const W = (width + d * 2) + padding * 2;
	const H = (height + d * 2) + padding * 2;
	return [X, Y, W, H].join(" ");
};

/**
 * this will attempt to match a set of viewbox parameters
 * undefined, if it cannot build a string
 */
function viewBox$1 () {
	const numbers = coordinates(...svg_flatten_arrays(arguments));
	if (numbers.length === 2) { numbers.unshift(0, 0); }
	return numbers.length === 4 ? viewBoxValue(...numbers) : undefined;
}

/**
 * SVG (c) Kraft
 */

const cdata = (textContent) => (new (SVGWindow()).DOMParser())
	.parseFromString("<root></root>", "text/xml")
	.createCDATASection(`${textContent}`);

/**
 * SVG (c) Kraft
 */

const removeChildren = (element) => {
	while (element.lastChild) {
		element.removeChild(element.lastChild);
	}
	return element;
};

const appendTo = (element, parent) => {
	if (parent != null) {
		parent.appendChild(element);
	}
	return element;
};

const setAttributes = (element, attrs) => Object.keys(attrs)
	.forEach(key => element.setAttribute(Case.toKebab(key), attrs[key]));

const moveChildren = (target, source) => {
	while (source.childNodes.length > 0) {
		const node = source.childNodes[0];
		source.removeChild(node);
		target.appendChild(node);
	}
	return target;
};

const clearSVG = (element) => {
	Array.from(element.attributes)
		.filter(a => a !== "xmlns")
		.forEach(attr => element.removeAttribute(attr.name));
	return removeChildren(element);
};

const assignSVG = (target, source) => {
	Array.from(source.attributes)
		.forEach(attr => target.setAttribute(attr.name, attr.value));
	return moveChildren(target, source);
};

// everything but clearSVG gets exported as the default and added
// as a method to many elements
var dom = {
	removeChildren,
	appendTo,
	setAttributes,
};

/**
 * SVG (c) Kraft
 */

/** parser error to check against */
// const pErr = (new window.DOMParser())
//  .parseFromString("INVALID", "text/xml")
//  .getElementsByTagName("parsererror")[0]
//  .namespaceURI;

const filterWhitespaceNodes = (node) => {
	if (node === null) { return node; }
	for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
		const child = node.childNodes[i];
		if (child.nodeType === 3 && child.data.match(/^\s*$/)) {
			node.removeChild(child);
		}
		if (child.nodeType === 1) {
			filterWhitespaceNodes(child);
		}
	}
	return node;
};

/**
 * parse and checkParseError go together.
 * checkParseError needs to be called to pull out the .documentElement
 */
const parse = string => (new (SVGWindow()).DOMParser())
	.parseFromString(string, "text/xml");

const checkParseError = xml => {
	const parserErrors = xml.getElementsByTagName("parsererror");
	if (parserErrors.length > 0) {
		throw new Error(parserErrors[0]);
	}
	return filterWhitespaceNodes(xml.documentElement);
};

// get an svg from a html 5 fetch returned in a promise
// will reject if there is no svg

// the SVG is returned as a promise
// try "filename.svg", "<svg>" text blob, already-parsed XML document tree
const async = function (input) {
	return new Promise((resolve, reject) => {
		if (typeof input === str_string || input instanceof String) {
			fetch(input)
				.then(response => response.text())
				.then(str => checkParseError(parse(str)))
				.then(xml => (xml.nodeName === str_svg
					? xml
					: xml.getElementsByTagName(str_svg)[0]))
				.then(svg => (svg == null
					? reject(new Error("valid XML found, but no SVG element"))
					: resolve(svg)))
				.catch(err => reject(err));
		} else if (input instanceof SVGWindow().Document) {
			return asyncDone(input);
		}
	});
};

const sync = function (input) {
	if (typeof input === str_string || input instanceof String) {
		try {
			return checkParseError(parse(input));
		} catch (error) {
			return error;
		}
	}
	if (input.childNodes != null) {
		return input;
	}
};

// check for an actual .svg ending?
// (input.slice(input.length - 4, input.length) === ".svg")
const isFilename = input => typeof input === str_string
	&& /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input)
	&& input.length < 10000;

const Load = input => (isFilename(input)
	&& isBrowser
	&& typeof SVGWindow().fetch === str_function
	? async(input)
	: sync(input));

/**
* vkBeautify
*
* Version - 0.99.00.beta
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
*
* MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

function vkXML (text, step) {
  const ar = text.replace(/>\s{0,}</g, "><")
    .replace(/</g, "~::~<")
    .replace(/\s*xmlns\:/g, "~::~xmlns:")
    // .replace(/\s*xmlns\=/g,"~::~xmlns=")
    .split("~::~");
  const len = ar.length;
  let inComment = false;
  let deep = 0;
  let str = "";
  const space = (step != null && typeof step === "string" ? step : "\t");
  const shift = ["\n"];
  for (let si = 0; si < 100; si += 1) {
    shift.push(shift[si] + space);
  }
  for (let ix = 0; ix < len; ix += 1) {
    // start comment or <![CDATA[...]]> or <!DOCTYPE //
    if (ar[ix].search(/<!/) > -1) {
      str += shift[deep] + ar[ix];
      inComment = true;
      // end comment  or <![CDATA[...]]> //
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
        || ar[ix].search(/!DOCTYPE/) > -1) {
        inComment = false;
      }
    } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
      // end comment  or <![CDATA[...]]> //
      str += ar[ix];
      inComment = false;
    } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix])
      && /^<[\w:\-\.\,]+/.exec(ar[ix - 1])
      == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
      // <elm></elm> //
      str += ar[ix];
      if (!inComment) { deep -= 1; }
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1
      // <elm> //
      && ar[ix].search(/\/>/) === -1) {
      str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
      // <elm>...</elm> //
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\//) > -1) {
      // </elm> //
      str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/\/>/) > -1) {
      // <elm/> //
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\?/) > -1) {
      // <? xml ... ?> //
      str += shift[deep] + ar[ix];
    } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
      // xmlns //
      str += shift[deep] + ar[ix];
    } else {
      str += ar[ix];
    }
  }
  return (str[0] === "\n") ? str.slice(1) : str;
}

/**
 * SVG (c) Kraft
 */

const SAVE_OPTIONS = () => ({
	download: false, // trigger a file download (browser only)
	output: str_string, // output type ("string", "svg") string or XML DOM object
	windowStyle: false, // include any external stylesheets present on the window object
	filename: "image.svg", // if "download" is true, the filename for the downloaded file
});

const getWindowStylesheets = function () {
	const css = [];
	if (SVGWindow().document.styleSheets) {
		for (let s = 0; s < SVGWindow().document.styleSheets.length; s += 1) {
			const sheet = SVGWindow().document.styleSheets[s];
			try {
				const rules = ("cssRules" in sheet) ? sheet.cssRules : sheet.rules;
				for (let r = 0; r < rules.length; r += 1) {
					const rule = rules[r];
					if ("cssText" in rule) {
						css.push(rule.cssText);
					} else {
						css.push(`${rule.selectorText} {\n${rule.style.cssText}\n}\n`);
					}
				}
			} catch (error) {
				console.warn(error);
			}
		}
	}
	return css.join("\n");
};

const downloadInBrowser = function (filename, contentsAsString) {
	const blob = new (SVGWindow()).Blob([contentsAsString], { type: "text/plain" });
	const a = SVGWindow().document.createElement("a");
	a.setAttribute("href", SVGWindow().URL.createObjectURL(blob));
	a.setAttribute("download", filename);
	SVGWindow().document.body.appendChild(a);
	a.click();
	SVGWindow().document.body.removeChild(a);
};

const save = function (svg, options) {
	options = Object.assign(SAVE_OPTIONS(), options);
	// if this SVG was created inside the browser, it inherited all the <link>
	// stylesheets present on the window, this allows them to be included.
	// default: not included.
	if (options.windowStyle) {
		const styleContainer = SVGWindow().document.createElementNS(NS, str_style);
		styleContainer.setAttribute("type", "text/css");
		styleContainer.innerHTML = getWindowStylesheets();
		svg.appendChild(styleContainer);
	}
	// convert the SVG to a string and format it with good indentation
	const source = (new (SVGWindow()).XMLSerializer()).serializeToString(svg);
	const formattedString = vkXML(source);
	//
	if (options.download && isBrowser && !isNode) {
		downloadInBrowser(options.filename, formattedString);
	}
	return (options.output === str_svg ? svg : formattedString);
};

/**
 * SVG (c) Kraft
 */

const setViewBox = (element, ...args) => {
	// are they giving us pre-formatted string, or a list of numbers
	const viewBox = args.length === 1 && typeof args[0] === str_string
		? args[0]
		: viewBox$1(...args);
	if (viewBox) {
		element.setAttribute(str_viewBox, viewBox);
	}
	return element;
};

const getViewBox = function (element) {
	const vb = element.getAttribute(str_viewBox);
	return (vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n)));
};

const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	// todo: i thought this threw an error once. something about getScreenCTM.
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};

/*
export const translateViewBox = function (svg, dx, dy) {
	const viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	viewBox[0] += dx;
	viewBox[1] += dy;
	svg.setAttributeNS(null, vB, viewBox.join(" "));
};

export const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
	if (Math.abs(scale) < 1e-8) { scale = 0.01; }
	const matrix = svg.createSVGMatrix()
		.translate(origin_x, origin_y)
		.scale(1 / scale)
		.translate(-origin_x, -origin_y);
	const viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	const top_left = svg.createSVGPoint();
	const bot_right = svg.createSVGPoint();
	[top_left.x, top_left.y] = viewBox;
	bot_right.x = viewBox[0] + viewBox[2];
	bot_right.y = viewBox[1] + viewBox[3];
	const new_top_left = top_left.matrixTransform(matrix);
	const new_bot_right = bot_right.matrixTransform(matrix);
	setViewBox(svg,
		new_top_left.x,
		new_top_left.y,
		new_bot_right.x - new_top_left.x,
		new_bot_right.y - new_top_left.y);
};

*/

var viewBox = /*#__PURE__*/Object.freeze({
	__proto__: null,
	setViewBox: setViewBox,
	getViewBox: getViewBox,
	convertToViewBox: convertToViewBox
});

/**
 * SVG (c) Kraft
 */

// check if the loader is running synchronously or asynchronously
const loadSVG = (target, data) => {
	const result = Load(data);
	if (result == null) { return; }
	return (typeof result.then === str_function)
		? result.then(svg => assignSVG(target, svg))
		: assignSVG(target, result);
};

const getFrame = function (element) {
	const viewBox = getViewBox(element);
	if (viewBox !== undefined) {
		return viewBox;
	}
	if (typeof element.getBoundingClientRect === str_function) {
		const rr = element.getBoundingClientRect();
		return [rr.x, rr.y, rr.width, rr.height];
	}
	// return Array(4).fill(undefined);
	return [];
};

const setPadding = function (element, padding) {
	const viewBox = getViewBox(element);
	if (viewBox !== undefined) {
		setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
			.map((nudge, i) => viewBox[i] + nudge));
	}
	return element;
};

const bgClass = "svg-background-rectangle";

// i prevented circular dependency by passing a pointer to Constructor through 'this'
// every function is bound
const background = function (element, color) {
	let backRect = Array.from(element.childNodes)
		.filter(child => child.getAttribute(str_class) === bgClass)
		.shift();
	if (backRect == null) {
		backRect = this.Constructor("rect", null, ...getFrame(element));
		backRect.setAttribute(str_class, bgClass);
		backRect.setAttribute(str_stroke, str_none);
		element.insertBefore(backRect, element.firstChild);
	}
	backRect.setAttribute(str_fill, color);
	return element;
};

const findStyleSheet = function (element) {
	const styles = element.getElementsByTagName(str_style);
	return styles.length === 0 ? undefined : styles[0];
};

const stylesheet = function (element, textContent) {
	let styleSection = findStyleSheet(element);
	if (styleSection == null) {
		styleSection = this.Constructor(str_style);
		element.insertBefore(styleSection, element.firstChild);
	}
	styleSection.textContent = "";
	styleSection.appendChild(cdata(textContent));
	return styleSection;
};

// these will end up as methods on the <svg> nodes
var methods$1 = {
	clear: clearSVG,
	size: setViewBox,
	setViewBox,
	getViewBox,
	padding: setPadding,
	background,
	getWidth: el => getFrame(el)[2],
	getHeight: el => getFrame(el)[3],
	stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
	load: loadSVG,
	save: save,
};

// svg.load = function (element, data, callback) {
//   return Load(data, (svg, error) => {
//     if (svg != null) { replaceSVG(element, svg); }
//     if (callback != null) { callback(element, error); }
//   });
// };

/**
 * SVG (c) Kraft
 */
const libraries = {
	math: {
		vector: (...args) => [...args],
	},
};

/**
 * SVG (c) Kraft
 */

const categories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"], // "mouseover",
	release: ["mouseup", "touchend"],
	leave: ["mouseleave", "touchcancel"],
};

const handlerNames = Object.values(categories)
	.reduce((a, b) => a.concat(b), []);

const off = (element, handlers) => handlerNames.forEach((handlerName) => {
	handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
	handlers[handlerName] = [];
});

const defineGetter = (obj, prop, value) => Object.defineProperty(obj, prop, {
	get: () => value,
	enumerable: true,
	configurable: true,
});

const assignPress = (e, startPoint) => {
	["pressX", "pressY"].filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
		.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
	if (!Object.prototype.hasOwnProperty.call(e, "press")) {
		defineGetter(e, "press", libraries.math.vector(...startPoint));
	}
};

const TouchEvents = function (element) {
	// todo, more pointers for multiple screen touches

	let startPoint = [];
	// hold onto all handlers. to be able to turn them off
	const handlers = [];
	Object.keys(categories).forEach((key) => {
		categories[key].forEach((handler) => {
			handlers[handler] = [];
		});
	});

	const removeHandler = category => categories[category]
		.forEach(handlerName => handlers[handlerName]
			.forEach(func => element.removeEventListener(handlerName, func)));

	// add more properties depending on the type of handler
	const categoryUpdate = {
		press: (e, viewPoint) => {
			startPoint = viewPoint;
			assignPress(e, startPoint);
		},
		release: () => {},
		leave: () => {},
		move: (e, viewPoint) => {
			if (e.buttons > 0 && startPoint[0] === undefined) {
				startPoint = viewPoint;
			} else if (e.buttons === 0 && startPoint[0] !== undefined) {
				startPoint = [];
			}
			assignPress(e, startPoint);
		},
	};

	// assign handlers for onMove, onPress, onRelease
	Object.keys(categories).forEach((category) => {
		const propName = `on${Case.capitalized(category)}`;
		Object.defineProperty(element, propName, {
			set: (handler) => {
				if (handler == null) {
					removeHandler(category);
					return;
				}
				categories[category].forEach((handlerName) => {
					const handlerFunc = (e) => {
						// const pointer = (e.touches != null && e.touches.length
						const pointer = (e.touches != null
							? e.touches[0]
							: e);
						// onRelease events don't have a pointer
						if (pointer !== undefined) {
							const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
								.map(n => (Number.isNaN(n) ? undefined : n)); // e.target
							["x", "y"]
								.filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
								.forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
							if (!Object.prototype.hasOwnProperty.call(e, "position")) {
								defineGetter(e, "position", libraries.math.vector(...viewPoint));
							}
							categoryUpdate[category](e, viewPoint);
						}
						handler(e);
					};
					// node.js doesn't have addEventListener
					if (element.addEventListener) {
						handlers[handlerName].push(handlerFunc);
						element.addEventListener(handlerName, handlerFunc);
					}
				});
			},
			enumerable: true,
		});
	});

	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

/**
 * SVG (c) Kraft
 */
var UUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.concat("aaaaa")
	.substr(0, 5);

/**
 * SVG (c) Kraft
 */

const Animation = function (element) {
	// let fps; // todo: bring this back

	let start;
	const handlers = {};
	let frame = 0;
	let requestId;

	const removeHandlers = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers)
			.forEach(uuid => delete handlers[uuid]);
		start = undefined;
		frame = 0;
	};

	Object.defineProperty(element, "play", {
		set: (handler) => {
			removeHandlers();
			if (handler == null) { return; }
			const uuid = UUID();
			const handlerFunc = (e) => {
				if (!start) {
					start = e;
					frame = 0;
				}
				const progress = (e - start) * 0.001;
				handler({ time: progress, frame });
				// prepare next frame
				frame += 1;
				if (handlers[uuid]) {
					requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
				}
			};
			handlers[uuid] = handlerFunc;
			// node.js doesn't have requestAnimationFrame
			// we don't need to duplicate this if statement above, because it won't
			// ever be called if this one is prevented.
			if (SVGWindow().requestAnimationFrame) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		},
		enumerable: true,
	});
	Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};

/**
 * SVG (c) Kraft
 */

const removeFromParent = svg => (svg && svg.parentNode
	? svg.parentNode.removeChild(svg)
	: undefined);

const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];

const controlPoint = function (parent, options = {}) {
	// private properties. unless exposed
	const position = [0, 0]; // initialize below
	const cp = {
		selected: false,
		svg: undefined,
		// to be overwritten
		updatePosition: input => input,
	};

	const updateSVG = () => {
		if (!cp.svg) { return; }
		if (!cp.svg.parentNode) {
			parent.appendChild(cp.svg);
		}
		possiblePositionAttributes
			.filter(coords => cp.svg[coords[0]] != null)
			.forEach(coords => coords.forEach((attr, i) => {
				cp.svg.setAttribute(attr, position[i]);
			}));
	};

	const proxy = new Proxy(position, {
		set: (target, property, value) => {
			target[property] = value;
			updateSVG();
			return true;
		},
	});

	const setPosition = function (...args) {
		coordinates(...svg_flatten_arrays(...args))
			.forEach((n, i) => { position[i] = n; });
		updateSVG();
		// alert delegate
		if (typeof position.delegate === str_function) {
			position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
		}
	};

	// set default position
	// setPosition(options.position);

	position.delegate = undefined; // to be set
	position.setPosition = setPosition;
	position.onMouseMove = mouse => (cp.selected
		? setPosition(cp.updatePosition(mouse))
		: undefined);
	position.onMouseUp = () => { cp.selected = false; };
	position.distance = mouse => Math.sqrt(svg_distanceSq2(mouse, position));

	["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
		get: () => position[i],
		set: (v) => { position[i] = v; }
	}));
	// would be nice if "svg" also called removeFromParent(); on set()
	[str_svg, "updatePosition", "selected"].forEach(key => Object
		.defineProperty(position, key, {
			get: () => cp[key],
			set: (v) => { cp[key] = v; },
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			// todo, do we need to do any other unwinding?
			removeFromParent(cp.svg);
			position.delegate = undefined;
		},
	});

	return proxy;
};

const controls = function (svg, number, options) {
	let selected;
	let delegate;
	const points = Array.from(Array(number))
		.map(() => controlPoint(svg, options));

	// hook up the delegate callback for the on change event
	const protocol = point => (typeof delegate === str_function
		? delegate.call(points, point, selected, points)
		: undefined);

	points.forEach((p) => {
		p.delegate = protocol;
		p.pointsContainer = points;
	});

	const mousePressedHandler = function (mouse) {
		if (!(points.length > 0)) { return; }
		selected = points
			.map((p, i) => ({ i, d: svg_distanceSq2(p, [mouse.x, mouse.y]) }))
			.sort((a, b) => a.d - b.d)
			.shift()
			.i;
		points[selected].selected = true;
	};
	const mouseMovedHandler = function (mouse) {
		points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseReleasedHandler = function () {
		points.forEach(p => p.onMouseUp());
		selected = undefined;
	};

	svg.onPress = mousePressedHandler;
	svg.onMove = mouseMovedHandler;
	svg.onRelease = mouseReleasedHandler;
	// svg.addEventListener("touchcancel", touchUpHandler, false);

	Object.defineProperty(points, "selectedIndex", { get: () => selected });
	Object.defineProperty(points, "selected", { get: () => points[selected] });
	Object.defineProperty(points, "add", {
		value: (opt) => {
			points.push(controlPoint(svg, opt));
		},
	});
	points.removeAll = () => {
		while (points.length > 0) {
			points.pop().remove();
		}
	};

	const functionalMethods = {
		onChange: (func, runOnceAtStart) => {
			delegate = func;
			// we need a point, give us the last one in the array
			if (runOnceAtStart === true) {
				const index = points.length - 1;
				func.call(points, points[index], index, points);
			}
		},
		position: func => points.forEach((p, i) => p.setPosition(func.call(points, p, i, points))),
		svg: func => points.forEach((p, i) => { p.svg = func.call(points, p, i, points); }),
	};
	Object.keys(functionalMethods).forEach((key) => {
		points[key] = function () {
			if (typeof arguments[0] === str_function) {
				functionalMethods[key](...arguments);
			}
			return points;
		};
	});
	points.parent = function (parent) {
		if (parent != null && parent.appendChild != null) {
			points.forEach((p) => { parent.appendChild(p.svg); });
		}
		return points;
	};

	return points;
};

const applyControlsToSVG = (svg) => {
	svg.controls = (...args) => controls.call(svg, svg, ...args);
};

/**
 * SVG (c) Kraft
 */

// const findWindowBooleanParam = (...params) => params
//   .filter(arg => typeof arg === S.str_object)
//   .filter(o => typeof o.window === S.str_boolean)
//   .reduce((a, b) => a.window || b.window, false);

var svgDef = {
	svg: {
		args: (...args) => [viewBox$1(coordinates(...args))].filter(a => a != null),
		methods: methods$1,
		init: (element, ...args) => {
			args.filter(a => typeof a === str_string)
				.forEach(string => loadSVG(element, string));
			args.filter(a => a != null)
				// .filter(arg => arg instanceof ElementConstructor)
				.filter(el => typeof el.appendChild === str_function)
				.forEach(parent => parent.appendChild(element));
			TouchEvents(element);
			Animation(element);
			applyControlsToSVG(element);
		},
	},
};

/**
 * SVG (c) Kraft
 */

const loadGroup = (group, ...sources) => {
	const elements = sources.map(source => sync(source))
		.filter(a => a !== undefined);
	elements.filter(element => element.tagName === str_svg)
		.forEach(element => moveChildren(group, element));
	elements.filter(element => element.tagName !== str_svg)
		.forEach(element => group.appendChild(element));
	return group;
};

var gDef = {
	g: {
		init: loadGroup,
		methods: {
			load: loadGroup,
		},
	},
};

/**
 * SVG (c) Kraft
 */
// this object will be completed with all remaining nodeName keys
// with an empty array value
var attributes = Object.assign(Object.create(null), {
	// the order of indices matter
	svg: [str_viewBox],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: [str_points],
	polyline: [str_points],
	path: ["d"],
	text: ["x", "y"],
	mask: [str_id],
	symbol: [str_id],
	clipPath: [
		str_id,
		"clip-rule", // use with clipPath
	],
	marker: [
		str_id,
		"markerHeight",
		"markerUnits",
		"markerWidth",
		"orient",
		"refX",
		"refY",
	],
	linearGradient: [
		"x1", // <linearGradient>
		"x2", // <linearGradient>
		"y1", // <linearGradient>
		"y2", // <linearGradient>
	],
	radialGradient: [
		"cx", // <radialGradient>
		"cy", // <radialGradient>
		"r", // <radialGradient>
		"fr", // <radialGradient>
		"fx", // <radialGradient>
		"fy", // <radialGradient>
	],
	stop: [
		"offset",
		"stop-color",
		"stop-opacity",
	],
	pattern: [
		"patternContentUnits", // only <pattern>
		"patternTransform", // only <pattern>
		"patternUnits", // only <pattern>
	],
});

/**
 * SVG (c) Kraft
 */

const setRadius = (el, r) => {
	el.setAttribute(attributes.circle[2], r);
	return el;
};

const setOrigin = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.circle[i], value));
	return el;
};

const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
/**
 * @name circle
 * @memberof svg
 * @description Draw an SVG Circle element.
 * @param {number} radius the radius of the circle
 * @param {...number|number[]} center the center of the circle
 * @returns {Element} an SVG node element
 * @linkcode SVG ./src/nodes/spec/circle.js 28
 */
var circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d));
			// console.log("SVG circle coords", coords);
			switch (coords.length) {
			case 0: case 1: return [, , ...coords];
			case 2: case 3: return coords;
			// case 4
			default: return fromPoints(...coords);
			}
			// return coordinates(...flatten(a, b, c)).slice(0, 3);
		},
		methods: {
			radius: setRadius,
			setRadius,
			origin: setOrigin,
			setOrigin,
			center: setOrigin,
			setCenter: setOrigin,
			position: setOrigin,
			setPosition: setOrigin,
		},
	},
};

/**
 * SVG (c) Kraft
 */

// const setRadii = (el, rx, ry) => [,,rx,ry]
//   .forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
const setRadii = (el, rx, ry) => {
	[, , rx, ry].forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
	return el;
};

const setCenter = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
	return el;
};

var ellipseDef = {
	ellipse: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: return [, , ...coords];
			default: return coords;
			}
		},
		methods: {
			radius: setRadii,
			setRadius: setRadii,
			origin: setCenter,
			setOrigin: setCenter,
			center: setCenter,
			setCenter,
			position: setCenter,
			setPosition: setCenter,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const Args$1 = (...args) => coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);

const setPoints$1 = (element, ...args) => {
	Args$1(...args).forEach((value, i) => element.setAttribute(attributes.line[i], value));
	return element;
};
/**
 * @name line
 * @description SVG Line element
 * @memberof SVG
 * @linkcode SVG ./src/nodes/spec/line.js 18
 */
var lineDef = {
	line: {
		args: Args$1,
		methods: {
			setPoints: setPoints$1,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
const digitRegEx = /-?[0-9]*\.?\d+/g;

const pathCommands = {
	m: "move",
	l: "line",
	v: "vertical",
	h: "horizontal",
	a: "ellipse",
	c: "curve",
	s: "smoothCurve",
	q: "quadCurve",
	t: "smoothQuadCurve",
	z: "close",
};

// const expectedArguments = {
//   m: 2,
//   l: 2,
//   v: 1,
//   h: 1,
//   a: 7, // or 14
//   c: 6,
//   s: 4,
//   q: 4,
//   t: 2,
//   z: 0,
// };

// make capitalized copies of each command
Object.keys(pathCommands).forEach((key) => {
	const s = pathCommands[key];
	pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
	// expectedArguments[key.toUpperCase()] = expectedArguments[key];
});

// results in an array of objects [
//  { command: "M", values: [50, 50], en: "Move" }
//  { command: "l", values: [45, 95], en: "line" }
// ]
const parsePathCommands = function (str) {
	// Ulric Wilfred
	const results = [];
	let match;
	while ((match = markerRegEx.exec(str)) !== null) {
		results.push(match);
	}
	return results.map(m => ({
		command: str[m.index],
		index: m.index,
	}))
		.reduceRight((all, cur) => {
			const chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
			return all.concat([{
				command: cur.command,
				index: cur.index,
				chunk: (chunk.length > 0) ? chunk.substr(1, chunk.length - 1) : chunk,
			}]);
		}, [])
		.reverse()
		.map((el) => {
			const values = el.chunk.match(digitRegEx);
			el.en = pathCommands[el.command];
			el.values = values ? values.map(parseFloat) : [];
			delete el.chunk;
			return el;
		});
};

/**
 * @param {SVGElement} one svg element, intended to be a <path> element
 * @returns {string} the "d" attribute, or if unset, returns an empty string "".
 */
const getD = (el) => {
	const attr = el.getAttribute("d");
	return (attr == null) ? "" : attr;
};

const clear = element => {
	element.removeAttribute("d");
	return element;
};

// todo: would be great if for arguments > 2 it alternated space and comma
const appendPathCommand = (el, command, ...args) => {
	el.setAttribute("d", `${getD(el)}${command}${svg_flatten_arrays(...args).join(" ")}`);
	return el;
};

// break out the path commands into an array of descriptive objects
const getCommands = element => parsePathCommands(getD(element));

// const setters = {
//   string: setPathString,
//   object: setPathCommands,
// };
// const appenders = {
//   string: appendPathString,
//   object: appendPathCommands,
// };

// depending on the user's argument, different setters will get called
// const noClearSet = (element, ...args) => {
//   if (args.length === 1) {
//     const typ = typeof args[0];
//     if (setters[typ]) {
//       setters[typ](element, args[0]);
//     }
//   }
// };

// const clearAndSet = (element, ...args) => {
//   if (args.length === 1) {
//     const typ = typeof args[0];
//     if (setters[typ]) {
//       clear(element);
//       setters[typ](element, args[0]);
//     }
//   }
// };

const path_methods = {
	addCommand: appendPathCommand,
	appendCommand: appendPathCommand,
	clear,
	getCommands: getCommands,
	get: getCommands,
	getD: el => el.getAttribute("d"),
	// set: clearAndSet,
	// add: noClearSet,
};

Object.keys(pathCommands).forEach((key) => {
	path_methods[pathCommands[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});

var pathDef = {
	path: {
		methods: path_methods,
	},
};

/**
 * SVG (c) Kraft
 */

const setRectSize = (el, rx, ry) => {
	[, , rx, ry]
		.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
	return el;
};

const setRectOrigin = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
	return el;
};

// can handle negative widths and heights
const fixNegatives = function (arr) {
	[0, 1].forEach(i => {
		if (arr[2 + i] < 0) {
			if (arr[0 + i] === undefined) { arr[0 + i] = 0; }
			arr[0 + i] += arr[2 + i];
			arr[2 + i] = -arr[2 + i];
		}
	});
	return arr;
};
/**
 * @name rect
 * @memberof svg
 * @description Draw an SVG Rect element.
 * @param {number} x the x coordinate of the corner
 * @param {number} y the y coordinate of the corner
 * @param {number} width the length along the x dimension
 * @param {number} height the length along the y dimension
 * @returns {Element} an SVG node element
 * @linkcode SVG ./src/nodes/spec/rect.js 40
 */
var rectDef = {
	rect: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: case 3: return fixNegatives([, , ...coords]);
			default: return fixNegatives(coords);
			}
		},
		methods: {
			origin: setRectOrigin,
			setOrigin: setRectOrigin,
			center: setRectOrigin,
			setCenter: setRectOrigin,
			size: setRectSize,
			setSize: setRectSize,
		},
	},
};

/**
 * SVG (c) Kraft
 */

var styleDef = {
	style: {
		init: (el, text) => {
			el.textContent = "";
			el.appendChild(cdata(text));
		},
		methods: {
			setTextContent: (el, text) => {
				el.textContent = "";
				el.appendChild(cdata(text));
				return el;
			},
		},
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * @description SVG text element
 * @memberof SVG
 * @linkcode SVG ./src/nodes/spec/text.js 11
 */
var textDef = {
	text: {
		// assuming people will at most supply coordinate (x,y,z) and text
		args: (a, b, c) => coordinates(...svg_flatten_arrays(a, b, c)).slice(0, 2),
		init: (element, a, b, c, d) => {
			const text = [a, b, c, d].filter(el => typeof el === str_string).shift();
			if (text) {
				element.appendChild(SVGWindow().document.createTextNode(text));
				// it seems like this is excessive and will never happen
				// if (element.firstChild) {
				//   element.firstChild.nodeValue = text;
				// } else {
				//   element.appendChild(window().document.createTextNode(text));
				// }
			}
		},
	},
};

/**
 * SVG (c) Kraft
 */

const makeIDString = function () {
	return Array.from(arguments)
		.filter(a => typeof a === str_string || a instanceof String)
		.shift() || UUID();
};

const maskArgs = (...args) => [makeIDString(...args)];

var maskTypes = {
	mask: { args: maskArgs },
	clipPath: { args: maskArgs },
	symbol: { args: maskArgs },
	marker: {
		args: maskArgs,
		methods: {
			size: setViewBox,
			setViewBox: setViewBox,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const getPoints = (el) => {
	const attr = el.getAttribute(str_points);
	return (attr == null) ? "" : attr;
};

const polyString = function () {
	return Array
		.from(Array(Math.floor(arguments.length / 2)))
		.map((_, i) => `${arguments[i * 2 + 0]},${arguments[i * 2 + 1]}`)
		.join(" ");
};

const stringifyArgs = (...args) => [
	polyString(...coordinates(...svg_semi_flatten_arrays(...args))),
];

const setPoints = (element, ...args) => {
	element.setAttribute(str_points, stringifyArgs(...args)[0]);
	return element;
};

const addPoint = (element, ...args) => {
	element.setAttribute(str_points, [getPoints(element), stringifyArgs(...args)[0]]
		.filter(a => a !== "")
		.join(" "));
	return element;
};

// this should be improved
// right now the special case is if there is only 1 argument and it's a string
// it should be able to take strings or numbers at any point,
// converting the strings to coordinates
const Args = function (...args) {
	return args.length === 1 && typeof args[0] === str_string
		? [args[0]]
		: stringifyArgs(...args);
};

var polyDefs = {
	polyline: {
		args: Args,
		methods: {
			setPoints,
			addPoint,
		},
	},
	polygon: {
		args: Args,
		methods: {
			setPoints,
			addPoint,
		},
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * in each of these instances, arguments maps the arguments to attributes
 * as the attributes are listed in the "attributes" folder.
 *
 * arguments: function. this should convert the array of arguments into
 * an array of (processed) arguments. 1:1. arguments into arguments.
 * make sure it is returning an array.
 *
 */
var Spec = Object.assign(
	{},
	svgDef,
	gDef,
	circleDef,
	ellipseDef,
	lineDef,
	pathDef,
	rectDef,
	styleDef,
	textDef,
	// multiple
	maskTypes,
	polyDefs,
);

/**
 * SVG (c) Kraft
 */
var ManyElements = {
	presentation: [
		"color",
		"color-interpolation",
		"cursor", // mouse cursor
		"direction", // rtl right to left
		"display", // none, inherit
		"fill",
		"fill-opacity",
		"fill-rule",
		"font-family",
		"font-size",
		"font-size-adjust",
		"font-stretch",
		"font-style",
		"font-variant",
		"font-weight",
		"image-rendering", // provides a hint to the browser about how to make speed vs. quality tradeoffs as it performs image processing
		"letter-spacing",
		"opacity",
		"overflow",
		"paint-order",
		"pointer-events",
		"preserveAspectRatio",
		"shape-rendering",
		"stroke",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-linecap",
		"stroke-linejoin",
		"stroke-miterlimit",
		"stroke-opacity",
		"stroke-width",
		"tabindex",
		"transform-origin", // added by Robby
		"user-select", // added by Robby
		"vector-effect",
		"visibility",
	],
	animation: [
		"accumulate", // controls whether or not an animation is cumulative
		"additive", // controls whether or not an animation is additive
		"attributeName", // used by: <animate>, <animateColor>, <animateTransform>, and <set>
		"begin",
		"by",
		"calcMode",
		"dur",
		"end",
		"from",
		"keyPoints", // used by: <animate>, <animateColor>, <animateMotion>, <animateTransform>, and <set>
		"keySplines",
		"keyTimes",
		"max",
		"min",
		"repeatCount",
		"repeatDur",
		"restart",
		"to", // final value of the attribute that will be modified during the animation
		"values",
	],
	effects: [
		"azimuth", // only used by: <feDistantLight>
		"baseFrequency",
		"bias",
		"color-interpolation-filters",
		"diffuseConstant",
		"divisor",
		"edgeMode",
		"elevation",
		"exponent",
		"filter",
		"filterRes",
		"filterUnits",
		"flood-color",
		"flood-opacity",
		"in", // identifies input for the given filter primitive.
		"in2", // identifies the second input for the given filter primitive.
		"intercept", // defines the intercept of the linear function of color component transfers
		"k1", // only used by: <feComposite>
		"k2", // only used by: <feComposite>
		"k3", // only used by: <feComposite>
		"k4", // only used by: <feComposite>
		"kernelMatrix", // only used by: <feConvolveMatrix>
		"lighting-color",
		"limitingConeAngle",
		"mode",
		"numOctaves",
		"operator",
		"order",
		"pointsAtX",
		"pointsAtY",
		"pointsAtZ",
		"preserveAlpha",
		"primitiveUnits",
		"radius",
		"result",
		"seed",
		"specularConstant",
		"specularExponent",
		"stdDeviation",
		"stitchTiles",
		"surfaceScale",
		"targetX", // only used in: <feConvolveMatrix>
		"targetY", // only used in: <feConvolveMatrix>
		"type", // many different uses, in animate, and <style> <script>
		"xChannelSelector", // <feDisplacementMap>
		"yChannelSelector",
	],
	text: [
		// "x",   // <text>
		// "y",   // <text>
		"dx", // <text>
		"dy", // <text>
		"alignment-baseline", // specifies how a text alignts vertically
		"baseline-shift",
		"dominant-baseline",
		"lengthAdjust", // <text>
		"method", // for <textPath> only
		"overline-position",
		"overline-thickness",
		"rotate", // rotates each individual glyph
		"spacing",
		"startOffset", // <textPath>
		"strikethrough-position",
		"strikethrough-thickness",
		"text-anchor",
		"text-decoration",
		"text-rendering",
		"textLength", // <text>
		"underline-position",
		"underline-thickness",
		"word-spacing",
		"writing-mode",
	],
	gradient: [
		"gradientTransform", // linear/radial gradient
		"gradientUnits", // linear/radial gradient
		"spreadMethod", // linear/radial gradient
	],
};

/**
 * SVG (c) Kraft
 */

Object.values(NodeNames)
	.reduce((a, b) => a.concat(b), [])
	.filter(nodeName => attributes[nodeName] === undefined)
	.forEach(nodeName => { attributes[nodeName] = []; });

[[[str_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
	[["filter"], ManyElements.effects],
	[NodeNames.cT.concat("text"), ManyElements.text], // todo: should we include "svg" here?
	[NodeNames.cF, ManyElements.effects],
	[NodeNames.cG, ManyElements.gradient],
].forEach(pair => pair[0].forEach(key => {
	attributes[key] = attributes[key].concat(pair[1]);
}));

/**
 * SVG (c) Kraft
 */

const getClassList = (element) => {
	if (element == null) { return []; }
	const currentClass = element.getAttribute(str_class);
	return (currentClass == null
		? []
		: currentClass.split(" ").filter(s => s !== ""));
};

var classMethods = {
	addClass: (element, newClass) => {
		const classes = getClassList(element)
			.filter(c => c !== newClass);
		classes.push(newClass);
		element.setAttributeNS(null, str_class, classes.join(" "));
	},
	removeClass: (element, removedClass) => {
		const classes = getClassList(element)
			.filter(c => c !== removedClass);
		element.setAttributeNS(null, str_class, classes.join(" "));
	},
	setClass: (element, className) => {
		element.setAttributeNS(null, str_class, className);
	},
	setId: (element, idName) => {
		element.setAttributeNS(null, str_id, idName);
	},
};

/**
 * SVG (c) Kraft
 */

const getAttr = (element) => {
	const t = element.getAttribute(str_transform);
	return (t == null || t === "") ? undefined : t;
};

const TransformMethods = {
	clearTransform: (el) => { el.removeAttribute(str_transform); return el; },
};

["translate", "rotate", "scale", "matrix"].forEach(key => {
	TransformMethods[key] = (element, ...args) => element.setAttribute(
		str_transform,
		[getAttr(element), `${key}(${args.join(" ")})`]
			.filter(a => a !== undefined)
			.join(" "),
	);
});

/**
 * SVG (c) Kraft
 */

// for the clip-path and mask values. looks for the ID as a "url(#id-name)" string
const findIdURL = function (arg) {
	if (arg == null) { return ""; }
	if (typeof arg === str_string) {
		return arg.slice(0, 3) === "url"
			? arg
			: `url(#${arg})`;
	}
	if (arg.getAttribute != null) {
		const idString = arg.getAttribute(str_id);
		return `url(#${idString})`;
	}
	return "";
};

const methods = {};

// these do not represent the nodes that these methods are applied to
// every node gets these attribute-setting method (pointing to a mask)
["clip-path",
	"mask",
	"symbol",
	"marker-end",
	"marker-mid",
	"marker-start",
].forEach(attr => {
	methods[Case.toCamel(attr)] = (element, parent) => element.setAttribute(attr, findIdURL(parent));
});

/**
 * SVG (c) Kraft
 */

const Nodes = {};

// assuming custom nodes are drawing-type, make them known to the library
NodeNames.v.push(...Object.keys(nodes));
// assuming custom nodes are drawing-type, append presentation attributes
Object.keys(nodes).forEach((node) => {
	nodes[node].attributes = (nodes[node].attributes === undefined
		? [...ManyElements.presentation]
		: nodes[node].attributes.concat(ManyElements.presentation));
});
// incorporate custom nodes as if they are drawing primitives.
// Object.assign(Nodes, Spec);//, CustomNodes);
Object.assign(Nodes, Spec, nodes);

// in most cases the key === value. "line": "line"
// except custom shapes: "regularPolygon": "polygon"
Object.keys(NodeNames)
	.forEach(key => NodeNames[key]
		.filter(nodeName => Nodes[nodeName] === undefined)
		.forEach((nodeName) => {
			Nodes[nodeName] = {};
		}));

const passthrough = function () { return Array.from(arguments); };

// complete the lookup table. empty entries where nothing existed
Object.keys(Nodes).forEach((key) => {
	if (!Nodes[key].nodeName) { Nodes[key].nodeName = key; }
	if (!Nodes[key].init) { Nodes[key].init = passthrough; }
	if (!Nodes[key].args) { Nodes[key].args = passthrough; }
	if (!Nodes[key].methods) { Nodes[key].methods = {}; }
	if (!Nodes[key].attributes) {
		Nodes[key].attributes = attributes[key] || [];
	}
});

const assignMethods = (groups, Methods) => {
	groups.forEach(n => Object
		.keys(Methods).forEach((method) => {
			Nodes[n].methods[method] = function () {
				Methods[method](...arguments);
				return arguments[0];
			};
		}));
};

assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
assignMethods(svg_flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), TransformMethods);
assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);

/**
 * SVG (c) Kraft
 */

const RequiredAttrMap = {
	svg: {
		version: "1.1",
		xmlns: NS,
	},
	style: {
		type: "text/css",
	},
};

// required attributes for elements like <svg>, <style>
const RequiredAttributes = (element, nodeName) => {
	if (RequiredAttrMap[nodeName]) {
		Object.keys(RequiredAttrMap[nodeName])
			.forEach(key => element.setAttribute(key, RequiredAttrMap[nodeName][key]));
	}
};

const bound = {};

const constructor = (nodeName, parent, ...args) => {
	const element = SVGWindow().document.createElementNS(NS, Nodes[nodeName].nodeName);
	if (parent) { parent.appendChild(element); }
	RequiredAttributes(element, nodeName);
	Nodes[nodeName].init(element, ...args);
	Nodes[nodeName].args(...args).forEach((v, i) => {
		if (Nodes[nodeName].attributes[i] != null) {
			element.setAttribute(Nodes[nodeName].attributes[i], v);
		}
	});
	// camelCase functional style attribute setters, like .stroke() .strokeWidth()
	Nodes[nodeName].attributes.forEach((attribute) => {
		Object.defineProperty(element, Case.toCamel(attribute), {
			value: function () {
				element.setAttribute(attribute, ...arguments);
				return element;
			}
		});
	});
	// custom methods from each primitive's definition
	Object.keys(Nodes[nodeName].methods).forEach(methodName => Object
		.defineProperty(element, methodName, {
			value: function () {
				// all custom methods are attached to the node.
				// if there is no return value specified,
				// the method will return the element itself
				// to encourage method-chaining design.
				// nevermind.
				// things need to be able to return undefined
				return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments);
				// || element;
			},
		}));
	// a method to create a child and automatically append it to this node
	if (nodesAndChildren[nodeName]) {
		nodesAndChildren[nodeName].forEach((childNode) => {
			const value = function () { return constructor(childNode, element, ...arguments); };
			// static methods have to be created in runtime,
			// after the object has been initialized.
			if (Nodes[childNode].static) {
				Object.keys(Nodes[childNode].static).forEach(key => {
					value[key] = function () {
						return Nodes[childNode].static[key](element, ...arguments);
					};
				});
			}
			Object.defineProperty(element, childNode, { value });
		});
	}
	return element;
};

bound.Constructor = constructor;

/**
 * SVG (c) Kraft
 */

const elements = {};

Object.keys(NodeNames).forEach(key => NodeNames[key]
	.forEach((nodeName) => {
		elements[nodeName] = (...args) => constructor(nodeName, null, ...args);
	}));

/**
 * SVG (c) Kraft
 */
/**
 * The purpose of this section is to implant this library to become
 * one small part of a larger library. This requires knowing about
 * the larger library, for now, the linking is hard-coded to Rabbit Ear.
 */
const link_rabbitear_math = (svg, ear) => {
	// give all primitives a .svg() method that turns them into a <path>
	// ignoring primitives: "vector", "line", "ray", "matrix", "plane"
	["segment",
		"circle",
		"ellipse",
		"rect",
		"polygon",
	].filter(key => ear[key] && ear[key].prototype)
		.forEach((key) => {
			ear[key].prototype.svg = function () { return svg.path(this.svgPath()); };
		});

	// bind the other way. allow SVG library to return vector() objects,
	// as in the onMove function, the location of the pointer.
	libraries.math.vector = ear.vector;
};

// create a new svg element "origami", which is really a <svg>
const link_rabbitear_graph = (svg, ear) => {
	// register this node name as a drawable element with the library.
	const NODE_NAME = "origami";
	// actual drawing methods are contained in Rabbit Ear under "ear.graph.svg"
	Nodes[NODE_NAME] = {
		nodeName: "g",
		init: function (element, ...args) {
			return ear.graph.svg.drawInto(element, ...args);
		},
		args: () => [],
		methods: Nodes.g.methods,
		attributes: Nodes.g.attributes,
		static: {},
	};
	Object.keys(ear.graph.svg).forEach(key => {
		Nodes[NODE_NAME].static[key] = (element, ...args) => {
			const child = ear.graph.svg[key](...args);
			element.appendChild(child);
			return child;
		};
	});
	// give "origami" the ability to act like a <svg> and create children, like <line>
	nodesAndChildren[NODE_NAME] = [...nodesAndChildren.g];
	// <svg> and <g> can call .origami() and it is appended as a child
	nodesAndChildren.svg.push(NODE_NAME);
	nodesAndChildren.g.push(NODE_NAME);
	// this sets a constructor as a child of the library itself: ear.svg.origami()
	// as well as the static methods: ear.svg.origami.edges() / faces()...
	// 'boundaries', 'faces', 'edges', 'vertices', 'drawInto', 'getViewBox'
	svg[NODE_NAME] = (...args) => constructor(NODE_NAME, null, ...args);
	Object.keys(ear.graph.svg).forEach(key => {
		svg[NODE_NAME][key] = ear.graph.svg[key];
	});
};

// link this library to be a part of the larger library
const Linker = function (lib) {
	// is the library a familiar library?
	// Rabbit Ear?
	// todo: what is the best way to uniquely identify Rabbit Ear.
	if (lib.graph && lib.origami) {
		lib.svg = this;
		link_rabbitear_math(this, lib);
		link_rabbitear_graph(this, lib);
	}
};

/**
 * SVG (c) Kraft
 */

const initialize = function (svg, ...args) {
	args.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
};

SVG_Constructor.init = function () {
	const svg = constructor(str_svg, null, ...arguments);
	// call initialize as soon as possible. check if page has loaded
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
	} else {
		initialize(svg, ...arguments);
	}
	return svg;
};

// const SVG = function () {
// 	const svg = Constructor(S.str_svg, null, ...arguments);
// 	// call initialize as soon as possible. check if page has loaded
// 	if (window().document.readyState === "loading") {
// 		window().document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
// 	} else {
// 		initialize(svg, ...arguments);
// 	}
// 	return svg;
// };

SVG.NS = NS;
SVG.linker = Linker.bind(SVG);
// SVG.use = use.bind(SVG);
Object.assign(SVG, elements);
SVG.core = Object.assign(Object.create(null), {
	load: Load,
	save,
	coordinates,
	flatten: svg_flatten_arrays,
	attributes,
	children: nodesAndChildren,
	cdata,
}, Case, classMethods, dom, svg_algebra, TransformMethods, viewBox);

// the window object, from which the document is used to createElement.
// when using Node.js, this must be set to to the
// default export of the library @xmldom/xmldom
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: value => { setWindow(value); },
});

/**
 * Rabbit Ear (c) Kraft
 */
// if three doesn't exist, throw an error
// const make_faces_geometry = (graph, material) => {
const make_faces_geometry = (graph) => {
	const { THREE } = RabbitEarWindow();
	const vertices = graph.vertices_coords
		.map(v => [v[0], v[1], v[2] || 0])
		.flat();
	const normals = graph.vertices_coords
		.map(() => [0, 0, 1])
		.flat();
	const colors = graph.vertices_coords
		.map(() => [1, 1, 1])
		.flat();
	const faces = graph.faces_vertices
		.map(fv => fv
			.map((v, i, arr) => [arr[0], arr[i + 1], arr[i + 2]])
			.slice(0, fv.length - 2))
		.flat(2);
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	geometry.setIndex(faces);
	return geometry;
};

const make_edge_cylinder = (edge_coords, edge_vector, radius, end_pad = 0) => {
	if (math.core.magSquared(edge_vector) < math.core.EPSILON) {
		return [];
	}
	const normalized = math.core.normalize(edge_vector);
	const perp = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
		.map(vec => math.core.cross3(vec, normalized))
		.sort((a, b) => math.core.magnitude(b) - math.core.magnitude(a))
		.shift();
	const rotated = [math.core.normalize(perp)];
	// const mat = math.core.make_matrix3_rotate(Math.PI/9, normalized);
	// for (let i = 1; i < 4; i += 1) {
	// 	rotated.push(math.core.multiply_matrix3_vector3(mat, rotated[i - 1]));
	// }
	for (let i = 1; i < 4; i += 1) {
		rotated.push(math.core.cross3(rotated[i - 1], normalized));
	}
	const dirs = rotated.map(v => math.core.scale(v, radius));
	const nudge = [-end_pad, end_pad].map(n => math.core.scale(normalized, n));
	const coords = end_pad === 0
		? edge_coords
		: edge_coords.map((coord, i) => math.core.add(coord, nudge[i]));
	// console.log(dirs);
	return coords
		.map(v => dirs.map(dir => math.core.add(v, dir)))
		.flat();
};

const make_edges_geometry = function ({
	vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector
}, scale=0.002, end_pad = 0) {
	const { THREE } = RabbitEarWindow();
	if (!edges_coords) {
		edges_coords = edges_vertices.map(edge => edge.map(v => vertices_coords[v]));
	}
	if (!edges_vector) {
		edges_vector = edges_coords.map(edge => math.core.subtract(edge[1], edge[0]));
	}
	// make sure they all have a z component. when z is implied it's 0
	edges_coords = edges_coords
		.map(edge => edge
			.map(coord => math.core.resize(3, coord)));
	edges_vector = edges_vector
		.map(vec => math.core.resize(3, vec));
	const colorAssignments = {
		B: [0.0, 0.0, 0.0],
		// M: [0.9, 0.31, 0.16],
		M: [0.0, 0.0, 0.0], // [34/255, 76/255, 117/255], //[0.6,0.2,0.11],
		F: [0.0, 0.0, 0.0], // [0.25,0.25,0.25],
		V: [0.0, 0.0, 0.0], // [227/255, 85/255, 54/255]//[0.12,0.35,0.50]
	};

	const colors = edges_assignment.map(e => [
		colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
		colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
	]).flat(3);

	const vertices = edges_coords
		.map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale, end_pad))
		.flat(2);

	const normals = edges_vector.map(vector => {
		if (math.core.magSquared(vector) < math.core.EPSILON) {
			throw new Error("degenerate edge");
		}
		math.core.normalize(vector);
		// scale to line width
		// const scaled = math.core.scale(normalized, scale);
		// let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
		const c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, -1])), scale);
		const c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, 1])), scale);
		// let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
		// let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
		return [
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]],
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]],
		];
	}).flat(2);

	const faces = edges_coords.map((e, i) => [
		// 8 triangles making the long cylinder
		i * 8 + 0, i * 8 + 4, i * 8 + 1,
		i * 8 + 1, i * 8 + 4, i * 8 + 5,
		i * 8 + 1, i * 8 + 5, i * 8 + 2,
		i * 8 + 2, i * 8 + 5, i * 8 + 6,
		i * 8 + 2, i * 8 + 6, i * 8 + 3,
		i * 8 + 3, i * 8 + 6, i * 8 + 7,
		i * 8 + 3, i * 8 + 7, i * 8 + 0,
		i * 8 + 0, i * 8 + 7, i * 8 + 4,
		// endcaps
		i * 8 + 0, i * 8 + 1, i * 8 + 3,
		i * 8 + 1, i * 8 + 2, i * 8 + 3,
		i * 8 + 5, i * 8 + 4, i * 8 + 7,
		i * 8 + 7, i * 8 + 6, i * 8 + 5,
	]).flat();

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	geometry.setIndex(faces);
	geometry.computeVertexNormals();
	return geometry;
};

var webgl = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_faces_geometry: make_faces_geometry,
	make_edges_geometry: make_edges_geometry
});

/**
 * Rabbit Ear (c) Kraft
 */

const ear = Object.assign(root, ObjectConstructors, {
	math: math.core,
	axiom,
	diagram,
	layer,
	singleVertex,
	text,
	webgl,
	// svg,
});
/**
 * math is uniquely constructed where all the core methods are exposed
 * under ".math", and the top-level class-style objects will be attached
 * to this library's top level.
 */
Object.keys(math)
	.filter(key => key !== "core")
	.forEach((key) => { ear[key] = math[key]; });
/**
 * use() must bind this library to "this", as a way of making this library
 * mutable, so that the extension can bind itself throughout this library.
 */
Object.defineProperty(ear, "use", {
	enumerable: false,
	value: use.bind(ear),
});
/**
 * binding the extensions must happen after the library has been initialized.
 */
if (!isWebWorker) {
	ear.use(FOLDtoSVG); // must happen before SVG
	ear.use(SVG);
}

Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => {
		setWindow$1(value);
		// hardcoded. update window in extensions automatically, if we know them.
		SVG.window = value;
	},
});

export { ear as default };
