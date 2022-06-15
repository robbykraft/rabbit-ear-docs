/* Rabbit Ear 0.9.xx alpha 2022-05-13 (c) Kraft, MIT License */

/**
 * Rabbit Ear (c) Kraft
 */
// this is a really verbose way of coding this but so far this is the best
// way i can find to compress references in the minified .js file
const _undefined = "undefined";
const _number = "number";
const _object = "object";
const _class = "class";
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
const isBrowser = typeof window !== _undefined
	&& typeof window.document !== _undefined;

const isNode = typeof process !== _undefined
	&& process.versions != null
	&& process.versions.node != null;

const isWebWorker = typeof self === _object
	&& self.constructor
	&& self.constructor.name === "DedicatedWorkerGlobalScope";

// // for debugging, uncomment to log system on boot
// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar [${operating_systems}]`);

/**
 * Rabbit Ear (c) Kraft
 */
var root = Object.create(null);

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
const type_of = function (obj) {
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
const resize_up = (a, b) => {
  const size = a.length > b.length ? a.length : b.length;
  return [a, b].map(v => resize(size, v));
};

/**
 * this makes the two vectors match in dimension.
 * the larger array will be shrunk to match the length of the smaller
 */
const resize_down = (a, b) => {
  const size = a.length > b.length ? b.length : a.length;
  return [a, b].map(v => resize(size, v));
};

const count_places = function (num) {
  const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!m) { return 0; }
  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};

/**
 * clean floating point numbers
 * example: 15.0000000000000002 into 15
 * the epsilon is adjustable default 15 places for Javascript's 16 digit float.
 * the remainder will be chopped off, make this epsilon as small as possible.
 * @args must be a number! do you own checking. this is for speed.
 */
const clean_number = function (num, places = 15) {
  if (typeof num !== "number") { return num; }
  const crop = parseFloat(num.toFixed(places));
  if (count_places(crop) === Math.min(places, count_places(num))) {
    return num;
  }
  return crop;
};

const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";

/**
 * flatten only until the point of comma separated entities. recursive
 * @returns always an array
 */
const semi_flatten_arrays = function () {
  switch (arguments.length) {
    case undefined:
    case 0: return Array.from(arguments);
    // only if its an array (is iterable) and NOT a string
    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
      ? semi_flatten_arrays(...arguments[0])
      : [arguments[0]];
    default:
      return Array.from(arguments).map(a => (is_iterable(a)
        ? [...semi_flatten_arrays(a)]
        : a));
  }
};

/**
 * totally flatten, recursive
 * @returns an array, always.
 */
const flatten_arrays = function () {
  switch (arguments.length) {
    case undefined:
    case 0: return Array.from(arguments);
    // only if its an array (is iterable) and NOT a string
    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
      ? flatten_arrays(...arguments[0])
      : [arguments[0]];
    default:
      return Array.from(arguments).map(a => (is_iterable(a)
        ? [...flatten_arrays(a)]
        : a)).reduce((a, b) => a.concat(b), []);
  }
};

var resizers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  resize: resize,
  resize_up: resize_up,
  resize_down: resize_down,
  clean_number: clean_number,
  semi_flatten_arrays: semi_flatten_arrays,
  flatten_arrays: flatten_arrays
});

/**
 * Math (c) Kraft
 */
const EPSILON = 1e-6;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
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
const fn_true = () => true;
const fn_square = n => n * n;
const fn_add = (a, b) => a + (b || 0);
const fn_not_undefined = a => a !== undefined;
const fn_and = (a, b) => a && b;
const fn_cat = (a, b) => a.concat(b);
const fn_vec2_angle = v => Math.atan2(v[1], v[0]);
const fn_to_vec2 = a => [Math.cos(a), Math.sin(a)];
const fn_equal = (a, b) => a === b;
const fn_epsilon_equal = (a, b) => Math.abs(a - b) < EPSILON;
/**
 * test for sided-ness, like point in polygon
 * @returns {boolean}
 */
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * tests for lines
 * @returns {boolean}
 */
const include_l = fn_true;
const exclude_l = fn_true;
const include_r = include;
const exclude_r = exclude;
const include_s = (t, e = EPSILON) => t > -e && t < 1 + e;
const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * methods that clip lines (rays/segments), meant to return
 * the t value scaled along the vector.
 * @returns {number}
 */
const line_limiter = dist => dist;
const ray_limiter = dist => (dist < -EPSILON ? 0 : dist);
const segment_limiter = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};

var functions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  fn_true: fn_true,
  fn_square: fn_square,
  fn_add: fn_add,
  fn_not_undefined: fn_not_undefined,
  fn_and: fn_and,
  fn_cat: fn_cat,
  fn_vec2_angle: fn_vec2_angle,
  fn_to_vec2: fn_to_vec2,
  fn_equal: fn_equal,
  fn_epsilon_equal: fn_epsilon_equal,
  include: include,
  exclude: exclude,
  include_l: include_l,
  exclude_l: exclude_l,
  include_r: include_r,
  exclude_r: exclude_r,
  include_s: include_s,
  exclude_s: exclude_s,
  line_limiter: line_limiter,
  ray_limiter: ray_limiter,
  segment_limiter: segment_limiter
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
const identity2x2 = [1, 0, 0, 1];
const identity2x3 = identity2x2.concat(0, 0);

/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
const multiply_matrix2_vector2 = (matrix, vector) => [
  matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
  matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
const multiply_matrix2_line2 = (matrix, vector, origin) => ({
  vector: [
    matrix[0] * vector[0] + matrix[2] * vector[1],
    matrix[1] * vector[0] + matrix[3] * vector[1]
  ],
  origin: [
    matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
    matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
  ],
});
/**
 * @param {number[]} matrix, matrix, left/right order matches what you'd see on a page.
 * @returns {number[]} matrix
 */
const multiply_matrices2 = (m1, m2) => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
];

const determinant2 = m => m[0] * m[3] - m[1] * m[2];

/**
 * @param {number[]} matrix
 * @returns {number[]} matrix
 */
const invert_matrix2 = (m) => {
  const det = determinant2(m);
  if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
    return undefined;
  }
  return [
    m[3] / det,
    -m[1] / det,
    -m[2] / det,
    m[0] / det,
    (m[2] * m[5] - m[3] * m[4]) / det,
    (m[1] * m[4] - m[0] * m[5]) / det
  ];
};

/**
 * @param {number} x, y
 * @returns {number[]} matrix
 */
const make_matrix2_translate = (x = 0, y = 0) => identity2x2.concat(x, y);
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns {number[]} matrix
 */
const make_matrix2_scale = (x, y, origin = [0, 0]) => [
  x,
  0,
  0,
  y,
  x * -origin[0] + origin[0],
  y * -origin[1] + origin[1]
];
/**
 * @param angle of rotation, origin of transformation
 * @returns {number[]} matrix
 */
const make_matrix2_rotate = (angle, origin = [0, 0]) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    cos,
    sin,
    -sin,
    cos,
    origin[0],
    origin[1]
  ];
};
/**
 * remember vector comes before origin. origin comes last, so that it's easy
 * to leave it empty and make a reflection through the origin.
 * @param line in vector-origin form
 * @returns matrix
 */
const make_matrix2_reflect = (vector, origin = [0, 0]) => {
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
  multiply_matrix2_vector2: multiply_matrix2_vector2,
  multiply_matrix2_line2: multiply_matrix2_line2,
  multiply_matrices2: multiply_matrices2,
  determinant2: determinant2,
  invert_matrix2: invert_matrix2,
  make_matrix2_translate: make_matrix2_translate,
  make_matrix2_scale: make_matrix2_scale,
  make_matrix2_rotate: make_matrix2_rotate,
  make_matrix2_reflect: make_matrix2_reflect
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
 */
const magnitude = v => Math.sqrt(v
  .map(fn_square)
  .reduce(fn_add, 0));
/**
 * @description compute the magnitude a 2D vector
 * @param {number[]} v one 2D vector
 * @returns {number} one scalar
 */
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
/**
 * @description compute the square-magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 */
const mag_squared = v => v
  .map(fn_square)
  .reduce(fn_add, 0);
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching the input vector
 */
const normalize = (v) => {
  const m = magnitude(v);
  return m === 0 ? v : v.map(c => c / m);
};
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
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
 */
const scale = (v, s) => v.map(n => n * s);
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one 2D vector
 * @param {number} s one scalar
 * @returns {number[]} one 2D vector
 */
const scale2 = (v, s) => [v[0] * s, v[1] * s];
/**
 * @description add two vectors and return the sum as another vector, do not modify the input vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 */
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
/**
 * @description add two vectors and return the sum as another vector, do not modify the input vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 */
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 */
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 */
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
/**
 * @description compute the dot product of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 */
const dot = (v, u) => v
  .map((_, i) => v[i] * u[i])
  .reduce(fn_add, 0);
/**
 * @description compute the dot product of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 */
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
/**
 * @description compute the midpoint of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one vector, dimension matching first parameter
 */
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * @description compute the midpoint of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one 2D vector
 */
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
/**
 * @description the average of N number of vectors, similar to midpoint, but can accept more than 2 inputs
 * @param {number[]} ...args any number of input vectors
 * @returns {number[]} one vector, dimension matching first parameter
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
 */
const lerp = (v, u, t) => {
  const inv = 1.0 - t;
  return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
/**
 * @description the determinant of the matrix of the 2 vectors (possible bad name, 2D cross product is undefined)
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar; the determinant; the magnitude of the vector
 */
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
/**
 * @description the 3D cross product of two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
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
 */
const distance = (v, u) => Math.sqrt(v
  .map((_, i) => (v[i] - u[i]) ** 2)
  .reduce(fn_add, 0));
/**
 * @description compute the distance between two 2D vectors
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
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
 */
const flip = v => v.map(n => -n);
/**
 * @description return a copy of the input vector rotated 90 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 */
const rotate90 = v => [-v[1], v[0]];
/**
 * @description return a copy of the input vector rotated 270 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 */
const rotate270 = v => [v[1], -v[0]];
/**
 * @description check if a vector is degenerate, meaning its magnitude is below an epsilon limit.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the magnitude of the vector smaller than the epsilon?
 */
const degenerate = (v, epsilon = EPSILON) => v
  .map(n => Math.abs(n))
  .reduce(fn_add, 0) < epsilon;
/**
 * @description check if two vectors are parallel to each other within an epsilon
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 */
const parallel = (v, u, epsilon = EPSILON) => 1 - Math
  .abs(dot(normalize(v), normalize(u))) < epsilon;
/**
 * @description check if two 2D vectors are parallel to each other within an epsilon
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 */
const parallel2 = (v, u, epsilon = EPSILON) => Math
  .abs(cross2(v, u)) < epsilon;

var algebra = /*#__PURE__*/Object.freeze({
  __proto__: null,
  magnitude: magnitude,
  magnitude2: magnitude2,
  mag_squared: mag_squared,
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

const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
/**
 * @param {number[]} is a 3x4 matrix the identity matrix
 * with a translation component of 0, 0, 0
 * @returns boolean
 */
const is_identity3x4 = m => identity3x4
  .map((n, i) => Math.abs(n - m[i]) < EPSILON)
  .reduce((a, b) => a && b, true);
/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array frotateorm
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
const multiply_matrix3_vector3 = (m, vector) => [
  m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
  m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
  m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
const multiply_matrix3_line3 = (m, vector, origin) => ({
  vector: [
    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]
  ],
  origin: [
    m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
    m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
    m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]
  ],
});

const multiply_matrices3 = (m1, m2) => [
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
  m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]
];

const determinant3 = m => (
    m[0] * m[4] * m[8]
  - m[0] * m[7] * m[5]
  - m[3] * m[1] * m[8]
  + m[3] * m[7] * m[2]
  + m[6] * m[1] * m[5]
  - m[6] * m[4] * m[2]
);
/**
 * @param matrix
 * @returns matrix
 */
const invert_matrix3 = (m) => {
  const det = determinant3(m);
  if (Math.abs(det) < 1e-6 || isNaN(det)
    || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
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
      - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]
  ];
  const invDet = 1.0 / det;
  return inv.map(n => n * invDet);
};

const make_matrix3_translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);

// i0 and i1 direct which columns and rows are filled
// sgn manages right hand rule
const single_axis_rotate = (angle, origin, i0, i1, sgn) => {
  const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  mat[i0*3 + i0] = cos;
  mat[i0*3 + i1] = (sgn ? +1 : -1) * sin;
  mat[i1*3 + i0] = (sgn ? -1 : +1) * sin;
  mat[i1*3 + i1] = cos;
  return mat;
};

const make_matrix3_rotateX = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 1, 2, true);
const make_matrix3_rotateY = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 2, false);
const make_matrix3_rotateZ = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 1, true);

const make_matrix3_rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
  const pos = [0, 1, 2].map(i => origin[i] || 0);
  const [x, y, z] = resize(3, normalize(vector));
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const trans     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
  const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
  return multiply_matrices3(trans_inv, multiply_matrices3([
    t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
    t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
    t * x * z + y * s, t * y * z - x * s, t * z * z + c,
    0, 0, 0], trans));
};

const make_matrix3_scale = (scale, origin = [0, 0, 0]) => [
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
  scale * -origin[2] + origin[2]
];

/**
 * 2D operation, assuming everything is 0 in the z plane
 * @param line in vector-origin form
 * @returns matrix3
 */
const make_matrix3_reflectZ = (vector, origin = [0, 0]) => {
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
  is_identity3x4: is_identity3x4,
  multiply_matrix3_vector3: multiply_matrix3_vector3,
  multiply_matrix3_line3: multiply_matrix3_line3,
  multiply_matrices3: multiply_matrices3,
  determinant3: determinant3,
  invert_matrix3: invert_matrix3,
  make_matrix3_translate: make_matrix3_translate,
  make_matrix3_rotateX: make_matrix3_rotateX,
  make_matrix3_rotateY: make_matrix3_rotateY,
  make_matrix3_rotateZ: make_matrix3_rotateZ,
  make_matrix3_rotate: make_matrix3_rotate,
  make_matrix3_scale: make_matrix3_scale,
  make_matrix3_reflectZ: make_matrix3_reflectZ
});

/**
 * Math (c) Kraft
 */
/**
 * @returns {object} in form { point:[], vector:[] }
*/
const vector_origin_form = (vector, origin) => ({
  vector: vector || [],
  origin: origin || []
});

/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const get_vector = function () {
  // todo, incorporate constructors.vector check to all indices. and below
  if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
  let list = flatten_arrays(arguments); // .filter(fn_not_undefined);
  if (list.length > 0
    && typeof list[0] === "object"
    && list[0] !== null
    && !isNaN(list[0].x)) {
    list = ["x", "y", "z"]
      .map(c => list[0][c])
      .filter(fn_not_undefined);
  }
  return list.filter(n => typeof n === "number");
};

/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const get_vector_of_vectors = function () {
  return semi_flatten_arrays(arguments)
    .map(el => get_vector(el));
};

/**
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
const get_segment = function () {
  if (arguments[0] instanceof Constructors.segment) {
    return arguments[0];
  }
  const args = semi_flatten_arrays(arguments);
  if (args.length === 4) {
    return [
      [args[0], args[1]],
      [args[2], args[3]]
    ];
  }
  return args.map(el => get_vector(el));
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
const get_line = function () {
  const args = semi_flatten_arrays(arguments);
  if (args.length === 0) { return vector_origin_form([], []); }
  if (args[0] instanceof Constructors.line
    || args[0] instanceof Constructors.ray
    || args[0] instanceof Constructors.segment) { return args[0]; }
  if (args[0].constructor === Object && args[0].vector !== undefined) {
    return vector_origin_form(args[0].vector || [], args[0].origin || []);
  }
  return typeof args[0] === "number"
    ? vector_origin_form(get_vector(args))
    : vector_origin_form(...args.map(a => get_vector(a)));
};

const get_ray = get_line;

// export const get_line_ud = function () {
//   if (arguments.length === 0) { return { u:[], d:0 }; }
//   if (arguments[0] instanceof Constructors.line) { return args[0]; }
//   if (arguments[0].constructor === Object && arguments[0].u !== undefined) {
//     return { u: arguments[0].u || [], d: arguments[0].d || 0 };
//   }
// };

const get_rect_params = (x = 0, y = 0, width = 0, height = 0) => ({
  x, y, width, height
});

const get_rect = function () {
  if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
  const list = flatten_arrays(arguments); // .filter(fn_not_undefined);
  if (list.length > 0
    && typeof list[0] === "object"
    && list[0] !== null
    && !isNaN(list[0].width)) {
    return get_rect_params(...["x", "y", "width", "height"]
      .map(c => list[0][c])
      .filter(fn_not_undefined));
  }
  const numbers = list.filter(n => typeof n === "number");
  const rect_params = numbers.length < 4
    ? [, , ...numbers]
    : numbers;
  return get_rect_params(...rect_params);
};

/**
 * radius is the first parameter so that the origin can be N-dimensional
 * ...args is a list of numbers that become the origin.
 */
const get_circle_params = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});

const get_circle = function () {
	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
  const vectors = get_vector_of_vectors(arguments);
  const numbers = flatten_arrays(arguments).filter(a => typeof a === "number");
  if (arguments.length === 2) {
    if (vectors[1].length === 1) {
			return get_circle_params(vectors[1][0], ...vectors[0]);
    } else if (vectors[0].length === 1) {
			return get_circle_params(vectors[0][0], ...vectors[1]);
    } else if (vectors[0].length > 1 && vectors[1].length > 1) {
			return get_circle_params(distance2(...vectors), ...vectors[0]);
    }
  }
  else {
    switch (numbers.length) {
      case 0: return get_circle_params(1, 0, 0, 0);
      case 1: return get_circle_params(numbers[0], 0, 0, 0);
      default: return get_circle_params(numbers.pop(), ...numbers);
    }
  }
	return get_circle_params(1, 0, 0, 0);
};

const maps_3x4 = [
  [0, 1, 3, 4, 9, 10],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]
];
[11, 7, 3].forEach(i => delete maps_3x4[2][i]);

const matrix_map_3x4 = len => {
  let i;
  if (len < 8) i = 0;
  else if (len < 13) i = 1;
  else i = 2;
  return maps_3x4[i];
};

/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
const get_matrix_3x4 = function () {
  const mat = flatten_arrays(arguments);
  const matrix = [...identity3x4];
  matrix_map_3x4(mat.length)
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
//   const m = get_vector(arguments);
//   if (m.length === 6) { return m; }
//   if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
//   if (m.length < 6) {
//     return identity2x3.map((n, i) => m[i] || n);
//   }
// };

var getters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get_vector: get_vector,
  get_vector_of_vectors: get_vector_of_vectors,
  get_segment: get_segment,
  get_line: get_line,
  get_ray: get_ray,
  get_rect_params: get_rect_params,
  get_rect: get_rect,
  get_circle: get_circle,
  get_matrix_3x4: get_matrix_3x4
});

/**
 * Math (c) Kraft
 */

const array_similarity_test = (list, compFunc) => Array
  .from(Array(list.length - 1))
  .map((_, i) => compFunc(list[0], list[i + 1]))
  .reduce(fn_and, true);

// square bounding box for fast calculation
const equivalent_vector2 = (a, b) => [0, 1]
  .map(i => fn_epsilon_equal(a[i], b[i]))
  .reduce(fn_and, true);
// export const equivalent_vector2 = (a, b) => Math.abs(a[0] - b[0]) < EPSILON
//   && Math.abs(a[1] - b[1]) < EPSILON;
/**
 * @param {...number} a sequence of numbers
 * @returns boolean
 */
const equivalent_numbers = function () {
  if (arguments.length === 0) { return false; }
  if (arguments.length === 1 && arguments[0] !== undefined) {
    return equivalent_numbers(...arguments[0]);
  }
  return array_similarity_test(arguments, fn_epsilon_equal);
};
/**
 * this method compares two vectors and is permissive with trailing zeros
 * equivalency of [1, 2] and [1, 2, 0] is true
 * however, equivalency of [1, 2] and [1, 2, 3] is false
 * @param {...number[]} compare n number of vectors, requires a consistent dimension
 * @returns boolean
 */
// export const equivalent_vectors = (a, b) => {
//   const vecs = resize_up(a, b);
//   return vecs[0]
//     .map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
//     .reduce((u, v) => u && v, true);
// };

const equivalent_vectors = function () {
  const args = Array.from(arguments);
  const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
  const vecs = args.map(a => resize(length, a));
  return Array.from(Array(arguments.length - 1))
    .map((_, i) => vecs[0]
      .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
      .reduce(fn_and, true))
    .reduce(fn_and, true);
};
// export const equivalent_arrays = function (...args) {
//   const list = semi_flatten_arrays(args);
//   if (list.length === 0) { return false; }
//   if (list.length === 1 && list[0] !== undefined) {
//     return equivalent_vectors(...list[0]);
//   }
//   const dimension = list[0].length;
//   const dim_array = Array.from(Array(dimension));
//   return Array
//     .from(Array(list.length - 1))
//     .map((element, i) => dim_array
//       .map((_, di) => Math.abs(list[i][di] - list[i + 1][di]) < EPSILON)
//       .reduce((prev, curr) => prev && curr, true))
//     .reduce((prev, curr) => prev && curr, true)
//   && Array
//     .from(Array(list.length - 1))
//     .map((_, i) => list[0].length === list[i + 1].length)
//     .reduce((a, b) => a && b, true);
// };

// const equivalent_across_arrays = function (...args) {
//   const list = args;
//   const dimension = list[0].length;
//   const dim_array = Array.from(Array(dimension));
//   return Array
//     .from(Array(list.length - 1))
//     .map((element, i) => dim_array
//       .map((_, di) => Math.abs(list[i][di] - list[i + 1][di]) < EPSILON)
//       .reduce((prev, curr) => prev && curr, true))
//     .reduce((prev, curr) => prev && curr, true)
//   && Array
//     .from(Array(list.length - 1))
//     .map((_, i) => list[0].length === list[i + 1].length)
//     .reduce((a, b) => a && b, true);
// };

/**
 * @param {*} comma-separated sequence of either
 *   1. boolean
 *   2. number
 *   3. arrays of numbers (vectors)
 * @returns boolean
 */
const equivalent = function () {
  const list = semi_flatten_arrays(...arguments);
  if (list.length < 1) { return false; }
  const typeofList = typeof list[0];
  // array contains undefined, cannot compare
  if (typeofList === "undefined") { return false; }
  switch (typeofList) {
    case "number":
      return array_similarity_test(list, fn_epsilon_equal);
    case "boolean":
    case "string":
      return array_similarity_test(list, fn_equal);
    case "object":
      if (list[0].constructor === Array) { return equivalent_vectors(...list); }
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default: return undefined;
  }
};

var equal = /*#__PURE__*/Object.freeze({
  __proto__: null,
  equivalent_vector2: equivalent_vector2,
  equivalent_numbers: equivalent_numbers,
  equivalent_vectors: equivalent_vectors,
  equivalent: equivalent
});

/**
 * Math (c) Kraft
 */
const sort_points_along_vector2 = (points, vector) => points
  .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
  .sort((a, b) => a.d - b.d)
  .map(a => a.point);

var sort$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  sort_points_along_vector2: sort_points_along_vector2
});

/**
 * Math (c) Kraft
 */

const smallest_comparison_search = (obj, array, compare_func) => {
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
 * find the one point in array_of_points closest to point.
 */
const nearest_point2 = (point, array_of_points) => {
  // todo speed up with partitioning
  const index = smallest_comparison_search(point, array_of_points, distance2);
  return index === undefined ? undefined : array_of_points[index];
};
/**
 * find the one point in array_of_points closest to point.
 */
const nearest_point = (point, array_of_points) => {
  // todo speed up with partitioning
  const index = smallest_comparison_search(point, array_of_points, distance);
  return index === undefined ? undefined : array_of_points[index];
};

const nearest_point_on_line = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
  origin = resize(vector.length, origin);
  point = resize(vector.length, point);
  const magSquared = mag_squared(vector);
  const vectorToPoint = subtract(point, origin);
  const dotProd = dot(vector, vectorToPoint);
  const dist = dotProd / magSquared;
  // limit depending on line, ray, segment
  const d = limiterFunc(dist, epsilon);
  return add(origin, scale(vector, d))
};

const nearest_point_on_polygon = (polygon, point) => {
  const v = polygon
    .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
  return polygon
    .map((p, i) => nearest_point_on_line(v[i], p, point, segment_limiter))
    .map((p, i) => ({ point: p, i, distance: distance(p, point) }))
    .sort((a, b) => a.distance - b.distance)
    .shift();
};

const nearest_point_on_circle = (radius, origin, point) => add(
  origin, scale(normalize(subtract(point, origin)), radius)
);

// todo
const nearest_point_on_ellipse = () => false;

var nearest$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  smallest_comparison_search: smallest_comparison_search,
  nearest_point2: nearest_point2,
  nearest_point: nearest_point,
  nearest_point_on_line: nearest_point_on_line,
  nearest_point_on_polygon: nearest_point_on_polygon,
  nearest_point_on_circle: nearest_point_on_circle,
  nearest_point_on_ellipse: nearest_point_on_ellipse
});

/**
 * Math (c) Kraft
 */
/**
 * measurements involving vectors and radians
 */

/**
 * @description check if the first parameter is counter-clockwise between A and B.
 * @param {number} radians
 * @param {number} radians, lower bound
 * @param {number} radians, upper bound
 * @returns {boolean}
 */
const is_counter_clockwise_between = (angle, angleA, angleB) => {
  while (angleB < angleA) { angleB += TWO_PI; }
  while (angle > angleA) { angle -= TWO_PI; }
  while (angle < angleA) { angle += TWO_PI; }
  return angle < angleB;
};
/**
 * @description There are 2 interior angles between 2 angles: A-to-B clockwise and
 * A-to-B counter-clockwise, this returns the clockwise one from A to B.
 * @param {number} a angle in radians
 * @param {number} b angle in radians
 * @returns {number} interior angle in radians
 */
const clockwise_angle_radians = (a, b) => {
  // this is on average 50 to 100 times faster than clockwise_angle2
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
 * @description There are 2 interior angles between 2 angles: A-to-B clockwise and
 * A-to-B counter-clockwise, this returns the counter-clockwise one.
 * @param {number} angle in radians
 * @param {number} angle in radians
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 */
const counter_clockwise_angle_radians = (a, b) => {
  // this is on average 50 to 100 times faster than counter_clockwise_angle2
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
 * @description There are 2 angles between 2 vectors, from A to B return the clockwise one.
 * @param {number[]} vector with 2 numbers
 * @param {number[]} vector with 2 numbers
 * @returns {number} clockwise angle (from a to b) in radians
 */
const clockwise_angle2 = (a, b) => {
  const dotProduct = b[0] * a[0] + b[1] * a[1];
  const determinant = b[0] * a[1] - b[1] * a[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += TWO_PI; }
  return angle;
};

// @returns {number}
const counter_clockwise_angle2 = (a, b) => {
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
 */
const clockwise_bisect2 = (a, b) => fn_to_vec2(
  fn_vec2_angle(a) - clockwise_angle2(a, b) / 2
);
/**
 * @description calculate the angle bisection counter-clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 */
const counter_clockwise_bisect2 = (a, b) => fn_to_vec2(
  fn_vec2_angle(a) + counter_clockwise_angle2(a, b) / 2
);
/**
 * @description subsect into n-divisions the angle clockwise from one angle to the next
 * @param {number} a one angle in radians
 * @param {number} b one angle in radians
 * @param {number} divisions number of angles minus 1, 
 * @returns {number[]} array of angles in radians
 */
const clockwise_subsect_radians = (divisions, angleA, angleB) => {
  const angle = clockwise_angle_radians(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1))
    .map((_, i) => angleA + angle * (i + 1));
};
const counter_clockwise_subsect_radians = (divisions, angleA, angleB) => {
  const angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1))
    .map((_, i) => angleA + angle * (i + 1));
};
const clockwise_subsect2 = (divisions, vectorA, vectorB) => {
  const angleA = Math.atan2(vectorA[1], vectorA[0]);
  const angleB = Math.atan2(vectorB[1], vectorB[0]);
  return clockwise_subsect_radians(divisions, angleA, angleB)
    .map(fn_to_vec2);
};
/**
 * subsect the angle between two vectors (counter-clockwise from A to B)
 */
const counter_clockwise_subsect2 = (divisions, vectorA, vectorB) => {
  const angleA = Math.atan2(vectorA[1], vectorA[0]);
  const angleB = Math.atan2(vectorB[1], vectorB[0]);
  return counter_clockwise_subsect_radians(divisions, angleA, angleB)
    .map(fn_to_vec2);
};

const bisect_lines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
  const determinant = cross2(vectorA, vectorB);
  const dotProd = dot(vectorA, vectorB);
  const bisects = determinant > -epsilon
    ? [counter_clockwise_bisect2(vectorA, vectorB)]
    : [clockwise_bisect2(vectorA, vectorB)];
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
 * given vectors, make a separate array of radially-sorted vector indices
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @returns {number[]}, already c-cwise sorted would give [0,1,2,3,4]
 */
const counter_clockwise_order_radians = function () {
  const radians = flatten_arrays(arguments);
  const counter_clockwise = radians
    .map((_, i) => i)
    .sort((a, b) => radians[a] - radians[b]);
  return counter_clockwise
    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};

const counter_clockwise_order2 = function () {
  return counter_clockwise_order_radians(
    semi_flatten_arrays(arguments).map(fn_vec2_angle)
  );
};
/**
 * @description given an array of angles, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 *
 * @param {number[]} array of angles in radians
 * @returns {number[]} array of sector angles in radians
 */
const counter_clockwise_sectors_radians = function () {
  const radians = flatten_arrays(arguments);
  const ordered = counter_clockwise_order_radians(radians)
    .map(i => radians[i]);
  return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
    .map(pair => counter_clockwise_angle_radians(pair[0], pair[1]));
};
/**
 * @description given an array of vectors, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 *
 * @param {number[][]} array of 2D vectors (higher dimensions will be ignored)
 * @returns {number[]} array of sector angles in radians
 */
const counter_clockwise_sectors2 = function () {
  return counter_clockwise_sectors_radians(
    get_vector_of_vectors(arguments).map(fn_vec2_angle)
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

var radial = /*#__PURE__*/Object.freeze({
  __proto__: null,
  is_counter_clockwise_between: is_counter_clockwise_between,
  clockwise_angle_radians: clockwise_angle_radians,
  counter_clockwise_angle_radians: counter_clockwise_angle_radians,
  clockwise_angle2: clockwise_angle2,
  counter_clockwise_angle2: counter_clockwise_angle2,
  clockwise_bisect2: clockwise_bisect2,
  counter_clockwise_bisect2: counter_clockwise_bisect2,
  clockwise_subsect_radians: clockwise_subsect_radians,
  counter_clockwise_subsect_radians: counter_clockwise_subsect_radians,
  clockwise_subsect2: clockwise_subsect2,
  counter_clockwise_subsect2: counter_clockwise_subsect2,
  bisect_lines2: bisect_lines2,
  counter_clockwise_order_radians: counter_clockwise_order_radians,
  counter_clockwise_order2: counter_clockwise_order2,
  counter_clockwise_sectors_radians: counter_clockwise_sectors_radians,
  counter_clockwise_sectors2: counter_clockwise_sectors2
});

/**
 * Math (c) Kraft
 */
/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
const overlap_line_point = (vector, origin, point, func = exclude_l, epsilon = EPSILON) => {
  const p2p = subtract(point, origin);
  const lineMagSq = mag_squared(vector);
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
 * @description 2D line intersection function, generalized and works
 * for lines, rays, and segments by passing in a function for each line
 * @param {number[]} array of 2 numbers, the first line's vector
 * @param {number[]} array of 2 numbers, the first line's origin
 * @param {number[]} array of 2 numbers, the second line's vector
 * @param {number[]} array of 2 numbers, the second line's origin
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
*/
const intersect_line_line = (
  aVector, aOrigin,
  bVector, bOrigin,
  aFunction = include_l,
  bFunction = include_l,
  epsilon = EPSILON
) => {
  // a normalized determinant gives consisten values across all epsilon ranges
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
/** Calculates the signed area of a polygon. This requires the polygon be non-intersecting.
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea()
 */
const signed_area = points => 0.5 * points
  .map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return el[0] * next[1] - next[0] * el[1];
  }).reduce(fn_add, 0);
/** Calculates the centroid or the center of mass of the polygon.
 * @returns {XY} the location of the centroid
 * @example
 * var centroid = polygon.centroid()
 */
const centroid = (points) => {
  const sixthArea = 1 / (6 * signed_area(points));
  return points.map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    const mag = el[0] * next[1] - next[0] * el[1];
    return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
  }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
    .map(c => c * sixthArea);
};
/**
 * @description axis-aligned bounding box. given a set of points.
 * the epsilon is used to make the bounding box inclusive / exclusive
 * by adding a tiny bit of padding on all sides.
 * a positive epsilon results in an inclusive boundary. negative, exclusive.
 * @param {number[][]} an array of unsorted points, in any dimension.
 * @param {number} epsilon, optional, to add padding around the box.
 * @returns {object} "min" and "max" are two points, "span" is the lengths.
 */
const bounding_box = (points, epsilon = 0) => {
  const min = Array(points[0].length).fill(Infinity);
  const max = Array(points[0].length).fill(-Infinity);
  points.forEach(point => point
    .forEach((c, i) => {
      if (c < min[i]) { min[i] = c - epsilon; }
      if (c > max[i]) { max[i] = c + epsilon; }
    }));
  const span = max.map((max, i) => max - min[i]);
  return { min, max, span };
};
/**
 * the radius parameter measures from the center to the midpoint of the edge
 * vertex-axis aligned
 * todo: also possible to parameterize the radius as the center to the points
 * todo: can be edge-aligned
 */
const angle_array = count => Array
  .from(Array(Math.floor(count)))
  .map((_, i) => TWO_PI * (i / count));

const angles_to_vecs = (angles, radius) => angles
  .map(a => [radius * Math.cos(a), radius * Math.sin(a)])
  .map(pt => pt.map(n => clean_number(n, 14))); // this step is costly!
// a = 2r tan(π/n)
/**
 * make regular polygon is circumradius by default
 */
const make_regular_polygon = (sides = 3, radius = 1) =>
  angles_to_vecs(angle_array(sides), radius);

const make_regular_polygon_side_aligned = (sides = 3, radius = 1) => {
  const halfwedge = Math.PI / sides;
  const angles = angle_array(sides).map(a => a + halfwedge);
  return angles_to_vecs(angles, radius);
};

const make_regular_polygon_inradius = (sides = 3, radius = 1) => 
  make_regular_polygon(sides, radius / Math.cos(Math.PI / sides));

const make_regular_polygon_inradius_side_aligned = (sides = 3, radius = 1) =>
  make_regular_polygon_side_aligned(sides, radius / Math.cos(Math.PI / sides));

const make_regular_polygon_side_length = (sides = 3, length = 1) =>
  make_regular_polygon(sides, (length / 2) / Math.sin(Math.PI / sides));

const make_regular_polygon_side_length_side_aligned = (sides = 3, length = 1) =>
  make_regular_polygon_side_aligned(sides, (length / 2) / Math.sin(Math.PI / sides));
/**
 * @description removes any collinear vertices from a n-dimensional polygon.
 * @param {number[][]} a polygon as an array of ordered points in array form.
 * @returns {number[][]} a copy of the polygon with collinear points removed.
 */
const make_polygon_non_collinear = (polygon, epsilon = EPSILON) => {
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
// export const split_polygon = () => console.warn("split polygon not done");

const pleat_parallel = (count, a, b) => {
  const origins = Array.from(Array(count - 1))
    .map((_, i) => (i + 1) / count)
    .map(t => lerp(a.origin, b.origin, t));
  const vector = [...a.vector];
  return origins.map(origin => ({ origin, vector }));
};

const pleat_angle = (count, a, b) => {
  const origin = intersect_line_line(
    a.vector, a.origin,
    b.vector, b.origin);
  const vectors = clockwise_angle2(a.vector, b.vector) < counter_clockwise_angle2(a.vector, b.vector)
    ? clockwise_subsect2(count, a.vector, b.vector)
    : counter_clockwise_subsect2(count, a.vector, b.vector);
  return vectors.map(vector => ({ origin, vector }));
};
/**
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {number} the number of faces, the number of lines will be n-1.
 */
const pleat = (count, a, b) => {
  const lineA = get_line(a);
  const lineB = get_line(b);
  return parallel(lineA.vector, lineB.vector)
    ? pleat_parallel(count, lineA, lineB)
    : pleat_angle(count, lineA, lineB);
};

const split_convex_polygon = (poly, lineVector, linePoint) => {
  // todo: should this return undefined if no intersection?
  //       or the original poly?

  //    point: intersection [x,y] point or null if no intersection
  // at_index: where in the polygon this occurs
  let vertices_intersections = poly.map((v, i) => {
    let intersection = overlap_line_point(lineVector, linePoint, v, include_l);
    return { point: intersection ? v : null, at_index: i };
  }).filter(el => el.point != null);
  let edges_intersections = poly.map((v, i, arr) => ({
      point: intersect_line_line(
        lineVector,
        linePoint,
        subtract(v, arr[(i + 1) % arr.length]),
        arr[(i + 1) % arr.length],
        exclude_l,
        exclude_s),
      at_index: i }))
    .filter(el => el.point != null);

  // three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
  if (edges_intersections.length == 2) {
    let sorted_edges = edges_intersections.slice()
      .sort((a,b) => a.at_index - b.at_index);

    let face_a = poly
      .slice(sorted_edges[1].at_index+1)
      .concat(poly.slice(0, sorted_edges[0].at_index+1));
    face_a.push(sorted_edges[0].point);
    face_a.push(sorted_edges[1].point);

    let face_b = poly
      .slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
    face_b.push(sorted_edges[1].point);
    face_b.push(sorted_edges[0].point);
    return [face_a, face_b];
  } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
    vertices_intersections[0]["type"] = "v";
    edges_intersections[0]["type"] = "e";
    let sorted_geom = vertices_intersections.concat(edges_intersections)
      .sort((a,b) => a.at_index - b.at_index);

    let face_a = poly.slice(sorted_geom[1].at_index+1)
      .concat(poly.slice(0, sorted_geom[0].at_index+1));
    if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
    face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

    let face_b = poly
      .slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
    if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
    face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
    return [face_a, face_b];
  } else if (vertices_intersections.length == 2) {
    let sorted_vertices = vertices_intersections.slice()
      .sort((a,b) => a.at_index - b.at_index);
    let face_a = poly
      .slice(sorted_vertices[1].at_index)
      .concat(poly.slice(0, sorted_vertices[0].at_index+1));
    let face_b = poly
      .slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
    return [face_a, face_b];
  }
  return [poly.slice()];
};

const convex_hull = (points, include_collinear = false, epsilon = EPSILON) => {
  // # points in the convex hull before escaping function
  let INFINITE_LOOP = 10000;
  // sort points by y. if ys are equivalent, sort by x
  let sorted = points.slice().sort((a, b) =>
    (Math.abs(a[1] - b[1]) < epsilon
      ? a[0] - b[0]
      : a[1] - b[1]));
  let hull = [];
  hull.push(sorted[0]);
  // the current direction the perimeter walker is facing
  let ang = 0;
  let infiniteLoop = 0;
  do {
    infiniteLoop += 1;
    let h = hull.length - 1;
    let angles = sorted
      // remove all points in the same location from this search
      .filter(el => !(Math.abs(el[0] - hull[h][0]) < epsilon
        && Math.abs(el[1] - hull[h][1]) < epsilon))
      // sort by angle, setting lowest values next to "ang"
      .map((el) => {
        let angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
        while (angle < ang) { angle += Math.PI * 2; }
        return { node: el, angle, distance: undefined };
      }) // distance to be set later
      .sort((a, b) => ((a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0));
    if (angles.length === 0) { return undefined; }
    // narrowest-most right turn
    let rightTurn = angles[0];
    // collect all other points that are collinear along the same ray
    angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
    // sort collinear points by their distances from the connecting point
      .map((el) => {
        let distance = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
        el.distance = distance;
        return el;
      })
    // (OPTION 1) exclude all collinear points along the hull
      .sort((a, b) => ((a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0));
    // (OPTION 2) include all collinear points along the hull
    // .sort(function(a,b) {return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
    // if the point is already in the convex hull, we've made a loop. we're done
    // if (contains(hull, angles[0].node)) {
    // if (includeCollinear) {
    //  points.sort(function(a,b) {return (a.distance - b.distance)});
    // } else{
    //  points.sort(function(a,b) {return b.distance - a.distance});
    // }

    if (hull.filter(el => el === angles[0].node).length > 0) {
      return hull;
    }
    // add point to hull, prepare to loop again
    hull.push(angles[0].node);
    // update walking direction with the angle to the new point
    ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
  } while (infiniteLoop < INFINITE_LOOP);
};
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
const recurse_skeleton = (points, lines, bisectors) => {
  // every point has an interior angle bisector vector, this ray is
  // tested for intersections with its neighbors on both sides.
  // "intersects" is fencepost mapped (i) to "points" (i, i+1)
  // because one point/ray intersects with both points on either side,
  // so in reverse, every point (i) relates to intersection (i-1, i)
  const intersects = points
    // .map((p, i) => math.ray(bisectors[i], p))
    // .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));
    .map((origin, i) => ({ vector: bisectors[i], origin }))
    .map((ray, i, arr) => intersect_line_line(
      ray.vector,
      ray.origin,
      arr[(i + 1) % arr.length].vector,
      arr[(i + 1) % arr.length].origin,
      exclude_r,
      exclude_r));
  // project each intersection point down perpendicular to the edge of the polygon
  // const projections = lines.map((line, i) => line.nearestPoint(intersects[i]));
  const projections = lines.map((line, i) => nearest_point_on_line(
    line.vector, line.origin, intersects[i], a => a));
  // when we reach only 3 points remaining, we are at the end. we can return early
  // and skip unnecessary calculations, all 3 projection lengths will be the same.
  if (points.length === 3) {
    return points.map(p => ({ type:"skeleton", points: [p, intersects[0]] }))
      .concat([{ type:"perpendicular", points: [projections[0], intersects[0]] }]);
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
    { type:"skeleton",
      points: [points[shortest], intersects[shortest]] },
    { type:"skeleton",
      points: [points[(shortest + 1) % points.length], intersects[shortest]] },
    // perpendicular projection
    // we could expand this algorithm here to include all three instead of just one.
    // two more of the entries in "intersects" will have the same length as shortest
    { type:"perpendicular", points: [projections[shortest], intersects[shortest]] }
    // ...projections.map(p => ({ type: "perpendicular", points: [p, intersects[shortest]] }))
  ];
  // our new smaller polygon, missing two points now, but gaining one more (the intersection)
  // this is to calculate the new angle bisector at this new point.
  // we are now operating on the inside of the polygon, the lines that will be built from
  // this bisection will become interior skeleton lines.
  // first, flip the first vector so that both of the vectors originate at the
  // center point, and extend towards the neighbors.
  const newVector = clockwise_bisect2(
    flip(lines[(shortest + lines.length - 1) % lines.length].vector),
    lines[(shortest + 1) % lines.length].vector
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
  return solutions.concat(recurse_skeleton(points, lines, bisectors));
};
/**
 * @param {number[][]} array of arrays of numbers (array of points), where
 *   each point is an array of numbers: [number, number].
 *
 * make sure:
 *  - your polygon is convex (todo: make this algorithm work with non-convex)
 *  - your polygon points are sorted counter-clockwise
 */
const straight_skeleton = (points) => {
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
      .map(i => ar[i]))
    // make 2 vectors, from current point to previous/next neighbors
    .map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
    // it is a little counter-intuitive but the interior angle between three
    // consecutive points in a counter-clockwise wound polygon is measured
    // in the clockwise direction
    .map(v => clockwise_bisect2(...v));
  // points is modified in place. create a copy
  // const points_clone = JSON.parse(JSON.stringify(points));
  // console.log("ss points", points_clone, points);
  return recurse_skeleton([...points], lines, bisectors);
};

var geometry = /*#__PURE__*/Object.freeze({
  __proto__: null,
  circumcircle: circumcircle,
  signed_area: signed_area,
  centroid: centroid,
  bounding_box: bounding_box,
  make_regular_polygon: make_regular_polygon,
  make_regular_polygon_side_aligned: make_regular_polygon_side_aligned,
  make_regular_polygon_inradius: make_regular_polygon_inradius,
  make_regular_polygon_inradius_side_aligned: make_regular_polygon_inradius_side_aligned,
  make_regular_polygon_side_length: make_regular_polygon_side_length,
  make_regular_polygon_side_length_side_aligned: make_regular_polygon_side_length_side_aligned,
  make_polygon_non_collinear: make_polygon_non_collinear,
  pleat: pleat,
  split_convex_polygon: split_convex_polygon,
  convex_hull: convex_hull,
  straight_skeleton: straight_skeleton
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
 */
const vector_origin_to_ud = ({ vector, origin }) => {
  const mag = magnitude(vector);
  const u = rotate90(vector);
  const d = dot(origin, u) / mag;
  return { u: scale(u, 1 / mag), d };

};
/**
 * @description convert a line from one parameterization into another.
 * convert u-d (normal, distance-to-origin) into vector-origin
 */
const ud_to_vector_origin = ({ u, d }) => ({
  vector: rotate270(u),
  origin: scale(u, d),
});

var parameterize = /*#__PURE__*/Object.freeze({
  __proto__: null,
  vector_origin_to_ud: vector_origin_to_ud,
  ud_to_vector_origin: ud_to_vector_origin
});

/**
 * Math (c) Kraft
 */

const acos_safe = (x) => {
  if (x >= 1.0) return 0;
  if (x <= -1.0) return Math.PI;
  return Math.acos(x);
};

const rotate_vector2 = (center, pt, a) => {
  const x = pt[0] - center[0];
  const y = pt[1] - center[1];
  const xRot = x * Math.cos(a) + y * Math.sin(a);
  const yRot = y * Math.cos(a) - x * Math.sin(a);
  return [center[0] + xRot, center[1] + yRot];
};

const intersect_circle_circle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
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
  const point = vec.map((v, i) => v / d * R + bgCenter[i]);
  // kissing circles
  if (Math.abs((R + r) - d) < epsilon
    || Math.abs(R - (r + d)) < epsilon) { return [point]; }
  // circles are contained
  if ((d + r) < R || (R + r < d)) { return undefined; }
  const angle = acos_safe((r * r - d * d - R * R) / (-2.0 * d * R));
  const pt1 = rotate_vector2(bgCenter, point, +angle);
  const pt2 = rotate_vector2(bgCenter, point, -angle);
  return [pt1, pt2];
};

/**
 * Math (c) Kraft
 */
/*
 * returns an array of array of numbers
 */
const intersect_circle_line = (
  circle_radius, circle_origin,
  line_vector, line_origin,
  line_func = include_l,
  epsilon = EPSILON
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
 */
const overlap_convex_polygon_point = (poly, point, func = exclude, epsilon = EPSILON) => poly
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

// todo, this is copied over in clip/polygon.js
const get_unique_pair = (intersections) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!equivalent_vector2(intersections[0], intersections[i])) {
      return [intersections[0], intersections[i]];
    }
  }
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const intersect_convex_polygon_line_inclusive = (
  poly,
  vector, origin,
  fn_poly = include_s,
  fn_line = include_l,
  epsilon = EPSILON
) => {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
    .map(side => intersect_line_line(
      subtract(side[1], side[0]), side[0],
      vector, origin,
      fn_poly, fn_line,
      epsilon))
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
      return get_unique_pair(intersections) || [intersections[0]];
  }
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 *
 * this doubles as the exclusive condition, and the main export since it
 * checks for exclusive/inclusive and can early-return
 */
const intersect_convex_polygon_line = (
  poly,
  vector, origin,
  fn_poly = include_s,
  fn_line = exclude_l,
  epsilon = EPSILON
) => {
  const sects = intersect_convex_polygon_line_inclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
  // const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
  let altFunc; // the opposite func, as far as inclusive/exclusive
  switch (fn_line) {
    // case exclude_l: altFunc = include_l; break;
    case exclude_r: altFunc = include_r; break;
    case exclude_s: altFunc = include_s; break;
    default: return sects;
  }
  // here on, we are only dealing with exclusive tests, parsing issues with
  // vertex-on intersections that still intersect or don't intersect the polygon.
  // repeat the computation but include intersections with the polygon's vertices.
  const includes = intersect_convex_polygon_line_inclusive(poly, vector, origin, include_s, altFunc, epsilon);
  // const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
  // if there are still no intersections, the line doesn't intersect.
  if (includes === undefined) { return undefined; }
  // if there are intersections, see if the line crosses the entire polygon
  // (gives us 2 unique points)
  const uniqueIncludes = get_unique_pair(includes);
  // first, deal with the case that there are no unique 2 points.
  if (uniqueIncludes === undefined) {
    switch (fn_line) {
      // if there is one intersection, an infinite line is intersecting the
      // polygon from the outside touching at just one vertex. this should be
      // considered undefined for the exclusive case.
      case exclude_l: return undefined;
      // if there is one intersection, check if a ray's origin is inside.
      // 1. if the origin is inside, consider the intersection valid
      // 2. if the origin is outside, same as the line case above. no intersection.
      case exclude_r:
        // is the ray origin inside?
        return overlap_convex_polygon_point(poly, origin, exclude, epsilon)
          ? includes
          : undefined;
      // if there is one intersection, check if either of a segment's points are
      // inside the polygon, same as the ray above. if neither are, consider
      // the intersection invalid for the exclusive case.
      case exclude_s:
        return overlap_convex_polygon_point(poly, add(origin, vector), exclude, epsilon)
          || overlap_convex_polygon_point(poly, origin, exclude, epsilon)
          ? includes
          : undefined;
    }
  }
  // now that we've covered all the other cases, we know that the line intersects
  // the polygon at two unique points. this should return true for all cases
  // except one: when the line is collinear to an edge of the polygon.
  // to test this, get the midpoint of the two intersects and do an exclusive
  // check if the midpoint is inside the polygon. if it is, the line is crossing
  // the polygon and the intersection is valid.
  return overlap_convex_polygon_point(poly, midpoint(...uniqueIncludes), exclude, epsilon)
    ? uniqueIncludes
    : sects;
};

/**
 * Math (c) Kraft
 */
/**
 * Sutherland-Hodgman polygon clipping
 * from Rosetta Code
 * refactored to use this library, and include an epsilon
 * 
 * the epsilon is hard-coded to be exclusive. two polygons sharing an
 * edge will return nothing
 *
 * polygons must be counter-clockwise!
 * will not work even if both are similarly clockwise.
 *
 * https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 */
const intersect_polygon_polygon = (polygon1, polygon2, epsilon = EPSILON) => {
	var cp1, cp2, s, e;
	const inside = (p) => {
		// console.log(p, "inside", ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
		// 	> ((cp2[1] - cp1[1]) * (p[0] - cp1[0])));
		return ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
			> ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon);
	};
	const intersection = () => {
		var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
			dp = [ s[0] - e[0], s[1] - e[1] ],
			n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
			n2 = s[0] * e[1] - s[1] * e[0], 
			n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
			// console.log("intersection res", [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3]);
		return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
	};
	var outputList = polygon1;
	cp1 = polygon2[polygon2.length-1];
	for (var j in polygon2) {
		cp2 = polygon2[j];
		var inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (var i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			}
			else if (inside(s)) {
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
    polygon: intersect_polygon_polygon,
    // circle: convex_poly_circle,
    line: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
  },
  circle: {
    // polygon: (a, b) => convex_poly_circle(b, a),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_circle(...a, ...b, ep),
    line: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
  },
  line: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
  },
  ray: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
  },
  segment: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
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
  line: exclude_l,
  ray: exclude_r,
  segment: exclude_s,
};

const intersect$1 = function (a, b, epsilon) {
  const type_a = type_of(a);
  const type_b = type_of(b);
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
 */
const overlap_convex_polygons = (poly1, poly2, epsilon = EPSILON) => {
  for (let p = 0; p < 2; p++) {
    // for non-overlapping convex polygons, it's possible that only only
    // one edge on one polygon holds the property of being a dividing axis.
    // we must run the algorithm on both polygons
    const polyA = p === 0 ? poly1 : poly2;
    const polyB = p === 0 ? poly2 : poly1;
    for (let i = 0; i < polyA.length; i++) {
      // each edge of polygonA will become a line
      const origin = polyA[i];
      const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
      // project each point from the other polygon on to the line's perpendicular
      // also, subtracting the origin (from the first poly) such that the
      // numberline is centered around zero. if the test passes, this polygon's
      // projections will be entirely above or below 0.
      const projected = polyB
        .map(p => subtract(p, origin))
        .map(v => dot(vector, v));
      // is the first polygon on the positive or negative side?
      const other_test_point = polyA[(i + 2) % polyA.length];
      const side_a = dot(vector, subtract(other_test_point, origin));
      const side = side_a > 0; // use 0. not epsilon
      // is the second polygon on whichever side of 0 that the first isn't?
      const one_sided = projected
        .map(dotProd => side ? dotProd < epsilon : dotProd > -epsilon)
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

const overlap_circle_point = (radius, origin, point, func = exclude, epsilon = EPSILON) =>
  func(radius - distance2(origin, point), epsilon);

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
*/

// export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;

const overlap_line_line = (
  aVector, aOrigin,
  bVector, bOrigin,
  aFunction = exclude_l,
  bFunction = exclude_l,
  epsilon = EPSILON
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
    polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygons(...a, ...b, ep),
    // circle: (a, b) => 
    // line: (a, b) =>
    // ray: (a, b) =>
    // segment: (a, b) =>
    vector: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...a, ...b, fnA, ep),
  },
  circle: {
    // polygon: (a, b) =>
    // circle: (a, b) =>
    // line: (a, b) =>
    // ray: (a, b) =>
    // segment: (a, b) =>
    vector: (a, b, fnA, fnB, ep) => overlap_circle_point(...a, ...b, exclude, ep),
  },
  line: {
    // polygon: (a, b) =>
    // circle: (a, b) =>
    line: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
  },
  ray: {
    // polygon: (a, b) =>
    // circle: (a, b) =>
    line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
  },
  segment: {
    // polygon: (a, b) =>
    // circle: (a, b) =>
    line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
  },
  vector: {
    polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...b, ...a, fnB, ep),
    circle: (a, b, fnA, fnB, ep) => overlap_circle_point(...b, ...a, exclude, ep),
    line: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
    vector: (a, b, fnA, fnB, ep) => equivalent_vector2(...a, ...b, ep),
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
  line: exclude_l,
  ray: exclude_r,
  segment: exclude_s,
  vector: exclude_l, // not used
};

const overlap$1 = function (a, b, epsilon) {
  const type_a = type_of(a);
  const type_b = type_of(b);
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
 * is one polygon (inner) completely enclosed by another (outer)
 */
const enclose_convex_polygons_inclusive = (outer, inner) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => overlap_convex_polygon_point(inner, p, include))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => overlap_convex_polygon_point(inner, p, include))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};

/**
 * Math (c) Kraft
 */
/**
 * @description point1 and point2 define the segment
 * @param {object} box1, the result of calling "bounding_box()"
 */
const overlap_bounding_boxes = (box1, box2) => {
  const dimensions = box1.min.length > box2.min.length
    ? box2.min.length
    : box1.min.length;
  for (let d = 0; d < dimensions; d++) {
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

const line_line_parameter = (
  line_vector, line_origin,
  poly_vector, poly_origin,
  poly_line_func = include_s,
  epsilon = EPSILON
) => {
  // a normalized determinant gives consistent values across all epsilon ranges
  const det_norm = cross2(normalize(line_vector), normalize(poly_vector));
  // lines are parallel
  if (Math.abs(det_norm) < epsilon) { return undefined; }
  const determinant0 = cross2(line_vector, poly_vector);
  const determinant1 = -determinant0;
  const a2b = subtract(poly_origin, line_origin);
  const b2a = flip(a2b);
  const t0 = cross2(a2b, poly_vector) / determinant0;
  const t1 = cross2(b2a, line_vector) / determinant1;
  if (poly_line_func(t1, epsilon / magnitude(poly_vector))) {
    return t0;
  }
  return undefined;
};

const line_point_from_parameter = (vector, origin, t) => add(origin, scale(vector, t));

// get all intersections with polgyon faces using the poly_line_func:
// - include_s or exclude_s
// sort them so we can grab the two most opposite intersections
const get_intersect_parameters = (poly, vector, origin, poly_line_func, epsilon) => poly
  // polygon into array of arrays [vector, origin]
  .map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
  .map(side => line_line_parameter(
    vector, origin,
    side[0], side[1],
    poly_line_func,
    epsilon))
  .filter(fn_not_undefined)
  .sort((a, b) => a - b);

// we have already done the test that numbers is a valid array
// and the length is >= 2
const get_min_max = (numbers, func, scaled_epsilon) => {
  let a = 0;
  let b = numbers.length - 1;
  while (a < b) {
    if (func(numbers[a+1] - numbers[a], scaled_epsilon)) { break; }
    a++;
  }
  while (b > a) {
    if (func(numbers[b] - numbers[b-1], scaled_epsilon)) { break; }
    b--;
  }
  if (a >= b) { return undefined; }
  return [numbers[a], numbers[b]];
};

const clip_line_in_convex_polygon = (
  poly,
  vector,
  origin,
  fn_poly = include,
  fn_line = include_l,
  epsilon = EPSILON
) => {
  const numbers = get_intersect_parameters(poly, vector, origin, include_s, epsilon);
  if (numbers.length < 2) { return undefined; }
  const scaled_epsilon = (epsilon * 2) / magnitude(vector);
  // ends is now an array, length 2, of the min and max parameter on the line
  // this also verifies the two intersections are not the same point
  const ends = get_min_max(numbers, fn_poly, scaled_epsilon);
  if (ends === undefined) { return undefined; }
  // ends_clip is the intersection between 2 domains, the result
  // and the valid inclusive/exclusive function
  // todo: this line hardcodes the parameterization that segments and rays are cropping
  // their lowest point at 0 and highest (if segment) at 1
  const ends_clip = ends.map((t, i) => fn_line(t) ? t : (t < 0.5 ? 0 : 1));
  // if endpoints are the same, exit
  if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
    return undefined;
  }
  // test if the solution is collinear to an edge by getting the segment midpoint
  // then test inclusive or exclusive depending on user parameter
  const mid = line_point_from_parameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
  return overlap_convex_polygon_point(poly, mid, fn_poly, epsilon)
    ? ends_clip.map(t => line_point_from_parameter(vector, origin, t))
    : undefined;
};

/**
 * Math (c) Kraft
 */

const VectorArgs = function () {
  this.push(...get_vector(arguments));
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
      return equivalent_vectors(this, get_vector(arguments));
    },
    isParallel: function () {
      return parallel(...resize_up(this, get_vector(arguments)));
    },
    isCollinear: function (line) {
      return overlap$1(this, line);
    },
    dot: function () {
      return dot(...resize_up(this, get_vector(arguments)));
    },
    distanceTo: function () {
      return distance(...resize_up(this, get_vector(arguments)));
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
        resize(3, get_vector(arguments))
      );
    },
    transform: function () {
      return multiply_matrix3_vector3(
        get_matrix_3x4(arguments),
        resize(3, this)
      );
    },
    add: function () {
      return add(this, resize(this.length, get_vector(arguments)));
    },
    subtract: function () {
      return subtract(this, resize(this.length, get_vector(arguments)));
    },
    // todo, can this be improved?
    rotateZ: function (angle, origin) {
      return multiply_matrix3_vector3(
        get_matrix_3x4(make_matrix2_rotate(angle, origin)),
        resize(3, this)
      );
    },
    lerp: function (vector, pct) {
      return lerp(this, resize(this.length, get_vector(vector)), pct);
    },
    midpoint: function () {
      return midpoint(...resize_up(this, get_vector(arguments)));
    },
    bisect: function () {
      return counter_clockwise_bisect2(this, get_vector(arguments));
    },
  }
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
  }
};

/**
 * Math (c) Kraft
 */

var Static = {
  fromPoints: function () {
    const points = get_vector_of_vectors(arguments);
    return this.constructor({
      vector: subtract(points[1], points[0]),
      origin: points[0],
    });
  },
  fromAngle: function() {
    const angle = arguments[0] || 0;
    return this.constructor({
      vector: [Math.cos(angle), Math.sin(angle)],
      origin: [0, 0],
    });
  },
  perpendicularBisector: function () {
    const points = get_vector_of_vectors(arguments);
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
    const arr = resize_up(this.vector, get_line(arguments).vector);
    return parallel(...arr);
  },
  isCollinear: function () {
    const line = get_line(arguments);
    return overlap_line_point(this.vector, this.origin, line.origin)
      && parallel(...resize_up(this.vector, line.vector));
  },
  isDegenerate: function (epsilon = EPSILON) {
    return degenerate(this.vector, epsilon);
  },
  reflectionMatrix: function () {
    return Constructors.matrix(make_matrix3_reflectZ(this.vector, this.origin));
  },
  nearestPoint: function () {
    const point = get_vector(arguments);
    return Constructors.vector(
      nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
    );
  },
  // this works with lines and rays, it should be overwritten for segments
  transform: function () {
    const dim = this.dimension;
    const r = multiply_matrix3_line3(
      get_matrix_3x4(arguments),
      resize(3, this.vector),
      resize(3, this.origin)
    );
    return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
  },
  translate: function () {
    const origin = add(...resize_up(this.origin, get_vector(arguments)));
    return this.constructor(this.vector, origin);
  },
  intersect: function () {
    return intersect$1(this, ...arguments);
  },
  overlap: function () {
    return overlap$1(this, ...arguments);
  },
  bisect: function (lineType, epsilon) {
    const line = get_line(lineType);
    return bisect_lines2(this.vector, this.origin, line.vector, line.origin, epsilon)
      .map(line => this.constructor(line));
  },
};

/**
 * Math (c) Kraft
 */

var Line = {
  line: {
    P: Object.prototype,

    A: function () {
      const l = get_line(...arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
      const ud = vector_origin_to_ud({ vector: this.vector, origin: this.origin });
      this.u = ud.u;
      this.d = ud.d;
      Object.defineProperty(this, "domain_function", { writable: true, value: include_l });
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
      inclusive: function () { this.domain_function = include_l; return this; },
      exclusive: function () { this.domain_function = exclude_l; return this; },
      clip_function: dist => dist,
      svgPath: function (length = 20000) {
        const start = add(this.origin, scale(this.vector, -length / 2));
        const end = scale(this.vector, length);
        return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
      },
    }),

    S: Object.assign({
      ud: function() {
        return this.constructor(ud_to_vector_origin(arguments[0]));
      },
    }, Static)

  }
};

/**
 * Math (c) Kraft
 */

// LineProto.prototype.constructor = LineProto;

var Ray = {
  ray: {
    P: Object.prototype,

    A: function () {
      const ray = get_line(...arguments);
      this.vector = Constructors.vector(ray.vector);
      this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
      Object.defineProperty(this, "domain_function", { writable: true, value: include_r });
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
      inclusive: function () { this.domain_function = include_r; return this; },
      exclusive: function () { this.domain_function = exclude_r; return this; },
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
      clip_function: ray_limiter,
      svgPath: function (length = 10000) {
        const end = this.vector.scale(length);
        return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
      },

    }),

    S: Static

  }
};

/**
 * Math (c) Kraft
 */

var Segment = {
  segment: {
    P: Array.prototype,

    A: function () {
      const a = get_segment(...arguments);
      this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
      this.vector = Constructors.vector(subtract(this[1], this[0]));
      // the fast way, but i think we need the ability to call seg[0].x
      // this.push(a[0], a[1]);
      // this.vector = subtract(this[1], this[0]);
      this.origin = this[0];
      Object.defineProperty(this, "domain_function", { writable: true, value: include_s });
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
      inclusive: function () { this.domain_function = include_s; return this; },
      exclusive: function () { this.domain_function = exclude_s; return this; },
      clip_function: segment_limiter,
      transform: function (...innerArgs) {
        const dim = this.points[0].length;
        const mat = get_matrix_3x4(innerArgs);
        const transformed_points = this.points
          .map(point => resize(3, point))
          .map(point => multiply_matrix3_vector3(mat, point))
          .map(point => resize(dim, point));
        return Constructors.segment(transformed_points);
      },
      translate: function() {
        const translate = get_vector(arguments);
        const transformed_points = this.points
          .map(point => add(...resize_up(point, translate)));
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
      }
    }

  }
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
  const circle = get_circle(...arguments);
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
    cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc
  ];
};

const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
  let arcStart = arcStart_;
  if (arcStart < 0 && !isNaN(arcStart)) {
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
    fs
  };
};

const cln = n => clean_number(n, 4);

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) =>
  `A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`;

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
    return Constructors.vector(nearest_point_on_circle(
      this.radius,
      this.origin,
      get_vector(arguments)
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
        this.origin[1] + this.radius * Math.sin(angle)
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
  }

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
  }
};

/**
 * Math (c) Kraft
 */

var Circle = {
  circle: { A: CircleArgs, G: CircleGetters, M: CircleMethods, S: CircleStatic }
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
      const numbers = flatten_arrays(arguments).filter(a => !isNaN(a));
      const params = resize(5, numbers);
      this.rx = params[0];
      this.ry = params[1];
      this.origin = Constructors.vector(params[2], params[3]);
      this.spin = params[4];
      this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
      // const numbers = arr.filter(param => !isNaN(param));
      // const vectors = get_vector_of_vectors(arr);
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
      //     get_vector(arguments)
      //   ));
      // },
      // intersect: function (object) {
      //   return Intersect(this, object);
      // },
      svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
        const info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
        const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x2, info.y2);
        const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x3, info.y3);
        return `M${info.x1} ${info.y1}${arc1}${arc2}`;
      },
      points: function (count = 128) {
        return Array.from(Array(count))
          .map((_, i) => ((2 * Math.PI) / count) * i)
          .map(angle => pointOnEllipse(
            this.origin.x, this.origin.y,
            this.rx, this.ry,
            this.spin, angle
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
      }

    },

    S: {
      // static methods
      // fromPoints: function () {
      //   const points = get_vector_of_vectors(arguments);
      //   return Constructors.circle(points, distance2(points[0], points[1]));
      // }
    }
  }
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
  area: function () {
    return signed_area(this);
  },
  // midpoint: function () { return average(this); },
  centroid: function () {
    return Constructors.vector(centroid(this));
  },
  boundingBox: function () {
    return bounding_box(this);
  },
  // contains: function () {
  //   return overlap_convex_polygon_point(this, get_vector(arguments));
  // },
  straightSkeleton: function () {
    return straight_skeleton(this);
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
    const vec = get_vector(...arguments);
    const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
    return this.constructor.fromPoints(newPoints);
  },
  transform: function () {
    const m = get_matrix_3x4(...arguments);
    const newPoints = this
      .map(p => multiply_matrix3_vector3(m, resize(3, p)));
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
    const point = get_vector(...arguments);
    const result = nearest_point_on_polygon(this, point);
    return result === undefined
      ? undefined
      : Object.assign(result, { edge: this.sides[result.i] });
  },
  split: function () {
    const line = get_line(...arguments);
    // const split_func = this.isConvex ? split_convex_polygon : split_polygon;
    const split_func = split_convex_polygon;
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
    const fn_line = line_type.domain_function ? line_type.domain_function : include_l;
    const segment = clip_line_in_convex_polygon(this,
      line_type.vector,
      line_type.origin,
      this.domain_function,
      fn_line,
      epsilon);
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
  [r.x, r.y + r.height]
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
      const r = get_rect(...arguments);
      this.width = r.width;
      this.height = r.height;
      this.origin = Constructors.vector(r.x, r.y);
      this.push(...rectToPoints(this));
      Object.defineProperty(this, "domain_function", { writable: true, value: include });
    },
    G: {
      x: function () { return this.origin[0]; },
      y: function () { return this.origin[1]; },
      center: function () { return Constructors.vector(
        this.origin[0] + this.width / 2,
        this.origin[1] + this.height / 2,
      ); },
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
        const box = bounding_box(get_vector_of_vectors(arguments));
        return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
      }
    }
  }
};

/**
 * Math (c) Kraft
 */

var Polygon = {
  polygon: {
    P: Array.prototype,
    A: function () {
      this.push(...semi_flatten_arrays(arguments));
      // this.points = semi_flatten_arrays(arguments);
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
        return this.constructor(make_regular_polygon(...arguments));
      },
      convexHull: function () {
        return this.constructor(convex_hull(...arguments));
      },
    }
  }
};

/**
 * Math (c) Kraft
 */

var Polyline = {
  polyline: {
    P: Array.prototype,
    A: function () {
      this.push(...semi_flatten_arrays(arguments));
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
    }
  }
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
      get_matrix_3x4(arguments).forEach(m => this.push(m));
    },

    G: {
    },

    M: {
      copy: function () { return Constructors.matrix(...Array.from(this)); },
      set: function () {
        return array_assign(this, get_matrix_3x4(arguments));
      },
      isIdentity: function () { return is_identity3x4(this); },
      // todo: is this right, on the right hand side?
      multiply: function (mat) {
        return array_assign(this, multiply_matrices3(this, mat));
      },
      determinant: function () {
        return determinant3(this);
      },
      inverse: function () {
        return array_assign(this, invert_matrix3(this));
      },
      // todo: is this the right order (this, transform)?
      translate: function (x, y, z) {
        return array_assign(this,
          multiply_matrices3(this, make_matrix3_translate(x, y, z)));
      },
      rotateX: function (radians) {
        return array_assign(this,
          multiply_matrices3(this, make_matrix3_rotateX(radians)));
      },
      rotateY: function (radians) {
        return array_assign(this,
          multiply_matrices3(this, make_matrix3_rotateY(radians)));
      },
      rotateZ: function (radians) {
        return array_assign(this,
          multiply_matrices3(this, make_matrix3_rotateZ(radians)));
      },
      rotate: function (radians, vector, origin) {
        const transform = make_matrix3_rotate(radians, vector, origin);
        return array_assign(this, multiply_matrices3(this, transform));
      },
      scale: function (amount) {
        return array_assign(this,
          multiply_matrices3(this, make_matrix3_scale(amount)));
      },
      reflectZ: function (vector, origin) {
        const transform = make_matrix3_reflectZ(vector, origin);
        return array_assign(this, multiply_matrices3(this, transform));
      },
      // todo, do type checking
      transform: function (...innerArgs) {
        return Constructors.vector(
          multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs)))
        );
      },
      transformVector: function (vector) {
        return Constructors.vector(
          multiply_matrix3_vector3(this, resize(3, get_vector(vector)))
        );
      },
      transformLine: function (...innerArgs) {
        const l = get_line(innerArgs);
        return Constructors.line(multiply_matrix3_line3(this, l.vector, l.origin));
      },
    },

    S: {
    }
  }
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

const Definitions = Object.assign({},
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
const vector = function () { return create("vector", arguments); };
const line = function () { return create("line", arguments); };
const ray = function () { return create("ray", arguments); };
const segment = function () { return create("segment", arguments); };
const circle = function () { return create("circle", arguments); };
const ellipse = function () { return create("ellipse", arguments); };
const rect = function () { return create("rect", arguments); };
const polygon = function () { return create("polygon", arguments); };
const polyline = function () { return create("polyline", arguments); };
const matrix = function () { return create("matrix", arguments); };
// const junction = function () { return create("junction", arguments); };
// const plane = function () { return create("plane", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

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

const math = Constructors;

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

math.core = Object.assign(Object.create(null),
  constants,
  resizers,
  getters,
  functions,
  algebra,
  equal,
  sort$1,
  geometry,
  radial,
  // interpolation,
  matrix2,
  matrix3,
  nearest$1,
  parameterize,
  {
    enclose_convex_polygons_inclusive,
    intersect_convex_polygon_line,
    intersect_polygon_polygon,
    intersect_circle_circle,
    intersect_circle_line,
    intersect_line_line,
    overlap_convex_polygons,
    overlap_convex_polygon_point,
    overlap_bounding_boxes,
    overlap_line_line,
    overlap_line_point,
    clip_line_in_convex_polygon,
  }
);

math.typeof = type_of;
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
			: null)
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
		}
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
		}
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
		}
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
const fold_keys = {
	file: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_title",
		"file_description",
		"file_classes",
		"file_frames"
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
		"faces_faces"
	],
	orders: [
		"edgeOrders",
		"faceOrders"
	],
};
/**
 * top-level keys from a FOLD object in one flat array
 */
const keys = Object.freeze([]
	.concat(fold_keys.file)
	.concat(fold_keys.frame)
	.concat(fold_keys.graph)
	.concat(fold_keys.orders));
/**
 * top-level keys from a FOLD object used by this library,
 * not in the official spec. made when calling populate().
 */
const non_spec_keys = Object.freeze([
	"edges_vector",
	"vertices_sectors",
	"faces_sectors",
	"faces_matrix"
]);
/**
 * array of single characers, the values of an edge assignment
 */
const edges_assignment_values = Array.from("MmVvBbFfUu");

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
 * English conversion from the plural form of words to the singular
 */
const singularize = {
	vertices: "vertex",
	edges: "edge",
	faces: "face",
};
/**
 * English word for what each edge assignment stands for.
 * both upper and lowercase letter keys reference the word.
 */
const edges_assignment_names = {
	b: "boundary",
	m: "mountain",
	v: "valley",
	f: "flat",
	u: "unassigned"
};
edges_assignment_values.forEach(key => {
	edges_assignment_names[key.toUpperCase()] = edges_assignment_names[key];
});
/**
 * @description convert upper or lowercase edge assignments to lowercase.
 * because edge assignments can be lower or uppercase, this object
 * contains both cases as keys, where the values are only lowercase
 */
const edges_assignment_to_lowercase = {};
edges_assignment_values.forEach(key => {
	edges_assignment_to_lowercase[key] = key.toLowerCase();
});
const edges_assignment_degrees = {
	M: -180,
	m: -180,
	V: 180,
	v: 180,
	B: 0,
	b: 0,
	F: 0,
	f: 0,
	U: 0,
	u: 0
};
/**
 * @param {string} one edge assignment letter, any case: M V B F U
 * @returns {number} fold angle in degrees. M/V are assumed to be flat-folded.
 */
const edge_assignment_to_foldAngle = assignment =>
	edges_assignment_degrees[assignment] || 0;
/**
 * @param {number} fold angle in degrees.
 * @returns {string} one edge assignment letter: M V or U, no boundary detection.
 *
 * todo: what should be the behavior for 0, undefined, null?
 */
const edge_foldAngle_to_assignment = (a) => {
	if (a > 0) { return "V"; }
	if (a < 0) { return "M"; }
	// if (a === 0) { return "F"; }
	return "U";
};
const flat_angles = { 0: true, "-0": true, 180: true, "-180": true };
const edge_foldAngle_is_flat = angle => flat_angles[angle] === true;
/**
 * @description determine if an edges_foldAngle array contains only
 * flat-folded angles, strictly the set: 0, -180, or +180.
 * If a graph contains no "edges_foldAngle", implicitly the angles
 * are flat, and the method returns "true".
 * @returns {boolean} is the graph flat-foldable according to foldAngles.
 */
const edges_foldAngle_all_flat = ({ edges_foldAngle }) => {
	if (!edges_foldAngle) { return true; }
	for (let i = 0; i < edges_foldAngle.length; i++) {
		if (!flat_angles[edges_foldAngle[i]]) { return false; }
	}
	return true;
};
/**
 * @param {object} any object
 * @param {string} a suffix to match against the keys
 * @returns {string[]} array of keys that end with the string param
 */
const filter_keys_with_suffix = (graph, suffix) => Object
	.keys(graph)
	.map(s => (s.substring(s.length - suffix.length, s.length) === suffix
		? s : undefined))
	.filter(str => str !== undefined);
/**
 * @param {object} any object
 * @param {string} a prefix to match against the keys
 * @returns {string[]} array of keys that start with the string param
 */
const filter_keys_with_prefix = (graph, prefix) => Object
	.keys(graph)
	.map(str => (str.substring(0, prefix.length) === prefix
		? str : undefined))
	.filter(str => str !== undefined);
/**
 * return a list of keys from a FOLD object that match a provided
 * string such that the key STARTS WITH this string followed by a _.
 *
 * for example: "vertices" will return:
 * vertices_coords, vertices_faces,
 * but not edges_vertices, or verticesCoords (must end with _)
 */
const get_graph_keys_with_prefix = (graph, key) =>
	filter_keys_with_prefix(graph, `${key}_`);
/**
 * return a list of keys from a FOLD object that match a provided
 * string such that the key ENDS WITH this string, preceded by _.
 *
 * for example: "vertices" will return:
 * edges_vertices, faces_vertices,
 * but not vertices_coords, or edgesvertices (must prefix with _)
 */
const get_graph_keys_with_suffix = (graph, key) =>
	filter_keys_with_suffix(graph, `_${key}`);

/**
 * this takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating 1 array of objects with the keys
 */
const transpose_graph_arrays = (graph, geometry_key) => {
	const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
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
 * this takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating 1 array of objects with the keys
 */
const transpose_graph_array_at_index = function (
	graph,
	geometry_key,
	index
) {
	const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
	if (matching_keys.length === 0) { return undefined; }
	const geometry = {};
	// matching_keys
	//   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
	//   .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
	matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
	return geometry;
};

const fold_object_certainty = (object = {}) => (
	Object.keys(object).length === 0
		? 0
		: [].concat(keys, non_spec_keys)
			.filter(key => object[key]).length / Object.keys(object).length);

var fold_spec = /*#__PURE__*/Object.freeze({
	__proto__: null,
	singularize: singularize,
	edges_assignment_names: edges_assignment_names,
	edges_assignment_to_lowercase: edges_assignment_to_lowercase,
	edges_assignment_degrees: edges_assignment_degrees,
	edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
	edge_foldAngle_to_assignment: edge_foldAngle_to_assignment,
	edge_foldAngle_is_flat: edge_foldAngle_is_flat,
	edges_foldAngle_all_flat: edges_foldAngle_all_flat,
	filter_keys_with_suffix: filter_keys_with_suffix,
	filter_keys_with_prefix: filter_keys_with_prefix,
	get_graph_keys_with_prefix: get_graph_keys_with_prefix,
	get_graph_keys_with_suffix: get_graph_keys_with_suffix,
	transpose_graph_arrays: transpose_graph_arrays,
	transpose_graph_array_at_index: transpose_graph_array_at_index,
	fold_object_certainty: fold_object_certainty
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
 * @returns {number[][]} array of array of numbers, each array is
 * an array of vertex indices.
 * if there are no duplicates, it returns [ [0], [1], [2], [3], [4], ... ]
 * if there are it looks like: [ [0, 2], [1], [3], [4, 5]]
 * if vertices_coords is not present, instead of undefined,
 *  it returns an empty array.
 */
// clusters is an array of arrays of numbers
// each entry in clusters is an array of vertex indices
const get_vertices_clusters = ({ vertices_coords }, epsilon = math.core.EPSILON) => {
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
				epsilon
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
 * This works even with custom component names, not "vertices", "edges", etc..
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in any vertex_ array but only exist as mentions in faces_vertices.
 * In that case, use the implied count method. "count_implied.js"
 * @param {object} a FOLD graph
 * @param {string} the prefix for a key, eg: "vertices" 
 * @returns {number} the number of vertices, edges, or faces in the graph.
 */
const count = (graph, key) => max_arrays_length(...get_graph_keys_with_prefix(graph, key).map(key => graph[key]));

// standard graph components names
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) =>
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices);
count.edges = ({ edges_vertices, edges_edges, edges_faces }) =>
	max_arrays_length(edges_vertices, edges_edges, edges_faces);
count.faces = ({ faces_vertices, faces_edges, faces_faces }) =>
	max_arrays_length(faces_vertices, faces_edges, faces_faces);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a list of integers (can contain duplicates),
 * this will return a sorted set of unique integers (removing duplicates).
 * @param {number[]} array of integers
 * @returns {number[]} set of sorted, unique integers
 */
const unique_sorted_integers = (array) => {
	const keys = {};
	array.forEach((int) => { keys[int] = true; });
	return Object.keys(keys).map(n => parseInt(n)).sort((a, b) => a - b);
};
/**
 * @description a circular array (data wraps around) needs 2 indices to be split.
 * "indices" will be sorted, smaller index first.
 * @param {any[]} an array that is meant to be thought of as circular
 * @param {number[]} two numbers, indices that divide the array into 2 parts.
 * @returns {any[][]} the same array split into two portions, inside an array.
 */
const split_circular_array = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1)
	];
};
/**
 * @description this will iterate over the array of arrays and returning
 * the first array in the list with the longest length.
 * @param {any[][]} this is an array of arrays.
 * @return {any[]} one of the arrays from the set
 */
const get_longest_array = (arrays) => {
	if (arrays.length === 1) { return arrays[0]; }
	const lengths = arrays.map(arr => arr.length);
	let max = 0;
	for (let i = 0; i < arrays.length; i++) {
		if (lengths[i] > lengths[max]) {
			max = i;
		}
	}
	return arrays[max];
};
/**
 * @description given an array of any-type, return the same array but filter
 * out any items which only appear once.
 * @param {any[]} array of primitives which can become strings in an object.
 * the intended use case is an array of {number[]}.
 * @returns {any[]} input array, filtering out any items which only appear once.
 */
const remove_single_instances = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n]++;
	});
	return array.filter(n => count[n] > 1);
};
/**
 * @description convert a non-sparse matrix of true/false/undefined
 * into arrays containing the index of the trues.
 */
const boolean_matrix_to_indexed_array = matrix => matrix
	.map(row => row
		.map((value, i) => value === true ? i : undefined)
		.filter(a => a !== undefined));
/**
 * triangle number, only visit half the indices. make unique pairs
 */
const boolean_matrix_to_unique_index_pairs = matrix => {
	const pairs = [];
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
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
 * inner arrays relate to the outer structure, create collection groups
 * where each item is included in a group if it points to another member
 * in that group.
 */
const make_unique_sets_from_self_relational_arrays = (matrix) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		matrix[index].forEach(i => recurse(i, current_group));
		return 1; // increment group # for next round
	};
	for (let row = 0, group = 0; row < matrix.length; row++) {
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
const make_triangle_pairs = (array) => {
	const pairs = Array((array.length * (array.length - 1)) / 2);
	let index = 0;
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = i + 1; j < array.length; j++, index++) {
			pairs[index] = [array[i], array[j]];
		}
	}
	return pairs;
};
/**
 * @description given an array containing undefineds, gather all contiguous
 * series of valid entries, and return the list of their indices in the form
 * of [start_index, final_index].
 * For example [0, 1, undefined, 2, 3, 4, undefined, undefined, 5]
 * will return two entries: [ [8, 1], [3, 5] ]
 * @param {any[]} the array, which possibly contains holes
 */
const circular_array_valid_ranges = (array) => {
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
	let index = not_undefineds[0] && not_undefineds[array.length-1]
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
// const circular_array_valid_range = (array, array_length) => {
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

// this is now "invert_simple_map" in maps.js
// export const invert_array = (a) => {
// 	const b = [];
// 	a.forEach((n, i) => { b[n] = i; });
// 	return b;
// };

//export const invert_array = (a) => {
//  const b = [];
//  a.forEach((x, i) => {
//		if (typeof x === "number") { b[x] = i; }
//	});
//  return b;
//};

var arrays = /*#__PURE__*/Object.freeze({
	__proto__: null,
	unique_sorted_integers: unique_sorted_integers,
	split_circular_array: split_circular_array,
	get_longest_array: get_longest_array,
	remove_single_instances: remove_single_instances,
	boolean_matrix_to_indexed_array: boolean_matrix_to_indexed_array,
	boolean_matrix_to_unique_index_pairs: boolean_matrix_to_unique_index_pairs,
	make_unique_sets_from_self_relational_arrays: make_unique_sets_from_self_relational_arrays,
	make_triangle_pairs: make_triangle_pairs,
	circular_array_valid_ranges: circular_array_valid_ranges
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * Removes vertices, edges, or faces (or anything really)
 * remove elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 *
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 *
 * @param {object} a FOLD object
 * @param {string} like "vertices", the prefix of the arrays
 * @param {number[]} an array of vertex indices, like [1,9,25]
 * @returns {number[]} an array resembling something like [0,0,-1,-1,-1,-2,-2,-2]
 *   indicating the relative shift of the position of each index in the array.
 * @example remove(foldObject, "vertices", [2,6,11,15]);
 */
// given removeIndices: [4, 6, 7];
// given a geometry array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// map becomes (_=undefined): [0, 1, 2, 3, _, 4, _, _, 5, 6];
const remove_geometry_indices = (graph, key, removeIndices) => {
	const geometry_array_size = count(graph, key);
	const removes = unique_sorted_integers(removeIndices);
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
	get_graph_keys_with_suffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, i) => graph[sKey][i]
				.forEach((v, j) => { graph[sKey][i][j] = index_map[v]; })));
	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays do change their size, their contents are untouched
	removes.reverse();
	get_graph_keys_with_prefix(graph, key)
		.forEach((prefix_key) => removes
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * Replaces vertices, edges, or faces (or anything really)
 * replace elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 *
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 *
 * @param {object} a FOLD object
 * @param {string} like "vertices", the prefix of the arrays
 * @param {number[]} an array of vertex indices, like [1,9,25]
 * @returns {number[]} an array resembling something like [0,0,-1,-1,-1,-2,-2,-2]
 *   indicating the relative shift of the position of each index in the array.
 * @example replace(foldObject, "vertices", [2,6,11,15]);
 */
// replaceIndices: [4:3, 7:5, 8:3, 12:3, 14:9] where keys are indices to remove
const replace_geometry_indices = (graph, key, replaceIndices) => {
	const geometry_array_size = count(graph, key);
	const removes = Object.keys(replaceIndices).map(n => parseInt(n));
	const replaces = unique_sorted_integers(removes);
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
	get_graph_keys_with_suffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, i) => graph[sKey][i]
				.forEach((v, j) => { graph[sKey][i][j] = index_map[v]; })));
	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays do change their size, their contents are untouched
	replaces.reverse();
	get_graph_keys_with_prefix(graph, key)
		.forEach((prefix_key) => replaces
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};

/**
 * Rabbit Ear (c) Kraft
 */

const get_duplicate_vertices = (graph, epsilon) => {
	return get_vertices_clusters(graph, epsilon)
		.filter(arr => arr.length > 1);
};

const get_edge_isolated_vertices = ({ vertices_coords, edges_vertices }) => {
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

const get_face_isolated_vertices = ({ vertices_coords, faces_vertices }) => {
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
const get_isolated_vertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
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
 * @description remove any vertices which are not a part of any edge or
 * face. This will shift up the remaining vertices indices so that the
 * vertices arrays will not have any holes, and, additionally it searches
 * through all _vertices reference arrays and updates the index
 * references for the shifted vertices.
 * @param {object} a FOLD graph
 * @param {number[]} optional. the result of get_isolated_vertices. 
 */
const remove_isolated_vertices = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = get_isolated_vertices(graph);
	}
	return {
		map: remove_geometry_indices(graph, _vertices, remove_indices),
		remove: remove_indices,
	};
};

// todo
// export const remove_collinear_vertices = (graph, epsilon = math.core.EPSILON) => {
// };

/**
 * @description this will shrink the number of vertices in the graph,
 * if vertices are too close it will keep the first one, find the geometric
 * average of all merging points, and set the one vertex's vertices_coords.
 * 
 * this has the potential to create circular and duplicate edges
 */
const remove_duplicate_vertices = (graph, epsilon = math.core.EPSILON) => {
	// replaces array will be [index:value] index is the element to delete,
	// value is the index this element will be replaced by.
	const replace_indices = [];
	// "remove" is only needed for the return value summary.
	const remove_indices = [];
	// clusters is array of indices, for example: [ [4, 13, 7], [0, 9] ]
	const clusters = get_vertices_clusters(graph, epsilon)
		.filter(arr => arr.length > 1);
	// for each cluster of n, all indices from [1...n] will be replaced with [0]
	clusters.forEach(cluster => {
		for (let i = 1; i < cluster.length; i++) {
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
		map: replace_geometry_indices(graph, _vertices, replace_indices),
		remove: remove_indices,    
	}
};

// export const remove_duplicate_vertices_first = (graph, epsilon = math.core.EPSILON) => {
//   const clusters = get_vertices_clusters(graph, epsilon);
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
//   get_graph_keys_with_suffix(graph, S._vertices)
//     .forEach(sKey => graph[sKey]
//       .forEach((_, i) => graph[sKey][i]
//         .forEach((v, j) => { graph[sKey][i][j] = map[v]; })));
//   // for keys like "vertices_edges" or "vertices_vertices", we simply
//   // cannot carry them over, for example vertices_vertices are intended
//   // to be sorted clockwise. it's possible to write this out one day
//   // for all the special cases, but for now playing it safe.
//   get_graph_keys_with_prefix(graph, S._vertices)
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

var vertices_violations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get_duplicate_vertices: get_duplicate_vertices,
	get_edge_isolated_vertices: get_edge_isolated_vertices,
	get_face_isolated_vertices: get_face_isolated_vertices,
	get_isolated_vertices: get_isolated_vertices,
	remove_isolated_vertices: remove_isolated_vertices,
	remove_duplicate_vertices: remove_duplicate_vertices
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
 * @param {object} a FOLD graph
 * @param {string} the prefix for a key, eg: "vertices" 
 * @returns {number} the number of vertices, edges, or faces in the graph.
 */
const implied_count = (graph, key) => Math.max(
	// return the maximum value between (1/2):
	// 1. a found geometry in another geometry's array ("vertex" in "faces_vertices")
	array_in_array_max_number(
		get_graph_keys_with_suffix(graph, key).map(str => graph[str])
	),
	// 2. a found geometry in a faceOrders or edgeOrders type of array (special case)
	graph[ordersArrayNames[key]]
		? max_num_in_orders(graph[ordersArrayNames[key]])
		: -1,
) + 1;

// standard graph components names
implied_count.vertices = graph => implied_count(graph, _vertices);
implied_count.edges = graph => implied_count(graph, _edges);
implied_count.faces = graph => implied_count(graph, _faces);

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description discover a face by walking neighboring vertices until returning to the start.
 * @param {object} FOLD graph
 * @param {number} starting vertex
 * @param {number} second vertex, this sets the direction of the walk
 * @param {object} to prevent walking down duplicate paths, or finding duplicate
 * faces, this dictionary will store and check against vertex pairs "i j".
 */
const counter_clockwise_walk = ({ vertices_vertices, vertices_sectors }, v0, v1, walked_edges = {}) => {
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

const planar_vertex_walk = ({ vertices_vertices, vertices_sectors }) => {
	const graph = { vertices_vertices, vertices_sectors };
	const walked_edges = {};
	return vertices_vertices
		.map((adj_verts, v) => adj_verts
			.map(adj_vert => counter_clockwise_walk(graph, v, adj_vert, walked_edges))
			.filter(a => a !== undefined))
		.reduce((a, b) => a.concat(b), [])
};
/**
 * @description 180 - sector angle = the turn angle. counter clockwise
 * turns are +, clockwise will be -, this removes the one face that
 * outlines the piece with opposite winding enclosing Infinity.
 * @param {object} walked_faces, the result from calling "planar_vertex_walk"
 */
const filter_walked_boundary_face = walked_faces => walked_faces
	.filter(face => face.angles
		.map(a => Math.PI - a)
		.reduce((a,b) => a + b, 0) > 0);

var walk = /*#__PURE__*/Object.freeze({
	__proto__: null,
	counter_clockwise_walk: counter_clockwise_walk,
	planar_vertex_walk: planar_vertex_walk,
	filter_walked_boundary_face: filter_walked_boundary_face
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {object} FOLD graph
 * @param {number[]} an array of vertex indices to be sorted
 * @param {number} the origin vertex, around which the vertices will be sorted
 * @returns {number[]} indices of vertices, in sorted order
 */
const sort_vertices_counter_clockwise = ({ vertices_coords }, vertices, vertex) =>
	vertices
		.map(v => vertices_coords[v])
		.map(coord => math.core.subtract(coord, vertices_coords[vertex]))
		.map(vec => Math.atan2(vec[1], vec[0]))
		// optional line, this makes the cycle loop start/end along the +X axis
		.map(angle => angle > -math.core.EPSILON ? angle : angle + Math.PI * 2)
		.map((a, i) => ({a, i}))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.map(i => vertices[i]);
/**
 * @description sort a subset of vertices from a graph along a vector.
 * eg: given the vector [1,0], points according to their X value.
 * @param {object} FOLD object
 * @param {number[]} the indices of vertices to be sorted
 * @param {number[]} a vector along which to sort vertices
 * @returns {number[]} indices of vertices, in sorted order
 */
const sort_vertices_along_vector = ({ vertices_coords }, vertices, vector) =>
	vertices
		.map(i => ({ i, d: math.core.dot(vertices_coords[i], vector) }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i);

var sort = /*#__PURE__*/Object.freeze({
	__proto__: null,
	sort_vertices_counter_clockwise: sort_vertices_counter_clockwise,
	sort_vertices_along_vector: sort_vertices_along_vector
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
 *  graph.faces_faces = make_faces_faces(graph);
 */
/**
 *
 *    VERTICES
 *
 */
/**
 * @param {object} FOLD object, with entry "edges_vertices"
 * @returns {number[][]} array of array of numbers. each index is a vertex with
 *   the content an array of numbers, edge indices this vertex is adjacent.
 */
const make_vertices_edges_unsorted = ({ edges_vertices }) => {
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
 * @param {object} FOLD object, with entry "edges_vertices"
 * @returns {number[][]} array of array of numbers. each index is a vertex with
 *   the content an array of numbers, edge indices this vertex is adjacent.
 *
 * this one corresponds to vertices_vertices!
 */
const make_vertices_edges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
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
const make_vertices_vertices = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
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
			.map((verts, i) => sort_vertices_counter_clockwise({ vertices_coords }, verts, i));
};
/**
 * this DOES NOT arrange faces in counter-clockwise order, as the spec suggests
 * use make_vertices_faces for that, which requires vertices_vertices.
 */
const make_vertices_faces_unsorted = ({ vertices_coords, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like vertices_coords)
	const vertices_faces = vertices_coords !== undefined
		? vertices_coords.map(() => [])
		: Array.from(Array(implied_count.vertices({ faces_vertices }))).map(() => []);
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
 * this does arrange faces in counter-clockwise order, as the spec suggests
 */
const make_vertices_faces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return make_vertices_faces_unsorted({ vertices_coords, faces_vertices });
	}
	const face_map = make_vertices_to_face({ faces_vertices });
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
const make_vertices_to_edge_bidirectional = ({ edges_vertices }) => {
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
 * same as above. but this method doesn't duplicate "9 3" and "3 9" it
 * only represents the edge in the direction it's stored. this is useful
 * for example for looking up the edge's vector, which is direction specific.
 */
const make_vertices_to_edge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
const make_vertices_to_face = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(i => face[i])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};

// this can someday be rewritten without edges_vertices
const make_vertices_vertices_vector = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	const edge_map = make_vertices_to_edge({ edges_vertices });
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
 * between counter-clockwise adjacent edges around a vertex, there lies
 * sectors, the interior angle space between edges.
 * this builds a list of sector angles in radians, index matched
 * to vertices_vertices.
 */
const make_vertices_sectors = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) =>
	make_vertices_vertices_vector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
		.map(vectors => vectors.length === 1 // leaf node
			? [math.core.TWO_PI] // interior_angles gives 0 for leaf nodes. we want 2pi
			: math.core.counter_clockwise_sectors2(vectors));
/**
 *
 *    EDGES
 *
 */
// export const make_edges_vertices = ({ faces_vertices }) => { };
/**
 * @param {object} FOLD object, with entries "edges_vertices", "vertices_edges".
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 *   of other edges that are vertex-adjacent.
 * @description edges_edges are vertex-adjacent edges. make sure to call
 *   make_vertices_edges_unsorted before calling this.
 */
const make_edges_edges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
	// if (!edges_vertices || !vertices_edges) { return undefined; }

const make_edges_faces_unsorted = ({ edges_vertices, faces_edges }) => {
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like edges_vertices)
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(implied_count.edges({ faces_edges }))).map(() => []);
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

const make_edges_faces = ({ vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center }) => {
	if (!edges_vertices) {
		return make_edges_faces_unsorted({ faces_edges });
	}
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = make_faces_center({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(ev => []);
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

const assignment_angles = { M: -180, m: -180, V: 180, v: 180 };

const make_edges_foldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);

const make_edges_assignment = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		// todo, consider finding the boundary
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});

const make_edges_coords = ({ vertices_coords, edges_vertices }) =>
	edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
/**
 * @param {object} FOLD object, with "vertices_coords", "edges_vertices"
 * @returns {number[]} a vector beginning at vertex 0, ending at vertex 1
 */
const make_edges_vector = ({ vertices_coords, edges_vertices }) =>
	make_edges_coords({ vertices_coords, edges_vertices })
		.map(verts => math.core.subtract(verts[1], verts[0]));
/**
 * @param {object} FOLD object, with "vertices_coords", "edges_vertices"
 * @returns {number[]} the Euclidean distance between each edge's vertices.
 */
const make_edges_length = ({ vertices_coords, edges_vertices }) =>
	make_edges_vector({ vertices_coords, edges_vertices })
		.map(vec => math.core.magnitude(vec));
/**
 * @description for each edge, get the bounding box in n-dimensions.
 * for fast line-sweep algorithms.
 *
 * @returns {object[]} an array of boxes matching length of edges.
 */
const make_edges_bounding_box = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = make_edges_coords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => math.core.bounding_box(coords, epsilon))
};
/**
 *
 *    FACES
 *
 */
const make_planar_faces = ({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector }) => {
	if (!vertices_vertices) {
		vertices_vertices = make_vertices_vertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = make_vertices_sectors({ vertices_coords, vertices_vertices, edges_vertices, edges_vector });
	}
	const vertices_edges_map = make_vertices_to_edge_bidirectional({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// planar_vertex_walk stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	return filter_walked_boundary_face(
			planar_vertex_walk({ vertices_vertices, vertices_sectors }))
		.map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
};

// without sector detection, this could be simplified so much that it only uses vertices_vertices.
const make_planar_faces_vertices = graph => make_planar_faces(graph)
	.map(face => face.vertices);

const make_planar_faces_edges = graph => make_planar_faces(graph)
	.map(face => face.edges);
// todo: this needs to be tested
const make_faces_vertices_from_edges = (graph) => {
	return graph.faces_edges
		.map(edges => edges
			.map(edge => graph.edges_vertices[edge])
			.map((pairs, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (pairs[0] === next[0] || pairs[0] === next[1])
					? pairs[1]
					: pairs[0];
			}));
};
const make_faces_edges_from_vertices = (graph) => {
	const map = make_vertices_to_edge_bidirectional(graph);
	return graph.faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
/**
 * @param {object} FOLD object, with entry "faces_vertices"
 * @returns {number[][]} each index relates to a face, each entry is an array
 * of numbers, each number is an index of an edge-adjacent face to this face.
 * @description faces_faces is a list of edge-adjacent face indices for each face.
 */
const make_faces_faces = ({ faces_vertices }) => {
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
			faces_faces[pair[0]].push(parseInt(pair[1]));
			faces_faces[pair[1]].push(parseInt(pair[0]));
		});
	return faces_faces;
};
// export const make_faces_faces = ({ faces_vertices }) => {
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
 */
const make_faces_polygon = ({ vertices_coords, faces_vertices }, epsilon) =>
	faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map(polygon => math.core.make_polygon_non_collinear(polygon, epsilon));
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points.
 */
const make_faces_polygon_quick = ({ vertices_coords, faces_vertices }) =>
	faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
/**
 * @description for every face, get one point that is the face's centroid.
 */
const make_faces_center = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => math.core.centroid(coords));
/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 */
const make_faces_center_quick = ({ vertices_coords, faces_vertices }) =>
	faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v])
			.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
			.map(el => el / vertices.length));

var make = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_vertices_edges_unsorted: make_vertices_edges_unsorted,
	make_vertices_edges: make_vertices_edges,
	make_vertices_vertices: make_vertices_vertices,
	make_vertices_faces_unsorted: make_vertices_faces_unsorted,
	make_vertices_faces: make_vertices_faces,
	make_vertices_to_edge_bidirectional: make_vertices_to_edge_bidirectional,
	make_vertices_to_edge: make_vertices_to_edge,
	make_vertices_to_face: make_vertices_to_face,
	make_vertices_vertices_vector: make_vertices_vertices_vector,
	make_vertices_sectors: make_vertices_sectors,
	make_edges_edges: make_edges_edges,
	make_edges_faces_unsorted: make_edges_faces_unsorted,
	make_edges_faces: make_edges_faces,
	make_edges_foldAngle: make_edges_foldAngle,
	make_edges_assignment: make_edges_assignment,
	make_edges_coords: make_edges_coords,
	make_edges_vector: make_edges_vector,
	make_edges_length: make_edges_length,
	make_edges_bounding_box: make_edges_bounding_box,
	make_planar_faces: make_planar_faces,
	make_planar_faces_vertices: make_planar_faces_vertices,
	make_planar_faces_edges: make_planar_faces_edges,
	make_faces_vertices_from_edges: make_faces_vertices_from_edges,
	make_faces_edges_from_vertices: make_faces_edges_from_vertices,
	make_faces_faces: make_faces_faces,
	make_faces_polygon: make_faces_polygon,
	make_faces_polygon_quick: make_faces_polygon_quick,
	make_faces_center: make_faces_center,
	make_faces_center_quick: make_faces_center_quick
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
 * @description get the indices of all circular edges. circular edges are
 * edges where both of its edges_vertices is the same vertex.
 * @param {object} a FOLD graph
 * @returns {number[]} array of indices of circular edges. empty array if none.
 */
const get_circular_edges = ({ edges_vertices }) => {
	const circular = [];
	for (let i = 0; i < edges_vertices.length; i += 1) {
		if (edges_vertices[i][0] === edges_vertices[i][1]) {
			circular.push(i);
		}
	}
	return circular;
};
/**
 * @description get the indices of all duplicate edges by marking the
 * second/third/... as duplicate (not the first of the duplicates).
 * The result is given as an array with holes, where:
 * - the indices are the indices of the duplicate edges.
 * - the values are the indices of the first occurence of the duplicate.
 * Under this system, many edges can be duplicates of the same edge.
 * Order is not important. [5,9] and [9,5] are still duplicate.
 * @param {object} a FOLD object
 * @returns {number[]} an array where the redundant edges are the indices,
 * and the values are the indices of the first occurence of the duplicate.
 * @example {number[]} array, [4:3, 7:5, 8:3, 12:3, 14:9] where indices
 * (3, 4, 8, 12) are all duplicates. (5,7), (9,14) are also duplicates.
 */
const get_duplicate_edges = ({ edges_vertices }) => {
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
 * @description given a set of graph geometry (vertices/edges/faces) indices,
 * get all the arrays which reference these geometries, (eg: end in _edges),
 * and remove (splice) that entry from the array if it contains a remove value
 * @example removing indices [4, 7] from "edges", then a faces_edges entry
 * which was [15, 13, 4, 9, 2] will become [15, 13, 9, 2].
 */
const splice_remove_values_from_suffixes = (graph, suffix, remove_indices) => {
	const remove_map = {};
	remove_indices.forEach(n => { remove_map[n] = true; });
	get_graph_keys_with_suffix(graph, suffix)
		.forEach(sKey => graph[sKey] // faces_edges or vertices_edges...
			.forEach((elem, i) => { // faces_edges[0], faces_edges[1], ...
				// reverse iterate through array, remove elements with splice
				for (let j = elem.length - 1; j >= 0; j--) {
					if (remove_map[elem[j]] === true) {
						graph[sKey][i].splice(j, 1);
					}
				}
			}));
};
const remove_circular_edges = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = get_circular_edges(graph);
	}
	if (remove_indices.length) {
		// remove every instance of a circular edge in every _edge array.
		// assumption is we can simply remove them because a face that includes
		// a circular edge is still the same face when you just remove the edge
		splice_remove_values_from_suffixes(graph, _edges, remove_indices);
		// console.warn("circular edge found. please rebuild");
		// todo: figure out which arrays need to be rebuilt, if it exists.
	}
	return {
		map: remove_geometry_indices(graph, _edges, remove_indices),
		remove: remove_indices,
	};
};
/**
 * @description if an edge is removed, it will mess up the vertices
 * data, so all of the vertices_ arrays will be rebuilt if this
 * method successfully found and removed a duplicate edge.
 */
const remove_duplicate_edges = (graph, replace_indices) => {
	// index: edge to remove, value: the edge which should replace it.
	if (!replace_indices) {
		replace_indices = get_duplicate_edges(graph);
	}
	const remove = Object.keys(replace_indices).map(n => parseInt(n));
	const map = replace_geometry_indices(graph, _edges, replace_indices);
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
			graph.vertices_edges = make_vertices_edges_unsorted(graph);
			graph.vertices_vertices = make_vertices_vertices(graph);
			graph.vertices_edges = make_vertices_edges(graph);
			graph.vertices_faces = make_vertices_faces(graph);
		}
	}
	return { map, remove };
};

var edges_violations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get_circular_edges: get_circular_edges,
	get_duplicate_edges: get_duplicate_edges,
	remove_circular_edges: remove_circular_edges,
	remove_duplicate_edges: remove_duplicate_edges
});

/**
 * Rabbit Ear (c) Kraft
 */

const merge_simple_nextmaps = (...maps) => {
	if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};

const merge_nextmaps = (...maps) => {
	if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx,j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a,b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};

const merge_simple_backmaps = (...maps) => {
	if (maps.length === 0) { return; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach((map, i) => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};

const merge_backmaps = (...maps) => {
	if (maps.length === 0) { return; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach((map, i) => {
		let next = [];
		map.forEach((el, j) => {
			if (typeof el === _number) { next[j] = solution[el]; }
			else { next[j] = el.map(n => solution[n]).reduce((a,b) => a.concat(b), []); }
		});
		solution = next;
	});
	return solution;
};

const invert_map = (map) => {
	const inv = [];
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === _number) { 
			// before we set the inverted map [i] spot, check if something is already there
			if (inv[n] !== undefined) {
				// if that thing is a number, turn it into an array
				if (typeof inv[n] === _number) { inv[n] = [inv[n], i]; }
				// already an array, add to it
				else { inv[n].push(i); }
			}
			else { inv[n] = i; }
		}
		if (n.constructor === Array) { n.forEach(m => { inv[m] = i; }); }	
	});
	return inv;
};

const invert_simple_map = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};

var maps = /*#__PURE__*/Object.freeze({
	__proto__: null,
	merge_simple_nextmaps: merge_simple_nextmaps,
	merge_nextmaps: merge_nextmaps,
	merge_simple_backmaps: merge_simple_backmaps,
	merge_backmaps: merge_backmaps,
	invert_map: invert_map,
	invert_simple_map: invert_simple_map
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description clean will remove bad graph data. this includes:
 * - duplicate (Euclidean distance) and isolated vertices
 * - circular and duplicate edges.
 * @param {object} FOLD object
 * @returns {object} summary of changes, a nextmap and the indices removed.
 */
const clean = (graph, epsilon) => {
	// duplicate vertices has to be done first as it's possible that
	// this will create circular/duplicate edges.
	const change_v1 = remove_duplicate_vertices(graph, epsilon);
	const change_e1 = remove_circular_edges(graph);
	const change_e2 = remove_duplicate_edges(graph);
	// isolated vertices is last. removing edges can create isolated vertices
	const change_v2 = remove_isolated_vertices(graph);
	// todo: it's possible that an edges_vertices now contains undefineds,
	// like [4, undefined]. but this should not be happening

	// return a summary of changes.
	// use the maps to update the removed indices from the second step
	// to their previous index before change 1 occurred.
	const change_v1_backmap = invert_simple_map(change_v1.map);
	const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
	const change_e1_backmap = invert_simple_map(change_e1.map);
	const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
	return {
		vertices: {
			map: merge_simple_nextmaps(change_v1.map, change_v2.map),
			remove: change_v1.remove.concat(change_v2_remove),
		},
		edges: {
			map: merge_simple_nextmaps(change_e1.map, change_e2.map),
			remove: change_e1.remove.concat(change_e2_remove),
		},
	}
};

/**
 * Rabbit Ear (c) Kraft
 */

// import get_vertices_edges_overlap from "./vertices_edges_overlap";

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
		vertices: implied_count.vertices(graph),
		edges: implied_count.edges(graph),
		faces: implied_count.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	}
};

const validate = (graph, epsilon) => {
	const duplicate_edges = get_duplicate_edges(graph);
	const circular_edges = get_circular_edges(graph);
	const isolated_vertices = get_isolated_vertices(graph);
	const duplicate_vertices = get_duplicate_vertices(graph, epsilon);
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
		}
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
 * "split_face" or "flat_fold", which expect a well-populated graph.
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
			graph.edges_foldAngle[i] = edge_assignment_to_foldAngle(graph.edges_assignment[i]);
		}
	}
	if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
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
		const faces = make_planar_faces(graph);
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
		graph.faces_edges = make_faces_edges_from_vertices(graph);
	} else if (graph.faces_edges && !graph.faces_vertices) {
		graph.faces_vertices = make_faces_vertices_from_edges(graph);
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
const populate = (graph, reface) => {
	if (typeof graph !== "object") { return graph; }
	if (!graph.edges_vertices) { return graph; }
	graph.vertices_edges = make_vertices_edges_unsorted(graph);
	graph.vertices_vertices = make_vertices_vertices(graph);
	graph.vertices_edges = make_vertices_edges(graph);
	// todo consider adding vertices_sectors, these are used for
	// planar graphs (crease patterns) for walking faces
	// todo, what is the reason to have edges_vector?
	// if (graph.vertices_coords) {
	//   graph.edges_vector = make_edges_vector(graph);
	// }
	// make sure "edges_foldAngle" and "edges_assignment" are done.
	build_assignments_if_needed(graph);
	// make sure "faces_vertices" and "faces_edges" are built.
	build_faces_if_needed(graph, reface);
	// depending on the presence of vertices_vertices, this will
	// run the simple algorithm (no radial sorting) or the proper one.
	graph.vertices_faces = make_vertices_faces(graph);
	graph.edges_faces = make_edges_faces_unsorted(graph);
	graph.faces_faces = make_faces_faces(graph);
	return graph;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * contains methods for fast-approximating if geometry overlaps.
 * for example testing if edge's rectangular bounding boxes overlap.
 *
 * @returns {number[][]} array matching edges_ length where each value is
 * an array matching vertices_ length, containing true/false, answering
 * the question "does this vertex sit inside the edge's bounding rectangle?"
 */
const get_edges_vertices_span = (graph, epsilon = math.core.EPSILON) =>
	make_edges_bounding_box(graph, epsilon)
		.map((min_max, e) => graph.vertices_coords
			.map((vert, v) => (
				vert[0] > min_max.min[0] - epsilon &&
				vert[1] > min_max.min[1] - epsilon &&
				vert[0] < min_max.max[0] + epsilon &&
				vert[1] < min_max.max[1] + epsilon)));
/**
 * part of an algorithm for segment-segment intersection
 * this answers if it's possible that lines *might* overlap
 * by testing if their rectangular bounding boxes overlap.
 *
 * @returns NxN 2d array filled with true/false answering "do edges overlap
 * in their rectangular bounding boxes?" 
 * both triangles of the matrix are filled with t/f. The main diagonal contains true.
 *     0  1  2  3
 * 0 [ t,  ,  ,  ]
 * 1 [  , t,  ,  ]
 * 2 [  ,  , t,  ]
 * 3 [  ,  ,  , t]
 */
const get_edges_edges_span = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = math.core.EPSILON) => {
	const min_max = make_edges_bounding_box({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	// span_overlaps will be false if no overlap possible, true if overlap is possible.
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			// if first max is less than second min, or second max is less than first min,
			// for both X and Y
			const outside_of = 
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
			&&(min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]);
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
	get_edges_vertices_span: get_edges_vertices_span,
	get_edges_edges_span: get_edges_edges_span
});

/**
 * Rabbit Ear (c) Kraft
 */

const get_opposite_vertices$1 = (graph, vertex, edges) => {
	edges.forEach(edge => {
		if (graph.edges_vertices[edge][0] === vertex
			&& graph.edges_vertices[edge][1] === vertex) {
			console.warn("remove_planar_vertex circular edge");
		}
	});
	return edges.map(edge => graph.edges_vertices[edge][0] === vertex
		? graph.edges_vertices[edge][1]
		: graph.edges_vertices[edge][0]);
};

/**
 * @description determine if a vertex is between only two edges and
 * those edges are parallel, rendering the vertex potentially unnecessary.
 */
const is_vertex_collinear = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	if (edges === undefined || edges.length !== 2) { return false; }
	// don't just check if they are parallel, use the direction of the vertex
	// to make sure the center vertex is inbetween, instead of the odd
	// case where the two edges are on top of one another with
	// a leaf-like vertex.
	const vertices = get_opposite_vertices$1(graph, vertex, edges);
	const vectors = [[vertices[0], vertex], [vertex, vertices[1]]]
		.map(verts => verts.map(v => graph.vertices_coords[v]))
		.map(segment => math.core.subtract(segment[1], segment[0]))
		.map(vector => math.core.normalize(vector));
	const is_parallel = math.core
		.equivalent_numbers(1.0, math.core.dot(...vectors));
	return is_parallel;
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
 * edges_collinear_vertices is a list of lists where for every edge there is a
 * list filled with vertices that lies collinear to the edge, where
 * collinearity only counts if the vertex lies between the edge's endpoints,
 * excluding the endpoints themselves.
 * 
 * @returns {number[][]} size matched to the edges_ arrays, with an empty array
 * unless a vertex lies collinear, the edge's array will contain that vertex's index.
 */
const get_vertices_edges_overlap = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = math.core.EPSILON) => {
	if (!edges_coords) {
		edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
	}
	const edges_span_vertices = get_edges_vertices_span({
		vertices_coords, edges_vertices, edges_coords
	}, epsilon);
	// todo, consider pushing values into a results array instead of modifying,
	// then filtering the existing one
	for (let e = 0; e < edges_coords.length; e += 1) {
		for (let v = 0; v < vertices_coords.length; v += 1) {
			if (!edges_span_vertices[e][v]) { continue; }
			edges_span_vertices[e][v] = math.core.overlap_line_point(
				math.core.subtract(edges_coords[e][1], edges_coords[e][0]),
				edges_coords[e][0],
				vertices_coords[v],
				math.core.exclude_s,
				epsilon
			);
		}
	}
	return edges_span_vertices
		.map(verts => verts
			.map((vert, i) => vert ? i : undefined)
			.filter(i => i !== undefined));
};

var vertices_collinear = /*#__PURE__*/Object.freeze({
	__proto__: null,
	is_vertex_collinear: is_vertex_collinear,
	get_vertices_edges_overlap: get_vertices_edges_overlap
});

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @param {object} a FOLD object
 * @param {number[]} vector. a line defined by a vector crossing a point
 * @param {number[]} point. a line defined by a vector crossing a point
 */
const make_edges_line_parallel_overlap = ({ vertices_coords, edges_vertices }, vector, point, epsilon = math.core.EPSILON) => {
	const normalized = math.core.normalize2(vector);
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(edge => math.core.subtract2(edge[1], edge[0]));
	// first, filter out edges which are not parallel
	const overlap = edges_vector
		.map(vec => math.core.parallel2(vec, vector, epsilon));
	// second, filter out edges which do not lie on top of the line
	for (let e = 0; e < edges_vertices.length; e++) {
		if (!overlap[e]) { continue; }
		if (math.core.equivalent_vector2(edges_origin[e], point)) {
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
 * @description return the indices of edges which overlap the segment
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array of edge indices which overlap the segment
 */
const make_edges_segment_intersection = ({ vertices_coords, edges_vertices, edges_coords }, point1, point2, epsilon = math.core.EPSILON) => {
	if (!edges_coords) {
		edges_coords = make_edges_coords({ vertices_coords, edges_vertices });
	}
	const segment_box = math.core.bounding_box([point1, point2], epsilon);
	const segment_vector = math.core.subtract2(point2, point1);
	// convert each edge into a bounding box, do bounding-box intersection
	// with the segment, filter these results, then run actual intersection
	// algorithm on this subset.
	return make_edges_bounding_box({ vertices_coords, edges_vertices, edges_coords }, epsilon)
		.map(box => math.core.overlap_bounding_boxes(segment_box, box))
		.map((overlap, i) => overlap ? (math.core.intersect_line_line(
			segment_vector,
			point1,
			math.core.subtract2(edges_coords[i][1], edges_coords[i][0]),
			edges_coords[i][0],
			math.core.include_s,
			math.core.include_s,
			epsilon)) : undefined);
};
/**
 * this method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 *
 * @param {object} FOLD graph. only requires { edges_vector, edges_origin }
 * if they don't exist this will build them from { vertices_coords, edges_vertices }
 *
 * @param {number} epsilon, optional
 *
 * @returns {number[][][]} NxN matrix comparing indices, undefined in the case of
 * no intersection, a point object in array form if yes, and this array is stored
 * in 2 PLACES! both [i][j] and [j][i], however it is stored by reference,
 * it is the same js object.
 *
 *     0  1  2  3
 * 0 [  , x,  ,  ]
 * 1 [ x,  ,  , x]
 * 2 [  ,  ,  ,  ]
 * 3 [  , x,  ,  ]
 */
const make_edges_edges_intersection = function ({
	vertices_coords, edges_vertices, edges_vector, edges_origin
}, epsilon = math.core.EPSILON) {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	if (!edges_origin) {
		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	}
	const edges_intersections = edges_vector.map(() => []);
	const span = get_edges_edges_span({ vertices_coords, edges_vertices }, epsilon);
	for (let i = 0; i < edges_vector.length - 1; i += 1) {
		for (let j = i + 1; j < edges_vector.length; j += 1) {
			if (span[i][j] !== true) {
				// this setter is unnecessary but otherwise the result is filled with
				// both undefined and holes. this makes it consistent
				edges_intersections[i][j] = undefined;
				continue;
			}
			edges_intersections[i][j] = math.core.intersect_line_line(
				edges_vector[i],
				edges_origin[i],
				edges_vector[j],
				edges_origin[j],
				math.core.exclude_s,
				math.core.exclude_s,
				epsilon
			);
			edges_intersections[j][i] = edges_intersections[i][j];
		}
	}
	return edges_intersections;
};
/**
 * @description intersect a CONVEX face with a line and return the location
 * of the intersections as components of the graph. this is an EXCLUSIVE
 * intersection. line collinear to the edge counts as no intersection.
 * there are 5 cases:
 * - no intersection (undefined)
 * - intersect one vertex (undefined)
 * - intersect two vertices (valid, or undefined if neighbors)
 * - intersect one vertex and one edge (valid)
 * - intersect two edges (valid)
 * @param {object} FOLD object
 * @param {number} the index of the face
 * @param {number[]} the vector component describing the line
 * @param {number[]} the point component describing the line
 * @param {number} epsilon, optional
 * @returns {object | undefined} "vertices" and "edges" keys, indices of the
 * components which intersect the line. or undefined if no intersection
 */
const intersect_convex_face_line = ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }, face, vector, point, epsilon = math.core.EPSILON) => {
	// give us back the indices in the faces_vertices[face] array
	// we can count on these being sorted (important later)
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => math.core.overlap_line_point(vector, point, coord, () => true, epsilon))
		.map((overlap, i) => overlap ? i : undefined)
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
		.map(seg => math.core.intersect_line_line(
			vector,
			point,
			math.core.subtract(seg[1], seg[0]),
			seg[0],
			math.core.include_l,
			math.core.exclude_s,
			epsilon
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
	make_edges_line_parallel_overlap: make_edges_line_parallel_overlap,
	make_edges_segment_intersection: make_edges_segment_intersection,
	make_edges_edges_intersection: make_edges_edges_intersection,
	intersect_convex_face_line: intersect_convex_face_line
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
	const edges_intersections = make_edges_edges_intersection({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_vector,
		edges_origin
	}, 1e-6);
	// check the new edges' vertices against every edge, in case
	// one of the endpoints lies along an edge.
	const edges_collinear_vertices = get_vertices_edges_overlap({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_coords
	}, epsilon);
	// exit early
	if (edges_intersections.flat().filter(a => a !== undefined).length === 0 &&
	edges_collinear_vertices.flat().filter(a => a !== undefined).length === 0) {
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
		graph.edges_vertices[i] = sort_vertices_along_vector({
			vertices_coords: graph.vertices_coords
		}, edge, edges_vector[i]);
	});

	// edge_map is length edges_vertices in the new, fragmented graph.
	// the value at each index is the edge that this edge was formed from.
	const edge_map = graph.edges_vertices
		.map((edge, i) => Array(edge.length - 1).fill(i))
		.flat();

	graph.edges_vertices = graph.edges_vertices
		.map(edge => Array.from(Array(edge.length - 1))
			.map((_, i, arr) => [edge[i], edge[i + 1]]))
		.flat();
	// copy over edge metadata if it exists
	// make foldAngles and assignments match if foldAngle is longer
	if (graph.edges_assignment && graph.edges_foldAngle
		&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
		}
	}
	// copy over assignments and fold angle and base fold angle off assigments if it's shorter
	if (graph.edges_assignment) {
		graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = edge_map
			.map(i => graph.edges_foldAngle[i])
			.map((a, i) => a === undefined
				? edge_assignment_to_foldAngle(graph.edges_assignment[i])
				: a);
	}
	return {
		vertices: {
			new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
				.map((_, i) => counts.vertices + i),
		},
		edges: {
			backmap: edge_map
		}
	};
	// return graph;
};

const fragment_keep_keys = [
	_vertices_coords,
	_edges_vertices,
	_edges_assignment,
	_edges_foldAngle,
];

const fragment = (graph, epsilon = math.core.EPSILON) => {
	// project all vertices onto the XY plane
	graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));

	[_vertices, _edges, _faces]
		.map(key => get_graph_keys_with_prefix(graph, key))
		.flat()
		.filter(key => !(fragment_keep_keys.includes(key)))
		.forEach(key => delete graph[key]);

	const change = {
		vertices: {},
		edges: {},
	};
	let i;
	for (i = 0; i < 20; i++) {
		const resVert = remove_duplicate_vertices(graph, epsilon / 2);
		const resEdgeDup = remove_duplicate_edges(graph);
		// console.log("before", JSON.parse(JSON.stringify(graph)));
		const resEdgeCirc = remove_circular_edges(graph);
		// console.log("circular", resEdgeCirc);
		const resFrag = fragment_graph(graph, epsilon);
		if (resFrag === undefined) { 
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: merge_nextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? merge_nextmaps(resEdgeDup.map, resEdgeCirc.map)
				: merge_nextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
			break;
		}
		const invert_frag = invert_map(resFrag.edges.backmap);
		const edgemap = merge_nextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
		change.vertices.map = (change.vertices.map === undefined
			? resVert.map
			: merge_nextmaps(change.vertices.map, resVert.map));
		change.edges.map = (change.edges.map === undefined
			? edgemap
			: merge_nextmaps(change.edges.map, edgemap));
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
 * @description add vertices to a graph by adding their vertices_coords only. This
 * will also compare against every existing vertex, only adding non-duplicate
 * vertices, as determined by an epsilon.
 * @param {object} FOLD graph, will be modified
 * @param {number[][]} vertices_coords, vertices to be added to the graph
 * @param {number} optional epsilon to compare if vertices are the same
 * @returns {array} index of vertex in new vertices_coords array.
 * the size of this array matches array size of source vertices.
 * duplicate (non-added) vertices returns their pre-existing counterpart's index.
 */
const add_vertices = (graph, vertices_coords, epsilon = math.core.EPSILON) => {
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
			.map((on_vertex, i) => on_vertex ? i : undefined)
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
		.map(el => el === undefined ? index++ : el);
};

/**
 * Rabbit Ear (c) Kraft
 */

const vef = [_vertices, _edges, _faces];

const make_vertices_map_and_consider_duplicates = (target, source, epsilon = math.core.EPSILON) => {
	let index = target.vertices_coords.length;
	return source.vertices_coords
		.map(vertex => target.vertices_coords
			.map(v => math.core.distance(v, vertex) < epsilon)
			.map((on_vertex, i) => on_vertex ? i : undefined)
			.filter(a => a !== undefined)
			.shift())
		.map(el => el === undefined ? index++ : el);
};

const get_edges_duplicate_from_source_in_target = (target, source) => {
	const source_duplicates = {};
	const target_map = {};
	for (let i = 0; i < target.edges_vertices.length; i += 1) {
		// we need to store both, but only need to test one
		target_map[`${target.edges_vertices[i][0]} ${target.edges_vertices[i][1]}`] = i;
		target_map[`${target.edges_vertices[i][1]} ${target.edges_vertices[i][0]}`] = i;
	}
	for (let i = 0; i < source.edges_vertices.length; i += 1) {
		const index = target_map[`${source.edges_vertices[i][0]} ${source.edges_vertices[i][1]}`];
		if (index !== undefined) {
			source_duplicates[i] = index;
		}
	}
	return source_duplicates;
};

/**
 * @param {object} FOLD graph
 * @param {string[]} array of strings like "vertices_edges"
 * @param {string[]} array of any combination of "vertices", "edges", or "faces"
 * @param {object} object with keys VEF each with an array of index maps
 */
const update_suffixes = (source, suffixes, keys, maps) => keys
	.forEach(geom => suffixes[geom]
		.forEach(key => source[key]
			.forEach((arr, i) => arr
				.forEach((el, j) => { source[key][i][j] = maps[geom][el]; }))));

// todo, make the second param ...sources
const assign = (target, source, epsilon = math.core.EPSILON) => {
	// these all relate to the source, not target
	const prefixes = {};
	const suffixes = {};
	const maps = {};
	// gather info
	vef.forEach(key => {
		prefixes[key] = get_graph_keys_with_prefix(source, key);
		suffixes[key] = get_graph_keys_with_suffix(source, key);
	});
	// if source keys don't exist in the target, create empty arrays
	vef.forEach(geom => prefixes[geom].filter(key => !target[key]).forEach(key => {
		target[key] = [];
	}));
	// vertex map
	maps.vertices = make_vertices_map_and_consider_duplicates(target, source, epsilon);
	// correct indices in all vertex suffixes, like "faces_vertices", "edges_vertices"
	update_suffixes(source, suffixes, [_vertices], maps);
	// edge map
	const target_edges_count = count.edges(target);
	maps.edges = Array.from(Array(count.edges(source)))
		.map((_, i) => target_edges_count + i);
	const edge_dups = get_edges_duplicate_from_source_in_target(target, source);
	Object.keys(edge_dups).forEach(i => { maps.edges[i] = edge_dups[i]; });
	// faces map
	const target_faces_count = count.faces(target);
	maps.faces = Array.from(Array(count.faces(source)))
		.map((_, i) => target_faces_count + i);
	// todo find duplicate faces, correct map
	// correct indices in all edges and faces suffixes
	update_suffixes(source, suffixes, [_edges, _faces], maps);
	// copy all geometry arrays from source to target
	vef.forEach(geom => prefixes[geom].forEach(key => source[key].forEach((el, i) => {
		const new_index = maps[geom][i];
		target[key][new_index] = el;
	})));
	return maps;
};

/**
 * Rabbit Ear (c) Kraft
 */
// maybe we can do this without copying the entire graph first. use the component arrays to bring over only what is necessary

// todo: this is still an early sketch. needs to be completed

const subgraph = (graph, components) => {
	const remove_indices = {};
	const sorted_components = {};
	[_faces, _edges, _vertices].forEach(key => {
		remove_indices[key] = Array.from(Array(count[key](graph))).map((_, i) => i);
		sorted_components[key] = unique_sorted_integers(components[key] || []).reverse();
	});
	Object.keys(sorted_components)
		.forEach(key => sorted_components[key]
			.forEach(i => remove_indices[key].splice(i, 1)));
	// const subgraph = clone(graph);
	Object.keys(remove_indices)
		.forEach(key => remove_geometry_indices(graph, key, remove_indices[key]));
	return graph;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description true false is a vertex on a boundary
 */
const get_boundary_vertices = ({ edges_vertices, edges_assignment }) => {
	const vertices = {};
	edges_vertices.forEach((v, i) => {
		const boundary = edges_assignment[i] === "B" || edges_assignment[i] === "b";
		if (!boundary) { return; }
		vertices[v[0]] = true;
		vertices[v[1]] = true;
	});
	return Object.keys(vertices).map(str => parseInt(str));
};
const empty_get_boundary = () => ({ vertices: [], edges: [] });
/**
 * @description get the boundary as two arrays of vertices and edges
 * by walking the boundary edges as defined by edges_assignment.
 * if edges_assignment contains errors (or doesn't exist) this will fail.
 * @param {object} a FOLD graph
 * @returns {object} "vertices" and "edges" with arrays of indices.
 */
const get_boundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (edges_assignment === undefined) { return empty_get_boundary(); }
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
	}
	const edges_vertices_b = edges_assignment
		.map(a => a === "B" || a === "b");
	const edge_walk = [];
	const vertex_walk = [];
	let edgeIndex = -1;
	for (let i = 0; i < edges_vertices_b.length; i += 1) {
		if (edges_vertices_b[i]) { edgeIndex = i; break; }
	}
	if (edgeIndex === -1) { return empty_get_boundary(); }
	edges_vertices_b[edgeIndex] = false;
	edge_walk.push(edgeIndex);
	vertex_walk.push(edges_vertices[edgeIndex][0]);
	let nextVertex = edges_vertices[edgeIndex][1];
	while (vertex_walk[0] !== nextVertex) {
		vertex_walk.push(nextVertex);
		edgeIndex = vertices_edges[nextVertex]
			.filter(v => edges_vertices_b[v])
			.shift();
		if (edgeIndex === undefined) { return empty_get_boundary(); }
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
 * @description get the boundary as two arrays of vertices and edges
 * by walking the boundary edges in 2D and uncovering the concave hull.
 * Does not consult edges_assignment, but does require vertices_coords.
 * For repairing crease patterns, this will uncover boundary edges_assignments.
 * @param {object} a FOLD graph
 *  (vertices_coords, vertices_vertices, edges_vertices)
 *  (vertices edges only required in case vertices_vertices needs to be built)
 * @returns {object} "vertices" and "edges" with arrays of indices.
 * @usage call populate() before to ensure this works.
 */
const get_planar_boundary = ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices }) => {
	if (!vertices_vertices) {
		vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });    
	}
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
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
	get_boundary_vertices: get_boundary_vertices,
	get_boundary: get_boundary,
	get_planar_boundary: get_planar_boundary
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description apply an affine transform to a graph; this includes
 * modifying the position of any key ending with "_coords" and multiplying
 * any matrix in keys that end with "_matrix".
 * @param {object} a FOLD graph
 * @param {number[]} 3x4 matrix as a 12 number array
 * @returns {object} the same input graph, modified
 */
const apply_matrix_to_graph = function (graph, matrix) {
	// apply to anything with a coordinate value
	filter_keys_with_suffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => math.core.resize(3, v))
			.map(v => math.core.multiply_matrix3_vector3(matrix, v));
	});
	// update all matrix types
	// todo, are these being multiplied in the right order?
	filter_keys_with_suffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => math.core.multiply_matrices3(m, matrix));
	});
	return graph;
};
/**
 * @description apply a uniform affine scale to a graph.
 * @param {object} a FOLD graph
 * @param {number} the scale amount
 * @param {number[]} optional. an array or series of numbers, the center of scale.
 * @returns {object} the same input graph, modified.
 */
const transform_scale = (graph, scale, ...args) => {
	const vector = math.core.get_vector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.make_matrix3_scale(scale, vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @description apply a translation to a graph.
 * @param {object} a FOLD graph
 * @param {number[]} optional. an array or series of numbers, the translation vector
 * @returns {object} the same input graph, modified
 */
const transform_translate = (graph, ...args) => {
	const vector = math.core.get_vector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.make_matrix3_translate(...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @description apply a rotation to a graph around the +Z axis.
 * @param {object} a FOLD graph
 * @param {number} the rotation amount in radians
 * @param {number[]} optional. an array or series of numbers, the center of rotation
 * @returns {object} the same input graph, modified
 */
const transform_rotateZ = (graph, angle, ...args) => {
	const vector = math.core.get_vector(...args);
	const vector3 = math.core.resize(3, vector);
	const matrix = math.core.make_matrix3_rotateZ(angle, ...vector3);
	return apply_matrix_to_graph(graph, matrix);
};

// make_matrix3_rotate
// make_matrix3_rotateX
// make_matrix3_rotateY
// make_matrix3_reflectZ

var transform = {
	scale: transform_scale,
	translate: transform_translate,
	rotateZ: transform_rotateZ,
	transform: apply_matrix_to_graph,
};

/**
 * Rabbit Ear (c) Kraft
 */

// const get_face_face_shared_vertices = (graph, face0, face1) => graph
//   .faces_vertices[face0]
//   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

/**
 * @param {number[]}, list of vertex indices. one entry from faces_vertices
 * @param {number[]}, list of vertex indices. one entry from faces_vertices
 * @returns {number[]}, indices of vertices that are shared between faces
 *  and keep the vertices in the same order as the winding order of face a.
 */
// todo: this was throwing errors in the case of weird nonconvex faces with
// single edges poking in. the "already_added" was added to fix this.
// tbd if this fix covers all cases of weird polygons in a planar graph.
const get_face_face_shared_vertices = (face_a_vertices, face_b_vertices) => {
	// build a quick lookup table: T/F is a vertex in face B
	const hash = {};
	face_b_vertices.forEach((v) => { hash[v] = true; });
	// make a copy of face A containing T/F, if the vertex is shared in face B
	const match = face_a_vertices.map(v => hash[v] ? true : false);
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
const make_face_spanning_tree = ({ faces_vertices, faces_faces }, root_face = 0) => {
	if (!faces_faces) {
		faces_faces = make_faces_faces({ faces_vertices });
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
		// we cannot depend on faces being convex and only sharing 2 vertices in common. if there are more than 2 edges, let's hope they are collinear. either way, grab the first 2 vertices if there are more.
		next_level
			.map(el => get_face_face_shared_vertices(
				faces_vertices[el.face],
				faces_vertices[el.parent]
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

var face_spanning_tree = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get_face_face_shared_vertices: get_face_face_shared_vertices,
	make_face_spanning_tree: make_face_spanning_tree
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a FOLD object and a set of 2x3 matrices, one per face,
 * "fold" the vertices by finding one matrix per vertex and multiplying them.
 * @param {object} FOLD graph with vertices_coords, faces_vertices, and
 * if vertices_faces does not exist it will be built.
 * @param {number[][]} an array of 2x3 matrices. one per face.
 * @returns {number[][]} a new set of vertices_coords, transformed.
 */
const multiply_vertices_faces_matrix2 = ({ vertices_coords, vertices_faces, faces_vertices }, faces_matrix) => {
	if (!vertices_faces) {
		vertices_faces = make_vertices_faces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => face === undefined
			? math.core.identity2x3
			: faces_matrix[face]);
	return vertices_coords
		.map((coord, i) => math.core.multiply_matrix2_vector2(vertices_matrix[i], coord));
};
const unassigned_angle = { U: true, u: true };
/**
 * This traverses an face-adjacency tree (edge-adjacent faces),
 * and recursively applies the affine transform that represents a fold
 * across the edge between the faces
 *
 * Flat/Mark creases are ignored!
 * the difference between the matrices of two faces separated by
 * a mark crease is the identity matrix.
 */
// { vertices_coords, edges_vertices, edges_foldAngle, faces_vertices, faces_faces}
const make_faces_matrix = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
	if (!edges_assignment && edges_foldAngle) {
		edges_assignment = make_edges_assignment({ edges_foldAngle });
	}
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = make_edges_foldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => math.core.identity3x4);
	make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
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
				const local_matrix = math.core.make_matrix3_rotate(
					foldAngle, // rotation angle
					math.core.subtract(...math.core.resize_up(coords[1], coords[0])), // line-vector
					coords[0], // line-origin
				);
				faces_matrix[entry.face] = math.core
					.multiply_matrices3(faces_matrix[entry.parent], local_matrix);
					// to build the inverse matrix, switch these two parameters
					// .multiply_matrices3(local_matrix, faces_matrix[entry.parent]);
			}));
	return faces_matrix;
};
/**
 * @description this is assuming the crease pattern contains flat folds only.
 * for every edge, give us a boolean:
 * - "true" if the edge is folded, valley or mountain, or unassigned
 * - "false" if the edge is not folded, flat or boundary.
 * 
 * "unassigned" is considered folded so that an unsolved crease pattern
 * can be fed into here and we still compute the folded state.
 * However, if there is no edges_assignments, and we have to use edges_foldAngle,
 * the "unassigned" trick will no longer work, only +/- non zero numbers get
 * counted as folded edges (true).
 * 
 * For this reason, treating "unassigned" as a folded edge, this method's
 * functionality is better considered to be specific to make_faces_matrix2,
 * instead of a generalized method. 
 */
const assignment_is_folded = {
	M: true, m: true, V: true, v: true, U: true, u: true,
	F: false, f: false, B: false, b: false,
};
const make_edges_is_flat_folded = ({ edges_vertices, edges_foldAngle, edges_assignment}) => {
	if (edges_assignment === undefined) {
		return edges_foldAngle === undefined
			? edges_vertices.map(_ => true)
			: edges_foldAngle.map(angle => angle < 0 || angle > 0);
	}
	return edges_assignment.map(a => assignment_is_folded[a]);  
};
/**
 * @description 2D matrices, for flat-folded origami
 */
const make_faces_matrix2 = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = make_edges_foldAngle({ edges_assignment });
		} else {
			// if no edges_foldAngle data exists, everyone gets identity matrix
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edges_is_folded = make_edges_is_flat_folded({ edges_vertices, edges_foldAngle, edges_assignment });
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => math.core.identity2x3);
	make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach(level => level
			.forEach((entry) => {
				const coords = entry.edge_vertices.map(v => vertices_coords[v]);
				const edgeKey = entry.edge_vertices.join(" ");
				const edge = edge_map[edgeKey];
				const reflect_vector = math.core.subtract2(coords[1], coords[0]);
				const reflect_origin = coords[0];
				const local_matrix = edges_is_folded[edge]
					? math.core.make_matrix2_reflect(reflect_vector, reflect_origin)
					: math.core.identity2x3;
				faces_matrix[entry.face] = math.core
					.multiply_matrices2(faces_matrix[entry.parent], local_matrix);
					// to build the inverse matrix, switch these two parameters
					// .multiply_matrices2(local_matrix, faces_matrix[entry.parent]);
			}));
	return faces_matrix;
};

var faces_matrix = /*#__PURE__*/Object.freeze({
	__proto__: null,
	multiply_vertices_faces_matrix2: multiply_vertices_faces_matrix2,
	make_faces_matrix: make_faces_matrix,
	make_edges_is_flat_folded: make_edges_is_flat_folded,
	make_faces_matrix2: make_faces_matrix2
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this method works in both 2D and 3D
 * unassigned edges are treated as flat fold (mountain/valley 180deg)
 * as a way of (assuming the user is giving a flat folded origami), help
 * solve things about an origami that is currently being figured out.
 */
const make_vertices_coords_folded = ({ vertices_coords, vertices_faces, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, faces_matrix }, root_face) => {
	faces_matrix = make_faces_matrix({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face);
	if (!vertices_faces) {
		vertices_faces = make_vertices_faces({ faces_vertices });
	}
	// assign one matrix to every vertex from faces, identity matrix if none exist
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null) // must filter "undefined" and "null"
			.shift()) // get any face from the list
		.map(face => face === undefined
			? math.core.identity3x4
			: faces_matrix[face]);
	return vertices_coords
		.map(coord => math.core.resize(3, coord))
		.map((coord, i) => math.core.multiply_matrix3_vector3(vertices_matrix[i], coord));
};
/**
 * @description this method works for 2D only (no z value).
 * if a edges_assignment is "U", assumed to be folded ("V" or "M").
 * also, if no edge foldAngle or assignments exist, assume all edges are folded.
 */
// export const make_vertices_coords_flat_folded = make_vertices_coords_folded;
const make_vertices_coords_flat_folded = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
	const edges_is_folded = make_edges_is_flat_folded({ edges_vertices, edges_foldAngle, edges_assignment });
	const vertices_coords_folded = [];
	faces_vertices[root_face]
		.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
	const faces_flipped = [];
	faces_flipped[root_face] = false;
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
	make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
		.slice(1) // remove the first level, it has no parent face
		.forEach((level, l) => level
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
						const coords_cp = vertices_coords[v];
						const to_point = math.core.subtract2(coords_cp, origin_cp);
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

var vertices_coords_folded = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_vertices_coords_folded: make_vertices_coords_folded,
	make_vertices_coords_flat_folded: make_vertices_coords_flat_folded
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * true/false: which face shares color with root face
 * the root face (and any similar-color face) will be marked as true
 *
 * this face coloring skips marks joining the two faces separated by it.
 * it relates directly to if a face is flipped or not (determinant > 0)
 */
const make_faces_winding_from_matrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
// the 2D matrix
const make_faces_winding_from_matrix2 = faces_matrix => faces_matrix
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);

// cool trick from https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
/**
 * @returns {boolean} true if a face is counter-clockwise. this should also
 * mean a true face is upright, false face is flipped.
 */
const make_faces_winding = ({ vertices_coords, faces_vertices }) => {
	return faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v])
			.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
			.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]) )
			.reduce((a, b) => a + b, 0))
		.map(face => face < 0);
};

var faces_winding = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_faces_winding_from_matrix: make_faces_winding_from_matrix,
	make_faces_winding_from_matrix2: make_faces_winding_from_matrix2,
	make_faces_winding: make_faces_winding
});

/**
 * Rabbit Ear (c) Kraft
 */

// todo, expand this to include edges, edges_faces, etc..
const explode_faces = (graph) => {
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

const explode_shrink_faces = ({ vertices_coords, faces_vertices }, shrink = 0.333) => {
	const graph = explode_faces({ vertices_coords, faces_vertices });
	const faces_winding = make_faces_winding(graph);
	const faces_vectors = graph.faces_vertices
		.map(vertices => vertices.map(v => graph.vertices_coords[v]))
		.map(points => points.map((p, i, arr) => math.core.subtract2(p, arr[(i+1) % arr.length])));
	const faces_centers = make_faces_center_quick({ vertices_coords, faces_vertices });
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
				? math.core.counter_clockwise_bisect2(...pair)
				: math.core.clockwise_bisect2(...pair)))
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

var explode_faces_methods = /*#__PURE__*/Object.freeze({
	__proto__: null,
	explode_faces: explode_faces,
	explode_shrink_faces: explode_shrink_faces
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @returns index of nearest vertex in vertices_ arrays or
 * this is the only one of the nearest_ functions that works in 3-dimensions
 *
 * todo: improve with space partitioning
 */
const nearest_vertex = ({ vertices_coords }, point) => {
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
 * returns index of nearest edge in edges_ arrays or
 *  undefined if there are no vertices_coords or edges_vertices
 */
const nearest_edge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => math.core.nearest_point_on_line(
			math.core.subtract(e[1], e[0]),
			e[0],
			point,
			math.core.segment_limiter));
	return math.core.smallest_comparison_search(point, nearest_points, math.core.distance);
};
/**
 * from a planar perspective, ignoring z components
 */
const face_containing_point = ({ vertices_coords, faces_vertices }, point) => {
	if (!vertices_coords || !faces_vertices) { return undefined; }
	const face = faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => math.core.overlap_convex_polygon_point(f.face, point))
		.shift();
	return (face === undefined ? undefined : face.i);
};

const nearest_face = (graph, point) => {
	const face = face_containing_point(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearest_edge(graph, point);
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = make_faces_center_quick({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f])
			});
			const distances = faces_center
				.map(center => math.core.distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i++) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
};

var nearest = /*#__PURE__*/Object.freeze({
	__proto__: null,
	nearest_vertex: nearest_vertex,
	nearest_edge: nearest_edge,
	face_containing_point: face_containing_point,
	nearest_face: nearest_face
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
 * @description given an edge, uncover the adjacent faces
 * @param {object} FOLD graph
 * @param {number} index of the edge in the graph
 * {number[]} indices of the two vertices making up the edge
 * @returns {number[]} array of 0, 1, or 2 numbers, the edge's adjacent faces
 */
const find_adjacent_faces_to_edge = ({ vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices }, edge) => {
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
		let faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("todo: find_adjacent_faces_to_edge");
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
 * @param {object} FOLD object, modified in place
 * @param {number} the index of the edge that will be split by the new vertex
 * @param {number} the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const split_edge_into_two = (graph, edge_index, new_vertex) => {
	const edge_vertices = graph.edges_vertices[edge_index];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], new_vertex] },
		{ edges_vertices: [new_vertex, edge_vertices[1]] },
	];
	new_edges.forEach((edge, i) => [_edges_assignment, _edges_foldAngle]
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
 * @param {object} FOLD object, modified in place
 * @param {number} index of new vertex
 * @param {number[]} vertices that make up the split edge. new vertex lies between.
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
const update_vertices_sectors = ({ vertices_coords, vertices_vertices, vertices_sectors }, vertex) => {
	if (!vertices_sectors) { return; }
	vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
		? [math.core.TWO_PI]
		: math.core.counter_clockwise_sectors2(vertices_vertices[vertex]
			.map(v => math.core
				.subtract2(vertices_coords[v], vertices_coords[vertex])));
};
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update vertices_edges for the new vertex, as well as the split edge's
 * endpoint's vertices_edges to include the two new edges in place of the
 * old one while preserving all other vertices_vertices in each endpoint.
 * @param {object} FOLD object, modified in place
 * @param {number[]} vertices the old edge's two vertices, must be aligned with "new_edges"
 * @param {number} old_edge the index of the old edge
 * @param {number} new_vertex the index of the new vertex splitting the edge
 * @param {number[]} new_edges the two new edges, must be aligned with "vertices"
 */
const update_vertices_edges$2 = ({ vertices_edges }, old_edge, new_vertex, vertices, new_edges) => {
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
 * @param {object} FOLD object, modified in place
 * @param {number} the new vertex
 * @param {number[]} array of 0, 1, or 2 incident faces.
 */
const update_vertices_faces$1 = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};
/**
 * @description a new vertex was added between two faces, update the
 * edges_faces with the already-known faces indices.
 * @param {object} FOLD object, modified in place
 * @param {number[]} array of 2 new edges
 * @param {number[]} array of 0, 1, or 2 incident faces.
 */
const update_edges_faces$1 = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => edges_faces[edge] = [...faces]);
};
/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} FOLD object, modified in place
 * @param {number[]} indices of two faces to be rebuilt
 * @param {number} new vertex index
 * @param {number[]} the two vertices of the old edge
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
const update_faces_edges_with_vertices = ({ edges_vertices, faces_vertices, faces_edges }, faces) => {
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
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
//         throw new Error("split_edge() bad faces_edges");
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
 * @param {object} FOLD object, modified in place
 * @param {number} index of old edge to be split
 * @param {number[]} coordinates of the new vertex to be added. optional.
 * if omitted, a vertex will be generated at the edge's midpoint.
 * @param epsilon, if an incident vertex is within this distance
 * the function will not split the edge, simply return this vertex.
 * @returns {object} a summary of the changes with keys "vertex", "edges"
 * "vertex" is the index of the new vertex (or old index, if similar)
 * "edge" is a summary of changes to edges, with "map" and "remove"
 */
const split_edge = (graph, old_edge, coords, epsilon = math.core.EPSILON) => {
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
	split_edge_into_two(graph, old_edge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
	// done with: vertices_coords, edges_vertices, edges_assignment, edges_foldAngle
	update_vertices_vertices$2(graph, vertex, incident_vertices);
	update_vertices_sectors(graph, vertex); // after vertices_vertices
	update_vertices_edges$2(graph, old_edge, vertex, incident_vertices, new_edges);
	// done with: vertices_edges, vertices_vertices, and
	// vertices_sectors if it exists.
	const incident_faces = find_adjacent_faces_to_edge(graph, old_edge);
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
	const edge_map = remove_geometry_indices(graph, _edges, [ old_edge ]);
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
const make_faces = ({ edges_vertices, faces_vertices, faces_edges, faces_faces }, face, vertices) => {
	// the indices of the two vertices inside the face_vertices array.
	// this is where we will split the face into two.
	const indices = vertices.map(el => faces_vertices[face].indexOf(el));
	const faces = split_circular_array(faces_vertices[face], indices)
		.map(fv => ({ faces_vertices: fv }));
	if (faces_edges) {
		// table to build faces_edges
		const vertices_to_edge = make_vertices_to_edge_bidirectional({ edges_vertices });
		faces.map(face => face.faces_vertices
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
		.forEach((face, i) => Object.keys(face)
			.forEach((key) => { graph[key][faces[i]] = face[key]; }));
	return faces;
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description this is a highly specific method, it takes in the output
 * from intersect_convex_face_line and applies it to a graph by splitting
 * the edges (in the case of edge, not vertex intersection),
 * @param {object} a FOLD object. modified in place.
 * @param {object} the result from calling "intersect_convex_face_line".
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
		const res = split_edge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? merge_nextmaps(map, res.edges.map) : res.edges.map;
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
		const inverted = invert_simple_map(res.edges.map);
		bkmap = bkmap ? merge_backmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		}
	};
};

/**
 * Rabbit Ear (c) Kraft
 */
const warning = "split_face potentially given a non-convex face";
/**
 * @description a newly-added edge needs to update its two endpoints'
 * vertices_vertices. each vertices_vertices gains one additional
 * vertex, then the whole array is re-sorted counter-clockwise
 * @param {object} FOLD object
 * @param {number} index of the newly-added edge
 */
const update_vertices_vertices$1 = ({ vertices_coords, vertices_vertices, edges_vertices }, edge) => {
	const v0 = edges_vertices[edge][0];
	const v1 = edges_vertices[edge][1];
	vertices_vertices[v0] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v0].concat(v1), v0);
	vertices_vertices[v1] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v1].concat(v0), v1);
};
/**
 * vertices_vertices was just run before this method. use it.
 * vertices_edges should be up to date, except for the addition
 * of this one new edge at both ends of 
 */
const update_vertices_edges$1 = ({ edges_vertices, vertices_edges, vertices_vertices }, edge) => {
	// the expensive way, rebuild all arrays
	// graph.vertices_edges = make_vertices_edges(graph);
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
		.forEach((f, i) => graph.faces_vertices[f]
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
		.forEach((f, i) => graph.faces_edges[f]
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
		for (let i = 0; i < graph.edges_faces[e].length; i++) {
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
	const incident_face_face = incident_faces.map((f, i) => {
		const incident_face_vertices = faces_vertices[f];
		const score = [0, 0];
		for (let n = 0; n < new_faces_vertices.length; n++) {
			let count = 0;
			for (let j = 0; j < incident_face_vertices.length; j++) {
				if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
					count++;
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
		for (let j = 0; j < faces_faces[f].length; j++) {
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
 * @description divide a CONVEX face into two polygons with a straight line cut.
 * if the line ends exactly along existing vertices, they will be
 * used, otherwise, new vertices will be added (splitting edges).
 * @param {object} FOLD object, modified in place
 * @param {number} index of face to split
 * @param {number[]} the vector component describing the cutting line
 * @param {number[]} the point component describing the cutting line
 * @returns {object | undefined} a summary of changes to the FOLD object,
 *  or undefined if no change (no intersection).
 */
const split_convex_face = (graph, face, vector, point, epsilon) => {
	// survey face for any intersections which cross directly over a vertex
	const intersect = intersect_convex_face_line(graph, face, vector, point, epsilon);
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
	const faces_map = remove_geometry_indices(graph, _faces, [face]);
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
 * Graph - a flat-array, index-based graph with faces, edges, and vertices
 * with ability for vertices to exist in Euclidean space.
 * The naming scheme for keys follows the FOLD format.
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
	validate,
	populate,
	fragment,
	subgraph,
	assign,
	// convert snake_case to camelCase
	addVertices: add_vertices,
	splitEdge: split_edge,
	faceSpanningTree: make_face_spanning_tree,
	explodeFaces: explode_faces,
	explodeShrinkFaces: explode_shrink_faces,
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
	const line = math.core.get_line(...args);
	return split_convex_face(this, face, line.vector, line.origin);
};
/**
 * @returns {this} a deep copy of this object
 */
Graph.prototype.copy = function () {
	// return Object.assign(Object.create(Graph.prototype), clone(this));
	return Object.assign(Object.create(this.__proto__), clone(this));
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
	fold_keys.graph.forEach(key => delete this[key]);
	fold_keys.orders.forEach(key => delete this[key]);
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
	if (!this.vertices_coords) { return; }
	const box = math.core.bounding_box(this.vertices_coords);
	const longest = Math.max(...box.span);
	const scale = longest === 0 ? 1 : (1 / longest);
	const origin = box.min;
	this.vertices_coords = this.vertices_coords
		.map(coord => math.core.subtract(coord, origin))
		.map(coord => coord.map((n, i) => n * scale));
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
		? multiply_vertices_faces_matrix2(this, this.faces_matrix2)
		: make_vertices_coords_folded(this, ...arguments);
	// const faces_layer = this["faces_re:layer"]
	//   ? this["faces_re:layer"]
	//   : make_faces_layer(this, arguments[0], 0.001);
	return Object.assign(
		// todo: switch this for:
		// Object.getPrototypeOf(this);
		Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			// "faces_re:layer": faces_layer,
			frame_classes: [_foldedForm]
		}));
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
		? multiply_vertices_faces_matrix2(this, this.faces_matrix2)
		: make_vertices_coords_flat_folded(this, ...arguments);
	return Object.assign(
		// todo: switch this for:
		// Object.getPrototypeOf(this);
		Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			frame_classes: [_foldedForm]
		}));
};
/**
 * graph components
 */
// bind "vertices", "edges", or "faces" to "this"
// then we can pass in this function directly to map()
const shortenKeys = function (el, i, arr) {
	const object = Object.create(null);
	Object.keys(el).forEach((k) => {
		object[k.substring(this.length + 1)] = el[k];
	});
	return object;
};
// bind the FOLD graph to "this"
const getComponent = function (key) {
	return transpose_graph_arrays(this, key)
		.map(shortenKeys.bind(key))
		.map(setup[key].bind(this));
};

[_vertices, _edges, _faces]
	.forEach(key => Object.defineProperty(Graph.prototype, key, {
		enumerable: true,
		get: function () { return getComponent.call(this, key); }
	}));

// todo: get boundaries, plural
// get boundary. only if the edges_assignment
Object.defineProperty(Graph.prototype, _boundary, {
	enumerable: true,
	get: function () {
		const boundary = get_boundary(this);
		const poly = math.polygon(boundary.vertices.map(v => this.vertices_coords[v]));
		Object.keys(boundary).forEach(key => { poly[key] = boundary[key]; });
		return Object.assign(poly, boundary);
	}
});
/**
 * graph components based on Euclidean distance
 */
const nearestMethods = {
	vertices: nearest_vertex,
	edges: nearest_edge,
	faces: nearest_face,
};
/**
 * @description given a point, this will return the nearest vertex, edge,
 * and face, as well as the nearest entry inside all of the "vertices_",
 * "edges_", and "faces_" arrays.
 */
Graph.prototype.nearest = function () {
	const point = math.core.get_vector(arguments);
	const nears = Object.create(null);
	const cache = {};
	[_vertices, _edges, _faces].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => {
				if (cache[key] !== undefined) { return cache[key]; }
				cache[key] = nearestMethods[key](this, point);
				return cache[key];
			}
		});
		filter_keys_with_prefix(this, key).forEach(fold_key =>
			Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => this[fold_key][nears[singularize[key]]]
			}));
	});
	return nears;
};

var GraphProto = Graph.prototype;

/**
 * Rabbit Ear (c) Kraft
 */

// convex poly only!
const clip = function (
	{vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices},
	line) {
	if (!boundaries_vertices) {
		boundaries_vertices = get_boundary({
			vertices_edges, edges_vertices, edges_assignment
		}).vertices;
	}
	return math.polygon(boundaries_vertices.map(v => vertices_coords[v]))
		.clip(line);
};

/**
 * Rabbit Ear (c) Kraft
 */
// this method is meant to add edges between EXISTING vertices.
// this should split and rebuild faces.

// todo: we need to make a remove_duplicate_edges that returns merge info

// const edges = ear.graph.add_edges(graph, [[0, vertex], [1, vertex], [2, 3], [2, vertex]]);
const add_edges = (graph, edges_vertices) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	// the user messed up the input and only provided one edge
	// it's easy to fix for them
	if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
	const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
	graph.edges_vertices.push(...edges_vertices);
	const index_map = remove_duplicate_edges(graph).map;
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
		.map((str, i) => pre_edge_map[str] === undefined);
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
	for (let i = 0; i < segment_vertices.length; i++) {
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
		graph.vertices_vertices[vertex] = sort_vertices_counter_clockwise(
			graph, unsorted_vertices_vertices, segment_vertices[i]);
	}
	// build vertices_edges from vertices_vertices
	const edge_map = make_vertices_to_edge_bidirectional(graph);
	for (let i = 0; i < segment_vertices.length; i++) {
		const vertex = segment_vertices[i];
		graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
			.map(v => edge_map[`${vertex} ${v}`]);
	}
	// build vertices_sectors from vertices_vertices
	segment_vertices
		.map(center => graph.vertices_vertices[center].length === 1
		? [math.core.TWO_PI]
		: math.core.counter_clockwise_sectors2(graph.vertices_vertices[center]
			.map(v => math.core
				.subtract2(graph.vertices_coords[v], graph.vertices_coords[center]))))
		.forEach((sectors, i) => {
			graph.vertices_sectors[segment_vertices[i]] = sectors;
		});
	return segment_edges;
};
/**
 * fragment_edges is the fragment operation but will only operate on a
 * subset of edges.
 */
const add_planar_segment = (graph, point1, point2, epsilon = math.core.EPSILON) => {
	// vertices_sectors not a part of the spec, might not be included.
	// this is needed for when we walk faces. we need to be able to
	// identify the one face that winds around the outside enclosing Infinity.
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = make_vertices_sectors(graph);
	}
	// flatten input points to the Z=0 plane
	const segment = [point1, point2].map(p => [p[0], p[1]]);
	const segment_vector = math.core.subtract2(segment[1], segment[0]);
	// not sure this is wanted. project all vertices onto the XY plane.
	// graph.vertices_coords = graph.vertices_coords
	//   .map(coord => coord.slice(0, 2));
	// get all edges which intersect the segment.
	const intersections = make_edges_segment_intersection(
		graph, segment[0], segment[1], epsilon);
	// get the indices of the edges, sorted.
	const intersected_edges = intersections
		.map((pt, e) => pt === undefined ? undefined : e)
		.filter(a => a !== undefined)
		.sort((a, b) => a - b);
	// using edges_faces, get all faces which have an edge intersected.
	const faces_map = {};
	intersected_edges
		.forEach(e => graph.edges_faces[e]
			.forEach(f => { faces_map[f] = true; }));
	const intersected_faces = Object.keys(faces_map)
		.map(s => parseInt(s))
		.sort((a, b) => a - b);
	// split all intersected edges into two edges, in reverse order
	// so that the "remove()" call only ever removes the last from the
	// set of edges. each split_edge call also rebuilds all graph data,
	// vertices, faces, adjacent of each, etc..
	const split_edge_results = intersected_edges
		.reverse()
		.map(edge => split_edge(graph, edge, intersections[edge], epsilon));
	const split_edge_vertices = split_edge_results.map(el => el.vertex);
	// do we need this? changelog for edges? maybe it will be useful someday.
	// todo, should this list be reversed?
	// if the segment crosses at the intersection of some edges,
	// this algorithm produces maps with a bunch of undefineds.
	// const split_edge_maps = split_edge_results.map(el => el.edges.map);
	// console.log("split_edge_maps", split_edge_maps);
	// const split_edge_map = split_edge_maps
	//   .splice(1)
	//   .reduce((a, b) => merge_nextmaps(a, b), split_edge_maps[0]);
	// now that all edges have been split their new vertices have been
	// added to the graph, add the original segment's two endpoints.
	// we waited until here because this method will search all existing
	// vertices, and avoid adding a duplicate, which will happen in the
	// case of an endpoint lies collinear along a split edge.
	const endpoint_vertices = add_vertices(graph, segment, epsilon);
	// use a hash as an intermediary, make sure new vertices are unique.
	// duplicate vertices will occur in the case of a collinear endpoint.
	const new_vertex_hash = {};
	split_edge_vertices.forEach(v => { new_vertex_hash[v] = true; });
	endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
	const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n));
	// these vertices are sorted in the direction of the segment
	const segment_vertices = sort_vertices_along_vector(graph, new_vertices, segment_vector);

	const edge_map = make_vertices_to_edge_bidirectional(graph);
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
		.map((v, i) => graph.vertices_vertices[v]
			.map(adj_v => [[adj_v, v], [v, adj_v]]))
		.reduce((a, b) => a.concat(b), [])
		.reduce((a, b) => a.concat(b), []);
	// graph.vertices_sectors = make_vertices_sectors(graph);
	// memo to prevent duplicate faces. this one object should be
	// applied globally to all calls to the method.
	const walked_edges = {};
	// build faces by begin walking from the set of vertex pairs.
	// this includes the one boundary face in the wrong winding direction
	const all_walked_faces = face_walk_start_pairs
		.map(pair => counter_clockwise_walk(graph, pair[0], pair[1], walked_edges))
		.filter(a => a !== undefined);
	// filter out the one boundary face with wrong winding (if it exists)
	const walked_faces = filter_walked_boundary_face(all_walked_faces);
	// const walked_faces = all_walked_faces;
	// this method could be called before or after the walk. but
	// for simplicity we're calling it before adding the new faces.
	remove_geometry_indices(graph, "faces", intersected_faces);
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
		graph.vertices_faces = make_vertices_faces(graph);
	}
	if (graph.edges_faces) {
		graph.edges_faces = make_edges_faces_unsorted(graph);
	}
	if (graph.faces_faces) {
		graph.faces_faces = make_faces_faces(graph);
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
	// console.log("split_edge_results", split_edge_results);
	// console.log("split_edge_map", split_edge_map);
	// console.log("split_edge_vertices", split_edge_vertices);
	// console.log("vertices_vertices", split_edge_vertices
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
	[faces[1], faces[0]];
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
	if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("remove_planar_edge error joining faces"); }

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

const remove_planar_edge = (graph, edge) => {
	// the edge's vertices, sorted large to small.
	// if they are isolated, we want to remove them.
	const vertices = [...graph.edges_vertices[edge]]
		.sort((a, b) => b - a);
	const faces = [...graph.edges_faces[edge]];
	// console.log("removing edge", edge, "with", faces.length, "adjacent faces", faces, "and", vertices.length, "adjacent vertices", vertices);
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
					already_added ? arr.splice(i, 1) : arr.splice(i, 1, new_face);
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
		remove_geometry_indices(graph, "faces", faces);
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
	remove_geometry_indices(graph, "edges", [edge]);
	remove_geometry_indices(graph, "vertices", remove_vertices);
};

/**
 * Rabbit Ear (c) Kraft
 */

const get_opposite_vertices = (graph, vertex, edges) => {
	edges.forEach(edge => {
		if (graph.edges_vertices[edge][0] === vertex
			&& graph.edges_vertices[edge][1] === vertex) {
			console.warn("remove_planar_vertex circular edge");
		}
	});
	return edges.map(edge => graph.edges_vertices[edge][0] === vertex
		? graph.edges_vertices[edge][1]
		: graph.edges_vertices[edge][0]);
};

const remove_planar_vertex = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	const faces = unique_sorted_integers(graph.vertices_faces[vertex]
		.filter(a => a != null));
	if (edges.length !== 2 || faces.length > 2) {
		console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
		return;
	}
	const vertices = get_opposite_vertices(graph, vertex, edges);
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
			console.warn("remove_planar_vertex unknown vertex issue");
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
			console.warn("remove_planar_vertex unknown face_vertex issue");
			return;
		}
		graph.faces_vertices[face].splice(index, 1);
	});
	// faces_edges
	faces.forEach(face => {
		const index = graph.faces_edges[face].indexOf(edges[1]);
		if (index === -1) {
			console.warn("remove_planar_vertex unknown face_edge issue");
			return;
		}
		graph.faces_edges[face].splice(index, 1);
	});
	// no changes to: vertices_faces, edges_faces, faces_faces,
	// edges_assignment/foldAngle
	remove_geometry_indices(graph, "vertices", [vertex]);
	remove_geometry_indices(graph, "edges", [edges[1]]);
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a list of numbers this method will sort them by
 *  even and odd indices and sum the two categories, returning two sums.
 * @param {number[]} one list of numbers
 * @returns {number[]} one array of two sums, even and odd indices
 */
const alternating_sum = (numbers) => [0, 1]
	.map(even_odd => numbers
		.filter((_, i) => i % 2 === even_odd)
		.reduce((a, b) => a + b, 0));
/**
 * @description alternating_sum, filter odd and even into two categories, then
 *  then set them to be the deviation from the average of the sum.
 * @param {number[]} one list of numbers
 * @returns {number[]} one array of two numbers. if both alternating sets sum
 *  to the same, the result will be [0, 0]. if the first set is 2 more than the
 *  second, the result will be [1, -1]. (not [2, 0] or something with a 2 in it)
 */
const alternating_sum_difference = (sectors) => {
	const halfsum = sectors.reduce((a, b) => a + b, 0) / 2;
	return alternating_sum(sectors).map(s => s - halfsum);
};

// export const kawasaki_from_even_vectors = function (...vectors) {
//   return alternating_deviation(...interior_angles(...vectors));
// };
/**
 * @param {number[]} the angle of the edges in radians, like vectors around a vertex
 * @returns {number[]} for every sector,
 * this is hard coded to work for flat-plane, where sectors sum to 360deg
 */
const kawasaki_solutions_radians = (radians) => radians
	// counter clockwise angle between this index and the next
	.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
	.map(pair => math.core.counter_clockwise_angle_radians(...pair))
	// for every sector, make an array of all the OTHER sectors
	.map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
	// for every sector, use the sector score from the OTHERS two to split it
	.map(opposite_sectors => alternating_sum(opposite_sectors).map(s => Math.PI - s))
	// add the deviation to the edge to get the absolute position
	.map((kawasakis, i) => radians[i] + kawasakis[0])
	// sometimes this results in a solution OUTSIDE the sector. ignore these
	.map((angle, i) => (math.core.is_counter_clockwise_between(angle,
		radians[i], radians[(i + 1) % radians.length])
		? angle
		: undefined));
// or should we remove the indices so the array reports [ empty x2, ...]

const kawasaki_solutions_vectors = (vectors) => {
	const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
	return kawasaki_solutions_radians(vectors_radians)
		.map(a => (a === undefined
			? undefined
			: [Math.cos(a), Math.sin(a)]));
};

var kawasaki_math = /*#__PURE__*/Object.freeze({
	__proto__: null,
	alternating_sum: alternating_sum,
	alternating_sum_difference: alternating_sum_difference,
	kawasaki_solutions_radians: kawasaki_solutions_radians,
	kawasaki_solutions_vectors: kawasaki_solutions_vectors
});

/**
 * Rabbit Ear (c) Kraft
 */

const flat_assignment = { B:true, b:true, F:true, f:true, U:true, u:true };
/**
 * @description get all vertices indices which are adjacent to edges
 * with no mountain/valleys, only containing either flat, unassigned,
 * or boundary.
 */
const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => flat_assignment[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => valid ? i : undefined)
	.filter(a => a !== undefined);

const folded_assignments = { M:true, m:true, V:true, v:true};
const maekawa_signs = { M:-1, m:-1, V:1, v:1};
/**
 * @description these methods will check the entire graph and return
 * indices of vertices which have issues.
 */
const validate_maekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => maekawa_signs[edges_assignment[e]])
			.filter(a => a !== undefined)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	// overwrite any false values to true for all boundary vertices
	get_boundary_vertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => !valid ? v : undefined)
		.filter(a => a !== undefined);
};

const validate_kawasaki = ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, edges_vector }, epsilon = math.core.EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const is_valid = make_vertices_vertices_vector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
		.map((vectors, v) => vectors
			.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => vectors.length > 1
			? math.core.counter_clockwise_sectors2(vectors)
			: [0, 0])
		.map(sectors => alternating_sum(sectors))
		.map((pair, v) => Math.abs(pair[0] - pair[1]) < epsilon);

	// overwrite any false values to true for all boundary vertices
	get_boundary_vertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => !valid ? v : undefined)
		.filter(a => a !== undefined);
};

var validate_single_vertex = /*#__PURE__*/Object.freeze({
	__proto__: null,
	validate_maekawa: validate_maekawa,
	validate_kawasaki: validate_kawasaki
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
//     const vertices = add_vertices(this, segment);
//     const edges = add_edges(this, vertices);
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
		const edges = add_planar_segment(this, segment[0], segment[1]);
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
			const verts = add_vertices(this, segment);
			vertices.push(...verts);
			edges.push(...add_edges(this, verts));
		});
		const map = fragment(this).edges.map;
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
//       return add_planar_segment(this, segment[0], segment[1]);
//     });
//     console.log("verts, edges", vertices, edges);
//     // return make_edges_array.call(this, edges
//     //   .reduce((a, b) => a.concat(b), []));
//   };
// });


CreasePattern.prototype.removeEdge = function (edge) {
	const vertices = this.edges_vertices[edge];
	remove_planar_edge(this, edge);
	vertices
		.map(v => is_vertex_collinear(this, v))
		.map((collinear, i) => collinear ? vertices[i] : undefined)
		.filter(a => a !== undefined)
		.sort((a, b) => b - a)
		.forEach(v => remove_planar_vertex(this, v));
	return true;
};

CreasePattern.prototype.validate = function (epsilon) {
	const valid = validate(this, epsilon);
	valid.vertices.kawasaki = validate_kawasaki(this, epsilon);
	valid.vertices.maekawa = validate_maekawa(this);
	if (this.edges_foldAngle) {
		valid.edges.not_flat = this.edges_foldAngle
			.map((angle, i) => edge_foldAngle_is_flat(angle) ? undefined : i)
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
 *
 * @param {number[]} each index is a face, each value is the z-layer order.
 * @param {boolean[]} each index is a face, T/F will the face be folded over?
 * @returns {number[]} each index is a face, each value is the z-layer order.
 */
const fold_faces_layer = (faces_layer, faces_folding) => {
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
 */
const make_face_side = (vector, origin, face_center, face_winding) => {
	const center_vector = math.core.subtract2(face_center, origin);
	const determinant = math.core.cross2(vector, center_vector);
	return face_winding ? determinant < 0 : determinant > 0;
};
/**
 * for quickly determining which side of a crease a face lies
 * this uses point average, not centroid, faces must be convex
 * and again it's not precise, but this doesn't matter because
 * the faces which intersect the line (and could potentially cause
 * discrepencies) don't use this method, it's only being used
 * for faces which lie completely on one side or the other.
 */
const make_face_center = (graph, face) => !graph.faces_vertices[face]
	? [0, 0]
	: graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / graph.faces_vertices[face].length);

const unfolded_assignment = { F:true, f:true, U:true, u:true };
const opposite_lookup = { M:"V", m:"V", V:"M", v:"M" };
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
 * @param {object} a FOLD graph in crease pattern form.
 * algorithm outline:
 * Because we want to return the new modified origami in crease pattern form,
 * as we iterate through the faces, splitting faces which cross the crease
 * line, we have to be modifying the crease pattern, as opposed to modifying
 * a folded form then unfolding the vertices, which would be less precise.
 * So, we will create copies of the crease line, one per face, transformed
 * into place by its face's matrix, which superimposes many copies of the
 * crease line onto the crease pattern, each in place
 */
const flat_fold = (graph, vector, origin, assignment = "V", epsilon = math.core.EPSILON) => {
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
	// splitting (removing 1 face, adding 2) inside "split_face", the remove
	// method will automatically shift indices for arrays starting with "faces_".
	// we will remove these arrays at the end of this method.
	graph.faces_center = graph.faces_vertices
		.map((_, i) => make_face_center(graph, i));
	// faces_matrix is built from the crease pattern, but reflects
	// the faces in their folded state.
	if (!graph.faces_matrix2) {
		graph.faces_matrix2 = make_faces_matrix2(graph, 0);
	}
	graph.faces_winding = make_faces_winding_from_matrix2(graph.faces_matrix2);
	graph.faces_crease = graph.faces_matrix2
		.map(math.core.invert_matrix2)
		.map(matrix => math.core.multiply_matrix2_line2(matrix, vector, origin));
	graph.faces_side = graph.faces_vertices
		.map((_, i) => make_face_side(
			graph.faces_crease[i].vector,
			graph.faces_crease[i].origin,
			graph.faces_center[i],
			graph.faces_winding[i],
		));
	// before we start splitting faces, we have to handle the case where
	// a flat crease already exists along the fold crease, already splitting
	// two faces (assignment "F" or "U" only), the split_face method
	// will not catch these. we need to find these edges before we modify
	// the graph, find the face they are attached to and whether the face
	// is flipped, and set the edge to the proper "V" or "M" (and foldAngle).
	const vertices_coords_folded = multiply_vertices_faces_matrix2(graph,
		graph.faces_matrix2);
	// get all (folded) edges which lie parallel and overlap the crease line
	const collinear_edges = make_edges_line_parallel_overlap({
		vertices_coords: vertices_coords_folded,
		edges_vertices: graph.edges_vertices,
	}, vector, origin, epsilon)
		.map((is_collinear, e) => is_collinear ? e : undefined)
		.filter(e => e !== undefined)
		.filter(e => unfolded_assignment[graph.edges_assignment[e]]);
	// get the first valid adjacent face for each edge, get that face's winding,
	// which determines the crease assignment, and assign it to the edge
	collinear_edges
		.map(e => graph.edges_faces[e].find(f => f != null))
		.map(f => graph.faces_winding[f])
		.map(winding => winding ? assignment : opposite_assignment)
		.forEach((assignment, e) => {
			graph.edges_assignment[collinear_edges[e]] = assignment;
			graph.edges_foldAngle[collinear_edges[e]] = edge_assignment_to_foldAngle(
				assignment);
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
			const change = split_convex_face(
				graph,
				i,
				face.crease.vector,
				face.crease.origin,
				epsilon);
			// console.log("split convex polygon change", change);
			if (change === undefined) { return undefined; }
			// const face_winding = folded.faces_winding[i];
			// console.log("face change", face, change);
			// update the assignment of the newly added edge separating the 2 new faces
			graph.edges_assignment[change.edges.new] = face.winding
				? assignment
				: opposite_assignment;
			graph.edges_foldAngle[change.edges.new] = edge_assignment_to_foldAngle(
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
					face.winding);
				graph.faces_layer[f] = face.layer;
			});
			return change;
		})
		.filter(a => a !== undefined);
	// all faces have been split. get a summary of changes to the graph.
	// "faces_map" is actually needed. the others are just included in the return
	const faces_map = merge_nextmaps(...split_changes.map(el => el.faces.map));
	const edges_map = merge_nextmaps(...split_changes.map(el => el.edges.map)
		.filter(a => a !== undefined));
	const faces_remove = split_changes.map(el => el.faces.remove).reverse();
	// const vert_dict = {};
	// split_changes.forEach(el => el.vertices.forEach(v => { vert_dict[v] = true; }));
	// const new_vertices = Object.keys(vert_dict).map(s => parseInt(s));
	// build a new face layer ordering
	graph.faces_layer = fold_faces_layer(
		graph.faces_layer,
		graph.faces_side,
	);
	// build new face matrices for the folded state. use face 0 as reference
	// we need its original matrix, and if face 0 was split we need to know
	// which of its two new faces doesn't move as the new faces matrix
	// calculation requires we provide the one face that doesn't move.
	const face0_was_split = faces_map && faces_map[0].length === 2;
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
			: math.core.multiply_matrices2(
					face0.matrix,
					math.core.make_matrix2_reflect(
						face0.crease.vector,
						face0.crease.origin))
		);
	}
	// build our new faces_matrices using face 0 as the starting point,
	// setting face 0 as the identity matrix, then multiply every
	// face's matrix by face 0's actual starting matrix
	graph.faces_matrix2 = make_faces_matrix2(graph, face0_newIndex)
		.map(matrix => math.core.multiply_matrices2(face0_preMatrix, matrix));
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
	}
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * Origami - a model of an origami paper
 * prototype is Graph
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
	const line = math.core.get_line(arguments);
	flat_fold(this, line.vector, line.origin);
	return this;
};

var OrigamiProto = Origami.prototype;

/**
 * Rabbit Ear (c) Kraft
 */
const is_folded_form = (graph) => {
	return (graph.frame_classes && graph.frame_classes.includes("foldedForm"))
		|| (graph.file_classes && graph.file_classes.includes("foldedForm"));
};

	// const isFoldedForm = typeof graph.frame_classes === K.object
	//   && graph.frame_classes !== null
	//   && !(graph.frame_classes.includes(K.creasePattern));

var query = /*#__PURE__*/Object.freeze({
	__proto__: null,
	is_folded_form: is_folded_form
});

/**
 * Rabbit Ear (c) Kraft
 */

const make_edges_faces_overlap = ({ vertices_coords, edges_vertices, edges_vector, edges_faces, faces_edges, faces_vertices }, epsilon) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	const faces_winding = make_faces_winding({ vertices_coords, faces_vertices });
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
	for (let f = 0; f < faces_winding.length; f++) {
		if (!faces_winding[f]) { faces_vertices_coords[f].reverse(); }
	}
	matrix.forEach((row, e) => row.forEach((val, f) => {
		if (val === false) { return; }
		// both segment endpoints, true if either one of them is inside the face.
		const point_in_poly = edges_vertices_coords[e]
			.map(point => math.core.overlap_convex_polygon_point(
				faces_vertices_coords[f],
				point,
				math.core.exclude,
				epsilon
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { matrix[e][f] = true; return; }
		const edge_intersect = math.core.intersect_convex_polygon_line(
			faces_vertices_coords[f],
			edges_vector[e],
			edges_origin[e],
			math.core.exclude_s,
			math.core.exclude_s,
			epsilon
		);
		if (edge_intersect) { matrix[e][f] = true; return; }
		matrix[e][f] = false;
	}));
	return matrix;
};

// const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
//   const matrix = Array.from(Array(faces_vertices.length))
//     .map(() => Array.from(Array(faces_vertices.length)));
//   const faces_polygon = make_faces_polygon({ vertices_coords, faces_vertices }, epsilon);
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
 * @description compare every face to every face, do they overlap?
 * return the result in the form of a matrix, an array of arrays
 * of booleans, where both halves of the matrix are filled,
 * matrix[i][j] === matrix[j][i].
 */
const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
	const faces_polygon = make_faces_polygon({ vertices_coords, faces_vertices }, epsilon);
	for (let i = 0; i < faces_vertices.length - 1; i++) {
		for (let j = i + 1; j < faces_vertices.length; j++) {
			const overlap = math.core.overlap_convex_polygons(
				faces_polygon[i], faces_polygon[j], epsilon);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};

var overlap = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_edges_faces_overlap: make_edges_faces_overlap,
	make_faces_faces_overlap: make_faces_faces_overlap
});

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
const make_folded_strip_tacos = (folded_faces, is_circular, epsilon) => {
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
 * this is the output of having run "fold_strip_with_assignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} does a violation occur. "false" means all good.
 */
const validate_taco_tortilla_strip = (faces_folded, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
	// for every sector/face, the value is its index in the layers_face array
	const faces_layer = invert_map(layers_face);
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
const validate_taco_taco_face_pairs = (face_pair_stack) => {
	// create a copy of "stack" that removes single faces currently missing
	// their other pair partner. this removes boundary faces (with no adj. face)
	// as well as stacks which are in the process of being constructed but not
	// yet final
	const pair_stack = remove_single_instances(face_pair_stack);
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

const validate_layer_solver = (faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon) => {
	// if the strip contains "F" assignments, layers_face will contain
	// a mix of numbers and arrays of numbers, like: [1, 0, 5, [3, 4], 2]
	// as [3,4] are on the same "layer".
	// flatten this array so all numbers get pushed onto the top level, like:
	// [1, 0, 5, [3, 4], 2] into [1, 0, 5, 3, 4, 2].
	// now, this does create a layer preference between (3 and 4 in this example),
	// but in this specific use case we can be guaranteed that only one of those
	// will be used in the build_layers, as only one of a set of flat-
	// strip faces can exist in one taco stack location.
	const flat_layers_face = math.core.flatten_arrays(layers_face);
	// taco-tortilla intersections
	if (!validate_taco_tortilla_strip(
		faces_folded, layers_face, circ_and_done, epsilon
	)) { return false; }
	// taco-taco intersections
	for (let i = 0; i < taco_face_pairs.length; i++) {
		const pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
		if (!validate_taco_taco_face_pairs(pair_stack)) { return false; }
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
const assignments_to_faces_flip = (assignments) => {
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
const assignments_to_faces_vertical = (assignments) => {
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
const fold_strip_with_assignments = (faces, assignments) => {
	// one number for each sector, locally, the movement away from 0.
	const faces_end = assignments_to_faces_flip(assignments)
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

var fold_assignments = /*#__PURE__*/Object.freeze({
	__proto__: null,
	assignments_to_faces_flip: assignments_to_faces_flip,
	assignments_to_faces_vertical: assignments_to_faces_vertical,
	fold_strip_with_assignments: fold_strip_with_assignments
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
const single_vertex_solver = (ordered_scalars, assignments, epsilon = math.core.EPSILON) => {
	const faces_folded = fold_strip_with_assignments(ordered_scalars, assignments);
	const faces_updown = assignments_to_faces_vertical(assignments);
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
	const taco_face_pairs = make_folded_strip_tacos(faces_folded, is_circular, epsilon)
		.map(taco => [taco.left, taco.right]
			.map(invert_map)
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
		if (!validate_layer_solver(
			faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon
		)) {
			return [];
		}
		// just before exit.
		// the final crease must turn the correct direction back to the start.
		if (circ_and_done) {
			// next_dir is now indicating the direction from the final face to the
			// first face, test if this also matches the orientation of the faces.
			const faces_layer = invert_map(layers_face);
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
	return recurse().map(invert_map);
};

/**
 * Rabbit Ear (c) Kraft
 */

const make_vertex_faces_layer = ({
	vertices_faces, vertices_sectors, vertices_edges, edges_assignment
}, vertex, epsilon) => {
	// vertices_faces will contain "undefined" for sectors outside the boundary
	const faces = vertices_faces[vertex];
	// valid ranges might return multiple occurences, assume the longest
	// is the one we want. get that one.
	const range = get_longest_array(circular_array_valid_ranges(faces));
	if (range === undefined) { return; }
	// convert a range [start, end] into an array of indices, for example:
	// [4,1] into [4,5,6,7,0,1]
	while (range[1] < range[0]) { range[1] += faces.length; }
	const indices = Array
		.from(Array(range[1] - range[0] + 1))
		.map((_, i) => (range[0] + i) % faces.length);
	// use "indices" to get the sectors and assignments for the layer_solver
	const sectors = indices
		.map(i => vertices_sectors[vertex][i]);
	const assignments = indices
		.map(i => vertices_edges[vertex][i])
		.map(edge => edges_assignment[edge]);
	const sectors_layer = single_vertex_solver(sectors, assignments, epsilon);
	// sectors_layer gives us solutions relating the sectors to indices 0...n
	// relate these to the original faces, in 2 steps:
	// 1. map back to vertices_faces, due to valid_array (avoiding undefineds)
	// 2. map back to the faces in vertices_faces, instead of [0...n], a vertex's
	// faces will be anywhere in the graph. like [25, 56, 43, 19...]
	const faces_layer = sectors_layer
		.map(invert_map)
		.map(arr => arr
			.map(face => typeof face !== "object"
				? faces[indices[face]]
				: face.map(f => faces[indices[f]])))
		.map(invert_map);
	// send along the starting, this face is positioned with its normal upwards.
	faces_layer.face = faces[indices[0]];
	return faces_layer;
};

/**
 * @description flip a faces_layer solution to reflect having turned
 * over the origami.
 * @param {number[][]} an array of one or more faces_layer solutions
 */
const flip_solutions = solutions => {
	const face = solutions.face;
	const flipped = solutions
		.map(invert_map)
		.map(list => list.reverse())
		.map(invert_map);
	flipped.face = face;
	return flipped;
};
/**
 * @description compute the faces_layer solutions for every vertex in the
 * graph, taking into considering which face the solver began with each
 * time, and for faces which are upsidedown, flip those solutions also,
 * this way all notion of "above/below" are global, not local to a face
 * according to that face's normal.
 * @param {object} a FOLD graph
 * @param {number} this face will remain fixed
 * @param {number} epsilon, HIGHLY recommended, like: 0.001
 */
const make_vertices_faces_layer = (graph, start_face = 0, epsilon) => {
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = make_vertices_sectors(graph);
	}
	// root face, and all faces with the same color, will be false
	const faces_coloring = make_faces_winding(graph).map(c => !c);
	// the faces_layer solutions for every vertex and its adjacent faces
	const vertices_faces_layer = graph.vertices_sectors
		.map((_, vertex) => make_vertex_faces_layer(graph, vertex, epsilon));
	// is each face flipped or not? (should the result be flipped too.)
	// if this face is flipped in the graph, flip the solution too.
	const vertices_solutions_flip = vertices_faces_layer
		.map(solution => faces_coloring[solution.face]);
	return vertices_faces_layer
		.map((solutions, i) => vertices_solutions_flip[i]
			? flip_solutions(solutions)
			: solutions);
};

var faces_layer = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_vertex_faces_layer: make_vertex_faces_layer,
	make_vertices_faces_layer: make_vertices_faces_layer
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @returns {boolean[][]} a boolean matrix containing true/false for all,
 * except the diagonal [i][i] which contains undefined.
 */
const make_edges_edges_parallel = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => { // = math.core.EPSILON) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	const edge_count = edges_vector.length;
	const edges_edges_parallel = Array
		.from(Array(edge_count))
		.map(() => Array.from(Array(edge_count)));
	for (let i = 0; i < edge_count - 1; i++) {
		for (let j = i + 1; j < edge_count; j++) {
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
 * @description a subroutine for the two methods below.
 * given a matrix which was already worked on, consider only the true values,
 * compute the overlap_line_line method for each edge-pairs.
 * provide a comparison function (func) to specify inclusive/exclusivity.
 */
const overwrite_edges_overlaps = (matrix, vectors, origins, func, epsilon) => {
	// relationship between i and j is non-directional.
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			// if value is are already false, skip.
			if (!matrix[i][j]) { continue; }
			matrix[i][j] = math.core.overlap_line_line(
				vectors[i], origins[i],
				vectors[j], origins[j],
				func, func,
				epsilon);
			matrix[j][i] = matrix[i][j];
		}
	}
};
/**
 * @desecription find all edges which cross other edges. "cross" meaning
 * the segment overlaps the other segment, excluding the epsilon space
 * around the endpoints, and they are NOT parallel.
 */
const make_edges_edges_crossing = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// convert parallel into NOT parallel.
	const matrix = make_edges_edges_parallel({
		vertices_coords, edges_vertices, edges_vector
	}, epsilon)
		.map(row => row.map(b => !b));
	for (let i = 0; i < matrix.length; i++) {
		matrix[i][i] = undefined;
	}
	// if edges are parallel (not this value), skip.
	overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
	return matrix;
};
/**
 * @desecription find all edges which overlap one another, meaning
 * the segment overlaps the other segment and they ARE parallel.
 */
// todo, improvement suggestion:
// first grouping edges into categories with edges which share parallel-ness.
// then, express every edge's endpoints in terms of the length along
// the vector. converting it into 2 numbers, and now all you have to do is
// test if these two numbers overlap other edges' two numbers.
const make_edges_edges_parallel_overlap = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// start with edges-edges parallel matrix
	const matrix = make_edges_edges_parallel({
		vertices_coords, edges_vertices, edges_vector
	}, epsilon);
	// only if lines are parallel, then run the more expensive overlap method
	overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
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
	const overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon)
	const overlapping_edges = boolean_matrix_to_indexed_array(overlap_matrix);
	// each index will be an edge, each value is a group, starting with 0,
	// incrementing upwards. for all unique edges, array will be [0, 1, 2, 3...]
	// if edges 0 and 3 share a group, array will be [0, 1, 2, 0, 3...]
	const edges_group = make_unique_sets_from_self_relational_arrays(overlapping_edges);
	// gather groups, but remove groups with only one edge, and from the
	// remaining sets, remove any edges which lie on the boundary.
	// finally, remove sets with only one edge (after removing).
	return invert_map(edges_group)
		.filter(el => typeof el === "object")
		.map(edges => edges
			.filter(edge => graph.edges_faces[edge].length === 2))
		.filter(edges => edges.length > 1);
};
*/

var edges_edges = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_edges_edges_parallel: make_edges_edges_parallel,
	make_edges_edges_crossing: make_edges_edges_crossing,
	make_edges_edges_parallel_overlap: make_edges_edges_parallel_overlap
});

/**
 * Rabbit Ear (c) Kraft
 */
// import add_vertices_split_edges from "./add/add_vertices_split_edges";

var graph_methods = Object.assign(Object.create(null), {
	count,
	implied: implied_count,
	validate,
	clean,
	populate,
	remove: remove_geometry_indices,
	replace: replace_geometry_indices,
	remove_planar_vertex,
	remove_planar_edge,
	add_vertices,
	add_edges,
	split_edge,
	split_face: split_convex_face,
	flat_fold,
	add_planar_segment,
	assign,
	subgraph,
	clip,
	fragment,
	get_vertices_clusters,
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
	vertices_violations,
	edges_violations,
	vertices_collinear,
	faces_layer,
	edges_edges,
	vertices_coords_folded,
	face_spanning_tree,
	faces_matrix,
	faces_winding,
	explode_faces_methods,
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

const polygon_names = [
	null,
	null,
	null,
	"triangle",
	"square",
	"pentagon",
	"hexagon",
	"heptagon",
	"octagon",
	"nonagon",
	"decagon",
	"hendecagon",
	"dodecagon"
];
/**
 * create an array/object with only the keys and polygon names used below.
 */
polygon_names
	.map((str, i) => str === null ? i : undefined)
	.filter(a => a !== undefined)
	.forEach(i => delete polygon_names[i]);
/**
 * fill the "Create" object with constructors under polygon-named keys.
 */
/**
 * @description make vertices_coords for a regular polygon,
 * centered at the origin and with side lengths of 1,
 * except for unit_square, centered at [0.5, 0.5]
 * @param {number} number of sides of the desired regular polygon
 * @returns {number[][]} 2D vertices_coords, vertices of the polygon
 */
polygon_names.forEach((name, i) => {
	Create[name] = () => make_closed_polygon(math.core
		.make_regular_polygon_side_length(i));
});
/**
 * special cases
 *
 * square and rectangle are axis-aligned with one vertex at (0, 0)
 * circle asks for # of sides, and also sets radius to be 1,
 *  instead of side-length to be 1.
 */
Create.unit_square = () =>
	make_closed_polygon(make_rect_vertices_coords(1, 1));
Create.rectangle = (width = 1, height = 1) =>
	make_closed_polygon(make_rect_vertices_coords(width, height));
Create.circle = (sides = 90) =>
	make_closed_polygon(math.core.make_regular_polygon(sides));
// origami bases. todo: more
Create.kite = () => populate({
	vertices_coords: [[0,0], [Math.sqrt(2)-1,0], [1,0], [1,1-(Math.sqrt(2)-1)], [1,1], [0,1]],
	edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],
	edges_assignment: Array.from("BBBBBBVVF")
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
	graph: () => ({}),
	cp: Create.unit_square,
	origami: Create.unit_square,
};

/**
 * Calling the initializer also runs populate(), which does
 * take some computation time but it's very quick.
 */
Object.keys(ConstructorPrototypes).forEach(name => {
	ObjectConstructors[name] = function () {
		const argFolds = Array.from(arguments)
			.filter(a => fold_object_certainty(a))
			 // deep copy input graph
			.map(obj => JSON.parse(JSON.stringify(obj)));
		return populate(Object.assign(
			Object.create(ConstructorPrototypes[name]),
			(argFolds.length ? {} : default_graph[name]()),
			...argFolds,
			{ file_spec, file_creator }
		));
	};
	// tried to improve it. broke it.
	// ObjectConstructors[name] = function () {
	//   const certain = Array.from(arguments)
	//     .map(arg => ({ arg, certainty: fold_object_certainty(arg) }))
	//     .sort((a, b) => a.certainty - b.certainty);
	//   const fold = certain.length && certain[0].certainty > 0.1
	//     ? JSON.parse(JSON.stringify(certain.shift().arg))
	//     : default_graph[name]();
	//   console.log("FOLD", fold);
	//   // const otherArguments = certain
	//   //   .map(el => el.arg);
	//   // const argFold = Array.from(arguments)
	//   //   .map(arg => ({ arg, certainty: fold_object_certainty(arg) }))
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

/**
 * @typedef UDLine
 * @type {object}
 * @property {number[]} u - the line's normal vector
 * @property {number} d - the shortest distance from the origin to the line
 */

const intersection_ud = (line1, line2) => {
	const det = math.core.cross2(line1.u, line2.u);
	if (Math.abs(det) < math.core.EPSILON) { return undefined; }
	const x = line1.d * line2.u[1] - line2.d * line1.u[1];
	const y = line2.d * line1.u[0] - line1.d * line2.u[0];
	return [x / det, y / det];
};
/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UDLine} the line in {u, d} form
 */
const axiom1ud = (point1, point2) => {
	const u = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
	return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
};
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UDLine} the line in {u, d} form
 */
const axiom2ud = (point1, point2) => {
	const u = math.core.normalize2(math.core.subtract2(point2, point1));
	return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
};
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {UDLine} line1 one 2D line in {vector, origin} form
 * @param {UDLine} line2 one 2D line in {vector, origin} form
 * @returns {UDLine[]} an array of lines in {u, d} form
 */
const axiom3ud = (line1, line2) => {
	// if no intersect, lines are parallel, only one solution exists
	const intersect = intersection_ud(line1, line2);
	return intersect === undefined
		? [{ u: line1.u, d: (line1.d + line2.d * math.core.dot2(line1.u, line2.u)) / 2.0 }]
		: [math.core.add2, math.core.subtract2]
			.map(f => math.core.normalize2(f(line1.u, line2.u)))
			.map(u => ({ u, d: math.core.dot2(intersect, u) }));
};
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {UDLine} line one 2D line in {u, d} form
 * @param {number[]} point one 2D point
 * @returns {UDLine} the line in {u, d} form
 */
 const axiom4ud = (line, point) => {
	const u = math.core.rotate90(line.u);
	const d = math.core.dot2(point, u);
	return {u, d};
};
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {UDLine} line one 2D line in {u, d} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {UDLine[]} an array of lines in {u, d} form
 */
const axiom5ud = (line, point1, point2) => {
	const p1base = math.core.dot2(point1, line.u);
	const a = line.d - p1base;
	const c = math.core.distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = math.core.scale2(line.u, a);
	const base_center = math.core.add2(point1, a_vec);
	const base_vector = math.core.scale2(math.core.rotate90(line.u), b);
	// if b is near 0 we have one solution, otherwise two
	const mirrors = b < math.core.EPSILON
		? [base_center]
		: [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => math.core.normalize2(math.core.subtract2(point2, pt)))
		.map(u => ({ u, d: math.core.dot2(point1, u) }));
};

// cube root preserve sign
const cubrt = n => n < 0
	? -Math.pow(-n, 1/3)
	: Math.pow(n, 1/3);

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
		case 1: return [-d / c];
		case 2: {
			// quadratic
			let discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
			// no solution
			if (discriminant < -math.core.EPSILON) { return []; }
			// one solution
			let q1 = -c / (2.0 * b);
			if (discriminant < math.core.EPSILON) { return [q1]; }
			// two solutions
			let q2 = Math.sqrt(discriminant) / (2.0 * b);
			return [q1 + q2, q1 - q2];
		}
		case 3: {
			// cubic
			// Cardano's formula. convert to depressed cubic
			let a2 = b / a;
			let a1 = c / a;
			let a0 = d / a;
			let q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
			let r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
			let d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
			let u = -a2 / 3.0;
			// one solution
			if (d0 > 0.0) {
				let sqrt_d0 = Math.sqrt(d0);
				let s = cubrt(r + sqrt_d0);
				let t = cubrt(r - sqrt_d0);
				return [u + s + t];
			}
			// two solutions
			if (Math.abs(d0) < math.core.EPSILON) {
				let s = Math.pow(r, 1.0/3.0);
				// let S = cubrt(R);
				// instead of checking if S is NaN, check if R was negative
				// if (isNaN(S)) { break; }
				if (r < 0.0) { return []; }
				return [u + 2.0 * s, u - s];
			}
			// three solutions
			let sqrt_d0 = Math.sqrt(-d0);
			let phi = Math.atan2(sqrt_d0, r) / 3.0;
			let r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0/6.0);
			let s_r = r_s * Math.cos(phi);
			let s_i = r_s * Math.sin(phi);
			return [
				u + 2.0 * s_r,
				u - s_r - Math.sqrt(3.0) * s_i,
				u - s_r + Math.sqrt(3.0) * s_i
			];      
		}
		default: return [];
	}
};
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {UDLine} line1 one 2D line in {u, d} form
 * @param {UDLine} line2 one 2D line in {u, d} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {UDLine[]} an array of lines in {u, d} form
 */
const axiom6ud = (line1, line2, point1, point2) => {
	// at least pointA must not be on lineA
	// for some reason this epsilon is much higher than 1e-6
	if (Math.abs(1.0 - (math.core.dot2(line1.u, point1) / line1.d)) < 0.02) { return []; }
	// line vec is the first line's vector, along the line, not the normal
	const line_vec = math.core.rotate90(line1.u);
	const vec1 = math.core.subtract2(math.core.add2(point1, math.core.scale2(line1.u, line1.d)), math.core.scale2(point2, 2.0));
	const vec2 = math.core.subtract2(math.core.scale2(line1.u, line1.d), point1);
	const c1 = math.core.dot2(point2, line2.u) - line2.d;
	const c2 = 2.0 * math.core.dot2(vec2, line_vec);
	const c3 = math.core.dot2(vec2, vec2);
	const c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
	const c5 = math.core.dot2(vec1, vec2);
	const c6 = math.core.dot2(line_vec, line2.u);
	const c7 = math.core.dot2(vec2, line2.u);
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
		.map(n => math.core.add2(math.core.scale2(line1.u, line1.d), math.core.scale2(line_vec, n)))
		.map(p => ({ p, u: math.core.normalize2(math.core.subtract2(p, point1)) }))
		.map(el => ({ u: el.u, d: math.core.dot2(el.u, math.core.midpoint2(el.p, point1)) }));
};
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {UDLine} line1 one 2D line in {u, d} form,
 * the line the point will be brought onto.
 * @param {UDLine} line2 one 2D line in {u, d} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {UDLine | undefined} the line in {u, d} form
 * or undefined if the given lines are parallel
 */
const axiom7ud = (line1, line2, point) => {
	let u = math.core.rotate90(line1.u);
	let u_u = math.core.dot2(u, line2.u);
	// if u_u is close to 0, the two input lines are parallel, no solution
	if (Math.abs(u_u) < math.core.EPSILON) { return undefined; }
	let a = math.core.dot2(point, u);
	let b = math.core.dot2(point, line2.u);
	let d = (line2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
	return {u, d};
};

var AxiomsUD = /*#__PURE__*/Object.freeze({
	__proto__: null,
	axiom1ud: axiom1ud,
	axiom2ud: axiom2ud,
	axiom3ud: axiom3ud,
	axiom4ud: axiom4ud,
	axiom5ud: axiom5ud,
	axiom6ud: axiom6ud,
	axiom7ud: axiom7ud
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
 * @typedef VectorOriginLine
 * @type {object}
 * @property {number[]} vector - the line's direction vector
 * @property {number[]} origin - one point that intersects with the line
 */

/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {VectorOriginLine} the line in {vector, origin} form
 */
const axiom1 = (point1, point2) => ({
	vector: math.core.normalize2(math.core.subtract2(...math.core.resize_up(point2, point1))),
	origin: point1
});
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {VectorOriginLine} the line in {vector, origin} form
 */
const axiom2 = (point1, point2) => ({
	vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(point2, point1)))),
	origin: math.core.midpoint2(point1, point2)
});
// todo: make sure these all get a resize_up or whatever is necessary
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {VectorOriginLine} line1 one 2D line in {vector, origin} form
 * @param {VectorOriginLine} line2 one 2D line in {vector, origin} form
 * @returns {VectorOriginLine[]} an array of lines in {vector, origin} form
 */
const axiom3 = (line1, line2) => math.core.bisect_lines2(
	line1.vector, line1.origin, line2.vector, line2.origin
);
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {VectorOriginLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point
 * @returns {VectorOriginLine} the line in {vector, origin} form
 */
const axiom4 = (line, point) => ({
	vector: math.core.rotate90(math.core.normalize2(line.vector)),
	origin: point
});
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {VectorOriginLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {VectorOriginLine[]} an array of lines in {vector, origin} form
 */
const axiom5 = (line, point1, point2) => (math.core.intersect_circle_line(
		math.core.distance2(point1, point2),
		point1,
		line.vector,
		line.origin,
		math.core.include_l
	) || []).map(sect => ({
		vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(sect, point2)))),
		origin: math.core.midpoint2(point2, sect)
	}));
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {VectorOriginLine} line1 one 2D line in {vector, origin} form
 * @param {VectorOriginLine} line2 one 2D line in {vector, origin} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {VectorOriginLine[]} an array of lines in {vector, origin} form
 */
const axiom6 = (line1, line2, point1, point2) => axiom6ud(
	math.core.vector_origin_to_ud(line1),
	math.core.vector_origin_to_ud(line2),
	point1, point2).map(math.core.ud_to_vector_origin);
		// .map(Constructors.line);
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {VectorOriginLine} line1 one 2D line in {vector, origin} form,
 * the line the point will be brought onto.
 * @param {VectorOriginLine} line2 one 2D line in {vector, origin} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {VectorOriginLine | undefined} the line in {vector, origin} form
 * or undefined if the given lines are parallel
 */
const axiom7 = (line1, line2, point) => {
	const intersect = math.core.intersect_line_line(
		line1.vector, line1.origin,
		line2.vector, point,
		math.core.include_l, math.core.include_l);
	return intersect === undefined
		? undefined
		: ({//Constructors.line(
// todo: switch this out, but test it as you do
				vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(intersect, point)))),
				// vector: math.core.normalize2(math.core.rotate90(line2.vector)),
				origin: math.core.midpoint2(point, intersect)
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
 * Rabbit Ear (c) Kraft
 */

const reflect_point = (foldLine, point) => {
	const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
	return math.core.multiply_matrix2_vector2(matrix, point);
};
/**
 * All test methods follow the same format
 *
 * @param {object} the same parameter object passed to axioms method,
 *  it includes a "points" or "lines" key with array of values
 * @param {number[][]} an array of points, and points are arrays of numbers
 * @returns {boolean[]} array of true/false, array indices match the return
 *  values from the axioms method.
 */

/**
 * @description axiom 1 and 2, check input points, if they are both
 * inside the boundary polygon, the solution is valid.
 */
const validate_axiom1_2 = (params, boundary) => [params.points
	.map(p => math.core.overlap_convex_polygon_point(boundary, p, math.core.include))
	.reduce((a, b) => a && b, true)];

const validate_axiom3 = (params, boundary, results) => {
	const segments = params.lines.map(line => math.core
		.clip_line_in_convex_polygon(boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.include_l));
	// if line parameters lie outside polygon, no solution possible
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	if (!results) {
		results = axiom3(params.lines[0], params.lines[1]);
	}
	// test A:
	// make sure the results themselves lie in the polygon
	// exclusive! an exterior line collinear to polygon's point is excluded
	// const results_clip = results
	//   .map(line => line === undefined ? undefined : math.core
	//     .intersect_convex_polygon_line(
	//       boundary,
	//       line.vector,
	//       line.origin,
	//       math.core.include_s,
	//       math.core.exclude_l));
	const results_clip = results
		.map(line => line === undefined ? undefined : math.core
		.clip_line_in_convex_polygon(
			boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.include_l));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	// test B:
	// make sure that for each of the results, the result lies between two
	// of the parameters, in other words, reflect the segment 0 both ways
	// (both fold solutions) and make sure there is overlap with segment 1
	const seg0Reflect = results
		.map((foldLine, i) => foldLine === undefined ? undefined : [
			reflect_point(foldLine, segments[0][0]),
			reflect_point(foldLine, segments[0][1])
		]);
	const reflectMatch = seg0Reflect
		.map((seg, i) => seg === undefined ? false : (
			math.core.overlap_line_point(math.core
				.subtract(segments[1][1], segments[1][0]),
				segments[1][0], seg[0], math.core.include_s) ||
			math.core.overlap_line_point(math.core
				.subtract(segments[1][1], segments[1][0]),
				segments[1][0], seg[1], math.core.include_s) ||
			math.core.overlap_line_point(math.core
				.subtract(seg[1], seg[0]), seg[0],
				segments[1][0], math.core.include_s) ||
			math.core.overlap_line_point(math.core
				.subtract(seg[1], seg[0]), seg[0],
				segments[1][1], math.core.include_s)
		));
	// valid if A and B
	return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};

const validate_axiom4 = (params, boundary) => {
	const intersect = math.core.intersect_line_line(
		params.lines[0].vector, params.lines[0].origin,
		math.core.rotate90(params.lines[0].vector), params.points[0],
		math.core.include_l, math.core.include_l);
	return [
		[params.points[0], intersect]
			.filter(a => a !== undefined)
			.map(p => math.core.overlap_convex_polygon_point(boundary, p, math.core.include))
			.reduce((a, b) => a && b, true)
	];
};

const validate_axiom5 = (params, boundary, results) => {
	if (!results) {
		results = axiom5(params.lines[0], params.points[0], params.points[1]);
	}
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	const testReflections = results
		.map(foldLine => reflect_point(foldLine, params.points[1]))
		.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
	return testReflections.map(ref => ref && testParamPoints);
};

const validate_axiom6 = function (params, boundary, results) {
	if (!results) {
		results = axiom6(
			params.lines[0], params.lines[1],
			params.points[0], params.points[1]);
	}
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return results.map(() => false); }
	const testReflect0 = results
		.map(foldLine => reflect_point(foldLine, params.points[0]))
		.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
	const testReflect1 = results
		.map(foldLine => reflect_point(foldLine, params.points[1]))
		.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
	return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};

const validate_axiom7 = (params, boundary, result) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = math.core
		.overlap_convex_polygon_point(boundary, params.points[0], math.core.include);
	// check if the reflected point on the fold line is inside the polygon
	if (!result) {
		result = axiom7(params.lines[1], params.lines[0], params.points[0]);
	}
	if (result === undefined) { return [false]; }
	const reflected = reflect_point(result, params.points[0]);
	const reflectTest = math.core.overlap_convex_polygon_point(boundary, reflected, math.core.include);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (math.core.intersect_convex_polygon_line(boundary,
		params.lines[1].vector,
		params.lines[1].origin,
		math.core.include_s,
		math.core.include_l) !== undefined);
	return [paramPointTest && reflectTest && paramLineTest];
};

const validate_axiom_funcs = [null,
	validate_axiom1_2,
	validate_axiom1_2,
	validate_axiom3,
	validate_axiom4,
	validate_axiom5,
	validate_axiom6,
	validate_axiom7,
];
delete validate_axiom_funcs[0];

// todo: get boundary needs support for multiple boundaries
const validate_axiom = (number, params, obj, solutions) => {
	const boundary = (typeof obj === "object" && obj.vertices_coords)
		? get_boundary(obj).vertices.map(v => obj.vertices_coords[v])
		: obj;
	return validate_axiom_funcs[number](params, boundary, solutions);
};

Object.keys(validate_axiom_funcs).forEach(number => {
	validate_axiom[number] = (...args) => validate_axiom(number, ...args);
});

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description the core axiom methods return arrays for *some* of
 * the axioms.
 * @param {number} the axiom number
 * @returns {boolean} true false, does the core method return an array?
 */
const axiom_returns_array = (number) => {
	switch (number) {
		case 3: case "3":
		case 5: case "5":
		case 6: case "6": return true;
		default: return false;
	}
};

const check_params = (params) => ({
	points: (params.points || []).map(p => math.core.get_vector(p)),
	lines: (params.lines || []).map(l => math.core.get_line(l)),
	lines_ud: (params.lines || [])
		.map(l => l.u !== undefined && l.d !== undefined ? l : undefined)
		.filter(a => a !== undefined)
});
const axiom_vector_origin = (number, params) => {
	const result = AxiomsVO[`axiom${number}`](...params.lines, ...params.points);
	const array_results = axiom_returns_array(number)
		? result
		: [result].filter(a => a !== undefined);
	return array_results.map(line => math.line(line));
};
const axiom_normal_distance = (number, params) => {
	const result = AxiomsUD[`axiom${number}ud`](...params.lines_ud, ...params.points);
	const array_results = axiom_returns_array(number)
		? result
		: [result].filter(a => a !== undefined);
	return array_results.map(line => math.line.ud(line));
};


/**
 * @description compute the axiom given a set of parameters, and depending
 * on the parameters, use the axioms-u-d methods which parameterize lines
 * in u-d form, otherwise use the methods on vector-origin lines.
 * @param {number} the axiom number 1-7
 * @param {object} axiom parameters
 * @returns {line[]} array of lines
 */


 // here's the problem. the mismatch between what gets recalculated inside the boundary test and here.
const axiom_boundaryless = (number, params) => {
	return params.lines_ud.length === params.lines.length
		? axiom_normal_distance(number, params)
		: axiom_vector_origin(number, params);
};

const filter_with_boundary = (number, params, solutions, boundary) => {
	if (boundary == null) { return; }
	validate_axiom(number, params, boundary, solutions)
		.forEach((valid, i) => { if (!valid) { delete solutions[i]; } });
};
/**
 * The point and line parameter object passed into the axioms function.
 * @typedef {object} AxiomParams
 * @property {Array} lines an array of all lines
 * @property {Array} points an array of all points
 */

/**
 * @description seven origami axioms
 * @param {number} number the axiom number, 1-7
 * @param {AxiomParams} params the origami axiom parameters, lines and points, in one object.
 * @param {number[][]} [boundary] the optional boundary, including this will exclude results that lie outside.
 * @returns {Line[]} an array of solutions as lines, or an empty array if no solutions.
 */
const axiom = (number, params = {}, boundary) => {
	const parameters = check_params(params);
	const solutions = axiom_boundaryless(number, parameters);
	filter_with_boundary(number, parameters, solutions, boundary);
	return solutions;
};

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsUD).forEach(key => { axiom[key] = AxiomsUD[key]; });

[1, 2, 3, 4, 5, 6, 7].forEach(number => {
	axiom[number] = (...args) => axiom(number, ...args);
});

// probably move this to axioms/index
axiom.validate = validate_axiom;

/**
 * Rabbit Ear (c) Kraft
 */

const line_line_for_arrows = (a, b) => math.core.intersect_line_line(
	a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l
);

const diagram_reflect_point = (foldLine, point) => {
	const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
	return math.core.multiply_matrix2_vector2(matrix, point);
};

const boundary_for_arrows = ({ vertices_coords }) => math.core
	.convex_hull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows(graph);
	if (point === undefined) {
		const foldSegment = math.core.clip_line_in_convex_polygon(boundary,
			foldLine.vector,
			foldLine.origin,
			math.core.exclude,
			math.core.include_l);
		point = math.core.midpoint(...foldSegment);
	}
	const perpVector = math.core.rotate270(foldLine.vector);
	const smallest = math.core
		.clip_line_in_convex_polygon(boundary,
			perpVector,
			point,
			math.core.exclude,
			math.core.include_l)
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
	const a1 = paramRays.filter(ray =>
		math.core.dot(ray.vector, foldLine.vector) > 0 &&
		math.core.cross2(ray.vector, foldLine.vector) > 0
	).shift();
	const a2 = paramRays.filter(ray =>
		math.core.dot(ray.vector, foldLine.vector) > 0 &&
		math.core.cross2(ray.vector, foldLine.vector) < 0
	).shift();
	const b1 = paramRays.filter(ray =>
		math.core.dot(ray.vector, foldLine.vector) < 0 &&
		math.core.cross2(ray.vector, foldLine.vector) > 0
	).shift();
	const b2 = paramRays.filter(ray =>
		math.core.dot(ray.vector, foldLine.vector) < 0 &&
		math.core.cross2(ray.vector, foldLine.vector) < 0
	).shift();
	const rayEndpoints = [a1, a2, b1, b2].map(ray => math.core
		.intersect_convex_polygon_line(boundary, ray.vector, ray.origin, math.core.exclude_s, math.core.exclude_r)
		.shift()
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
		math.segment(arrowStart2, arrowEnd2)
	];
};

const axiom_1_arrows = (params, graph) => axiom(1, params)
	.map(foldLine => [widest_perp(graph, foldLine)]);

const axiom_2_arrows = params => [
	[math.segment(params.points)]
];

const axiom_3_arrows = (params, graph) => {
	const boundary = boundary_for_arrows(graph);
	const segs = params.lines.map(l => math.core
		.clip_line_in_convex_polygon(boundary,
			l.vector,
			l.origin,
			math.core.exclude,
			math.core.include_l));
	const segVecs = segs.map(seg => math.core.subtract(seg[1], seg[0]));
	const intersect = math.core.intersect_line_line(
		segVecs[0], segs[0][0], segVecs[1], segs[1][0],
		math.core.exclude_s, math.core.exclude_s);
	return !intersect
		? [between_2_segments(params, segs, axiom(3, params)
			.filter(a => a !== undefined).shift())]
		: axiom(3, params).map(foldLine => between_2_intersecting_segments(
				params, intersect, foldLine, boundary
			));
};

const axiom_4_arrows = (params, graph) => axiom(4, params)
	.map(foldLine => [widest_perp(
		graph,
		foldLine,
		line_line_for_arrows(foldLine, params.lines[0])
	)]);

const axiom_5_arrows = (params) => axiom(5, params)
	.map(foldLine => [math.segment(
		params.points[1],
		diagram_reflect_point(foldLine, params.points[1])
	)]);

const axiom_6_arrows = (params) => axiom(6, params)
	.map(foldLine => params.points
		.map(pt => math.segment(pt, diagram_reflect_point(foldLine, pt))));

const axiom_7_arrows = (params, graph) => axiom(7, params)
	.map(foldLine => [
		math.segment(params.points[0], diagram_reflect_point(foldLine, params.points[0])),
		widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))
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

const axiom_arrows = (number, params = {}, ...args) => {
	const points = params.points
		? params.points.map(p => math.core.get_vector(p))
		: undefined;
	const lines = params.lines
		? params.lines.map(l => math.core.get_line(l))
		: undefined;
	return arrow_functions[number]({ points, lines }, ...args);
};

Object.keys(arrow_functions).forEach(number => {
	axiom_arrows[number] = (...args) => axiom_arrows(number, ...args);
});

/**
 * Rabbit Ear (c) Kraft
 */

const widest_perpendicular = (polygon, foldLine, point) => {
	if (point === undefined) {
		const foldSegment = math.core.clip_line_in_convex_polygon(polygon,
			foldLine.vector,
			foldLine.origin,
			math.core.exclude,
			math.core.include_l);
		if (foldSegment === undefined) { return; }
		point = math.core.midpoint(...foldSegment);
	}
	const perpVector = math.core.rotate90(foldLine.vector);
	const smallest = math.core
		.clip_line_in_convex_polygon(polygon,
			perpVector,
			point,
			math.core.exclude,
			math.core.include_l)
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
const simple_arrow = (graph, line) => {
	const hull = math.core.convex_hull(graph.vertices_coords);
	const box = math.core.bounding_box(hull);
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

var diagram = Object.assign(Object.create(null),
	// arrows, {
	{
	axiom_arrows,
	simple_arrow,
});

/**
 * Rabbit Ear (c) Kraft
 */

const make_tortilla_tortilla_edges_crossing = (graph, edges_faces_side, epsilon) => {
	// get all tortilla edges. could also be done by searching
	// "edges_assignment" for all instances of F/f. perhaps this way is better.
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => bool ? i : undefined)
		.filter(a => a !== undefined);
	// get all edges which cross these tortilla edges. these edges can even be
	// boundary edges, it doesn't matter how many adjacent faces they have.
	const edges_crossing_matrix = make_edges_edges_crossing(graph, epsilon);
	const edges_crossing = boolean_matrix_to_indexed_array(edges_crossing_matrix);
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

const make_tortillas_faces_crossing = (graph, edges_faces_side, epsilon) => {
	const faces_winding = make_faces_winding(graph);
	const faces_polygon = make_faces_polygon(graph, epsilon);
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
		// 	.map((poly, f) => math.core.clip_line_in_convex_polygon(
		// 		poly,
		// 		edges_vector[ei],
		// 		edges_coords[ei][0],
		// 		math.core.exclude,
		// 		math.core.exclude_s,
		// 		epsilon))));
	const result = tortilla_edge_indices
		.map((e, ei) => faces_polygon
			.map((poly, f) => math.core.clip_line_in_convex_polygon(
				poly,
				edges_vector[ei],
				edges_coords[ei][0],
				math.core.exclude,
				math.core.exclude_s,
				epsilon))
			.map((result, f) => result !== undefined));
	// const result = tortilla_edge_indices
	// 	.map((e, ei) => faces_polygon
	// 		.map((poly, f) => math.core.intersect_convex_polygon_line(
	// 			poly,
	// 			edges_vector[ei],
	// 			edges_coords[ei][0],
	// 			math.core.exclude_s,
	// 			math.core.include_l ))
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

const make_tortilla_tortilla_faces_crossing = (graph, edges_faces_side, epsilon) => {
	make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon);
	// console.log("tortilla_tortilla_edges", tortilla_tortilla_edges);
	const tortillas_faces_crossing = make_tortillas_faces_crossing(graph, edges_faces_side, epsilon);
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

var tortilla_tortilla = /*#__PURE__*/Object.freeze({
	__proto__: null,
	make_tortilla_tortilla_edges_crossing: make_tortilla_tortilla_edges_crossing,
	make_tortillas_faces_crossing: make_tortillas_faces_crossing,
	make_tortilla_tortilla_faces_crossing: make_tortilla_tortilla_faces_crossing
});

/**
 * Rabbit Ear (c) Kraft
 */

const make_edges_faces_side = (graph, faces_center) => {
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
const make_tacos_faces_side = (graph, faces_center, tacos_edges, tacos_faces) => {
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
 *
 * due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
 */
const make_tacos_tortillas = (graph, epsilon = math.core.EPSILON) => {
	// given a graph which is already in its folded state,
	// find which edges are tacos, or in other words, find out which
	// edges overlap with another edge.
	const faces_center = make_faces_center(graph);
	const edges_faces_side = make_edges_faces_side(graph, faces_center);
	// for every edge, find all other edges which are parallel to this edge and
	// overlap the edge, excluding the epsilon space around the endpoints.
	const edge_edge_overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon);
	// convert this matrix into unique pairs ([4, 9] but not [9, 4])
	// thse pairs are also sorted such that the smaller index is first.
	const tacos_edges = boolean_matrix_to_unique_index_pairs(edge_edge_overlap_matrix)
		.filter(pair => pair
			.map(edge => graph.edges_faces[edge].length > 1)
			.reduce((a, b) => a && b, true));
	const tacos_faces = tacos_edges
		.map(pair => pair
			.map(edge => graph.edges_faces[edge]));
	// convert every face into a +1 or -1 based on which side of the edge is it on.
	// ie: tacos will have similar numbers, tortillas will have one of either.
	// the +1/-1 is determined by the cross product to the vector of the edge.
	const tacos_faces_side = make_tacos_faces_side(graph, faces_center, tacos_edges, tacos_faces);
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
	const tortilla_tortilla_crossing = make_tortilla_tortilla_faces_crossing(graph, edges_faces_side, epsilon);
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
	const edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
	const edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap)
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
 * @returns {number[][]} list of arrays containing three face indices.
 */
const make_transitivity_trios = (graph, overlap_matrix, faces_winding, epsilon = math.core.EPSILON) => {
	if (!overlap_matrix) {
		overlap_matrix = make_faces_faces_overlap(graph, epsilon);
	}
	if (!faces_winding) {
		faces_winding = make_faces_winding(graph);
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
			const polygon = math.core.intersect_polygon_polygon(polygons[i], polygons[j], epsilon);
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
				const polygon = math.core.intersect_polygon_polygon(matrix[i][j], polygons[k], epsilon);
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
const filter_transitivity = (transitivity_trios, tacos_tortillas) => {
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
const unsigned_to_signed_conditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_signed_layer_convert[conditions[key]];
	});
	return conditions;
};

const signed_to_unsigned_conditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_unsigned_layer_convert[conditions[key]];
	});
	return conditions;
};

var general_global_solver = /*#__PURE__*/Object.freeze({
	__proto__: null,
	unsigned_to_signed_conditions: unsigned_to_signed_conditions,
	signed_to_unsigned_conditions: signed_to_unsigned_conditions
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

const make_taco_maps = (tacos_tortillas, transitivity_trios) => {
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
const make_conditions = (graph, overlap_matrix, faces_winding) => {
	if (!faces_winding) {
		faces_winding = make_faces_winding(graph);
	}
	if (!overlap_matrix) {
		overlap_matrix = make_faces_faces_overlap(graph);
	}
	const conditions = {};
	// flip 1 and 2 to be the other, leaving 0 to be 0.
	const flip_condition = { 0:0, 1:2, 2:1 };
	// set all conditions (every pair of overlapping faces) initially to 0
	boolean_matrix_to_unique_index_pairs(overlap_matrix)
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

const complete_suggestions_loop = (layers, maps, conditions, pair_layer_map) => {
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
 */
const hashCode = (string) => {
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
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

const solver_single = (graph, maps, conditions) => {
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



	if (!complete_suggestions_loop(layers, maps, conditions, pair_layer_map)) {
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
					if (!complete_suggestions_loop(clone_layers, maps, clone_conditions, pair_layer_map)) {
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
	unsigned_to_signed_conditions(solution);

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

const recursive_solver = (graph, maps, conditions_start) => {
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
					if (!complete_suggestions_loop(clone_layers, maps, clone_conditions, pair_layer_map)) {
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
	if (!complete_suggestions_loop(layers_start, maps, conditions_start, pair_layer_map)) {
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
		unsigned_to_signed_conditions(solutions[i]);
	}
	// unsigned_to_signed_conditions(solutions.certain);
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
const dividing_axis = (graph, line, conditions) => {
	const faces_side = make_faces_center_quick(graph)
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

const make_maps_and_conditions = (graph, epsilon = 1e-6) => {
	const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
	const faces_winding = make_faces_winding(graph);
	// conditions encodes every pair of overlapping faces as a space-separated
	// string, low index first, as the keys of an object.
	// initialize all values to 0, but set neighbor faces to either 1 or 2.
	const conditions = make_conditions(graph, overlap_matrix, faces_winding);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
	const unfiltered_trios = make_transitivity_trios(graph, overlap_matrix, faces_winding, epsilon);
	const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
	// console.log("overlap_matrix", overlap_matrix);
	// console.log("faces_winding", faces_winding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("maps", maps);
	// console.log("conditions", conditions);
	return { maps, conditions };
};

const one_layer_conditions = (graph, epsilon = 1e-6) => {
	const data = make_maps_and_conditions(graph, epsilon);
	const solutions = solver_single(graph, data.maps, data.conditions);
	return solutions;
};

const all_layer_conditions = (graph, epsilon = 1e-6) => {
	const data = make_maps_and_conditions(graph, epsilon);
	const solutions = recursive_solver(graph, data.maps, data.conditions);
	solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
	return solutions;
};


const make_maps_and_conditions_dividing_axis = (folded, cp, line, epsilon = 1e-6) => {
	const overlap_matrix = make_faces_faces_overlap(folded, epsilon);
	const faces_winding = make_faces_winding(folded);
	const conditions = make_conditions(folded, overlap_matrix, faces_winding);
	dividing_axis(cp, line, conditions);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = make_tacos_tortillas(folded, epsilon);
	const unfiltered_trios = make_transitivity_trios(folded, overlap_matrix, faces_winding, epsilon);
	const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
	return { maps, conditions };
};

const one_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
	const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
	const solutions = solver_single(folded, data.maps, data.conditions);
	return solutions;
};

const all_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
	const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
	const solutions = recursive_solver(folded, data.maps, data.conditions);
	solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
	return solutions;
};

var global_layer_solvers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	one_layer_conditions: one_layer_conditions,
	all_layer_conditions: all_layer_conditions,
	one_layer_conditions_with_axis: one_layer_conditions_with_axis,
	all_layer_conditions_with_axis: all_layer_conditions_with_axis
});

/**
 * Rabbit Ear (c) Kraft
 */
const topological_order = (conditions, graph) => {
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
 * @param {object} a FOLD object, make sure the vertices
 * have already been folded.
 */
const make_faces_layer = (graph, epsilon) => {
	const conditions = one_layer_conditions(graph, epsilon);
	return invert_map(topological_order(conditions, graph));
};

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description for a flat-foldable origami, this will return
 * all of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} a FOLD object, make sure the vertices
 * have already been folded.
 */
const make_faces_layers = (graph, epsilon) => {
	return all_layer_conditions(graph, epsilon)
		.map(conditions => topological_order(conditions, graph))
		.map(invert_map);
};

/**
 * Rabbit Ear (c) Kraft
 */

const flip_faces_layer = faces_layer => invert_map(
	invert_map(faces_layer).reverse()
);

/**
 * Rabbit Ear (c) Kraft
 */

const faces_layer_to_edges_assignments = (graph, faces_layer) => {
	const edges_assignment = [];
	const faces_winding = make_faces_winding(graph);
	// set boundary creases
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: make_edges_faces(graph);
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
//   const faces_winding = make_faces_winding(graph);
//   // set boundary creases
//   const edges_faces = graph.edges_faces
//     ? graph.edges_faces
//     : make_edges_faces(graph);
//  
//   return edges_assignment;
// };

var edges_assignments = /*#__PURE__*/Object.freeze({
	__proto__: null,
	faces_layer_to_edges_assignments: faces_layer_to_edges_assignments
});

/**
 * Rabbit Ear (c) Kraft
 */
// todo: is it okay to remove the filter?
const conditions_to_matrix = (conditions) => {
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
const get_unassigned_indices = (edges_assignment) => edges_assignment
	.map((_, i) => i)
	.filter(i => edges_assignment[i] === "U" || edges_assignment[i] === "u");

// sectors and assignments are fenceposted.
// sectors[i] is bounded by assignment[i] assignment[i + 1]
const maekawa_assignments = (vertices_edges_assignments) => {
	const unassigneds = get_unassigned_indices(vertices_edges_assignments);
	const permuts = Array.from(Array(2 ** unassigneds.length))
		.map((_, i) => i.toString(2))
		.map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
		.map(str => Array.from(str).map(l => l === "0" ? "V" : "M"));
	const all = permuts.map(perm => {
		const array = vertices_edges_assignments.slice();
		unassigneds.forEach((index, i) => { array[index] = perm[i]; });
		return array;
	});
	if (vertices_edges_assignments.includes("B") ||
		vertices_edges_assignments.includes("b")) {
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
const assignment_solver = (faces, assignments, epsilon) => {
	if (assignments == null) {
		assignments = faces.map(() => "U");
	}
	// enumerate all possible assignments by replacing "U" with both "M" and "V"
	const all_assignments = maekawa_assignments(assignments);
	const layers = all_assignments
		.map(assigns => single_vertex_solver(faces, assigns, epsilon));
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

var layer = Object.assign(Object.create(null), {
	make_faces_layer,
	make_faces_layers,
	flip_faces_layer,

	assignment_solver,
	single_vertex_solver,
	validate_layer_solver,
	validate_taco_taco_face_pairs,
	validate_taco_tortilla_strip,

	table: slow_lookup,
	make_conditions,
	dividing_axis,
	topological_order,
	conditions_to_matrix,

	make_tacos_tortillas,
	make_folded_strip_tacos,
	make_transitivity_trios,
},
	global_layer_solvers,
	general_global_solver,
	edges_assignments,
	tortilla_tortilla,
	fold_assignments,
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
};

/**
 * this only works for degree-4 vertices
 */
const single_vertex_fold_angles = (sectors, assignments, t = 0) => {
	const odd = odd_assignment(assignments);
	if (odd === undefined) { return; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];
	
	//const pab = (odd + 2) % sectors.length;
	//const pbc = (odd + 3) % sectors.length;
	const pbc = Math.PI * t;

	const cosE = -Math.cos(a)*Math.cos(b) + Math.sin(a)*Math.sin(b)*Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc) - ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))/(1 - cosE);

	const pab = -Math.acos(res) + Math.PI;
	return odd % 2 === 0
		? [pab, pbc, pab, pbc].map((n, i) => odd === i ? -n : n)
		: [pbc, pab, pbc, pab].map((n, i) => odd === i ? -n : n);
};

/**
 * Rabbit Ear (c) Kraft
 */

// todo: this is doing too much work in preparation
const kawasaki_solutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
	// to calculate Kawasaki's theorem, we need the 3 edges
	// as vectors, and we need them sorted radially.
	if (!edges_vectors) {
		edges_vectors = make_edges_vector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
	}
	const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
	const sortedVectors = math.core.counter_clockwise_order2(vectors)
		.map(i => vectors[i]);
	return kawasaki_solutions_vectors(sortedVectors);
};

var kawasaki_graph = /*#__PURE__*/Object.freeze({
	__proto__: null,
	kawasaki_solutions: kawasaki_solutions
});

/**
 * Rabbit Ear (c) Kraft
 */

var vertex = Object.assign(Object.create(null), {
	maekawa_assignments,
	fold_angles4: single_vertex_fold_angles,
},
	kawasaki_math,
	kawasaki_graph,
	validate_single_vertex,
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
var en$1 = [
	null,
	"fold a line through two points",
	"fold two points together",
	"fold two lines together",
	"fold a line on top of itself, creasing through a point",
	"fold a point to a line, creasing through another point",
	"fold a point to a line and another point to another line",
	"fold a point to a line and another line onto itself"
];
var es$1 = [
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
var zh$1 = [
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
	en: en$1,
	es: es$1,
	fr: fr,
	hi: hi,
	jp: jp,
	ko: ko,
	ms: ms,
	pt: pt,
	ru: ru,
	tr: tr,
	vi: vi,
	zh: zh$1
};

var es = {
	fold: {
		verb: "",
		noun: "doblez"
	},
	valley: "doblez de valle",
	mountain: "doblez de montaña",
	inside: "",
	outside: "",
	open: "",
	closed: "",
	rabbit: "",
	rabbit2: "",
	petal: "",
	squash: "",
	flip: "dale la vuelta a tu papel"
};
var en = {
	fold: {
		verb: "fold",
		noun: "crease"
	},
	valley: "valley fold",
	mountain: "mountain fold",
	inside: "inside reverse fold",
	outside: "outside reverse fold",
	open: "open sink",
	closed: "closed sink",
	rabbit: "rabbit ear fold",
	rabbit2: "double rabbit ear fold",
	petal: "petal fold",
	squash: "squash fold",
	flip: "flip over"
};
var zh = {
	fold: {
		verb: "",
		noun: ""
	},
	valley: "谷摺",
	mountain: "山摺",
	inside: "內中割摺",
	outside: "外中割摺",
	open: "開放式沉壓摺",
	closed: "封閉式沉壓摺",
	rabbit: "兔耳摺",
	rabbit2: "雙兔耳摺",
	petal: "花瓣摺",
	blintz: "坐墊基",
	squash: "壓摺",
	flip: ""
};
var folds = {
	es: es,
	en: en,
	zh: zh
};

/**
 * Rabbit Ear (c) Kraft
 */

var text = {
	axioms,
	folds,
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

const vertices_circle = (graph, attributes = {}) => {
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
 * @typedef EdgesAssignmentIndices
 * @type {object}
 * @property {number[]} b - boundary edge indices
 * @property {number[]} m - mountain edge indices
 * @property {number[]} v - valley edge indices
 * @property {number[]} f - flat edge indices
 * @property {number[]} u - unassigned edge indices
 */

/**
 * @returns {EdgesAssignmentIndices} an object with 5 keys, each value is an array 
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 * if no edges_assignment, or only some defined, remaining edges become "unassigned"
 */
const edges_assignment_indices = (graph) => {
	const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
	const lowercase_assignment = graph[_edges_assignment]
		.map(a => edges_assignment_to_lowercase[a]);
	graph[_edges_vertices]
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
	return assignment_indices;
};

const edges_coords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
/**
 * a segment is a line segment in the form: [[x1, y1], [x2, y2]]
 */
const segment_to_path = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;

const edges_path_data = (graph) => edges_coords(graph)
	.map(segment => segment_to_path(segment)).join("");

const edges_path_data_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edges_path_data({ vertices_coords, edges_vertices }) });
	}
	// const segments = edges_coords({ vertices_coords, edges_vertices, edges_assignment });
	const data = edges_assignment_indices({ vertices_coords, edges_vertices, edges_assignment });
	// replace each value in data from array of indices [1,2,3] to path string "M2,3L2.."
	Object.keys(data).forEach(key => {
		data[key] = edges_path_data({
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
 * replace edges_path_data_assign values from path strings "M2,3L.." to <path> elements
 */
const edges_paths_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edges_path_data_assign({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(assignment => {
		const path = root.svg.path(data[assignment]);
		path.setAttributeNS(null, _class, edges_assignment_names[assignment]);
		data[assignment] = path;
	});
	return data;
};

const apply_style$2 = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
const edges_paths = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = is_folded_form(graph);
	const paths = edges_paths_assign(graph);
	Object.keys(paths).forEach(key => {
		paths[key].setAttributeNS(null, _class, edges_assignment_names[key]);
		apply_style$2(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
		apply_style$2(paths[key], attributes[key]);
		apply_style$2(paths[key], attributes[edges_assignment_names[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edges_assignment_names[key], { get: () => paths[key] });
	});
	apply_style$2(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	// todo: everything else that isn't a class name. filter out classes
	// const no_class_attributes = Object.keys(attributes).filter(
	apply_style$2(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};

const angle_to_opacity = (foldAngle) => (Math.abs(foldAngle) / 180);

const edges_lines = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = is_folded_form(graph);
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: make_edges_assignment(graph))
		.map(assign => edges_assignment_to_lowercase[assign]);
	const groups_by_key = {};
	["b", "m", "v", "f", "u"].forEach(k => {
		const child_group = root.svg.g();
		group.appendChild(child_group);
		child_group.setAttributeNS(null, _class, edges_assignment_names[k]);
		apply_style$2(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
		apply_style$2(child_group, attributes[edges_assignment_names[k]]);
		Object.defineProperty(group, edges_assignment_names[k], {
			get: () => child_group
		});
		groups_by_key[k] = child_group;
	});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => root.svg.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return;}
			line.setAttributeNS(null, "opacity", angle_to_opacity(angle));
		});
	}
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));

	apply_style$2(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	apply_style$2(group, attributes.stroke ? { stroke: attributes.stroke } : {});

	return group;
};

const draw_edges = (graph, attributes) => edges_foldAngle_all_flat(graph)
	? edges_paths(graph, attributes)
	: edges_lines(graph, attributes);

// const make_edges_assignment_names = ({ edges_vertices, edges_assignment }) => {
// 	if (!edges_vertices) { return []; }
// 	if (!edges_assignment) { return edges_vertices.map(() => edges_assignment_names["u"]); }
// 	return edges_vertices
// 		.map((_, i) => edges_assignment[i])
// 		.map((a) => edges_assignment_names[(a ? a : "u")]);
// };

// const edges_lines = ({ vertices_coords, edges_vertices, edges_assignment }) => {
// 	if (!vertices_coords || !edges_vertices) { return []; }
//   const svg_edges = edges_coords({ vertices_coords, edges_vertices })
//     .map(e => libraries.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
//   make_edges_assignment_names(graph)
//     .foreach((a, i) => svg_edges[i][k.setAttributeNS](null, k._class, a));
//   return svg_edges;
// };

/**
 * Rabbit Ear (c) Kraft
 */

const FACE_STYLE_FOLDED_ORDERED = {
	back: { fill: _white },
	front: { fill: "#ddd" }
};
const FACE_STYLE_FOLDED_UNORDERED = {
	back: { opacity: 0.1 },
	front: { opacity: 0.1 }
};
const FACE_STYLE_FLAT = {
	// back: { fill: "white", stroke: "none" },
	// front: { fill: "#ddd", stroke: "none" }
};
const GROUP_STYLE_FOLDED_ORDERED = {
	stroke: _black,
	"stroke-linejoin": "bevel"
};
const GROUP_STYLE_FOLDED_UNORDERED = {
	stroke: _none,
	fill: _black,
	"stroke-linejoin": "bevel"
};
const GROUP_STYLE_FLAT = {
	fill: _none
};

const faces_sorted_by_layer = function (faces_layer) {
	return faces_layer.map((layer, i) => ({ layer, i }))
		.sort((a, b) => a.layer - b.layer)
		.map(el => el.i);
};

const apply_style$1 = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @description this method will check for layer order, face windings,
 * and apply a style to each face accordingly, adds them to the group,
 * and applies style attributes to the group itself too.
 */
const finalize_faces = (graph, svg_faces, group, attributes) => {
	const isFolded = is_folded_form(graph);
	// currently, layer order is determined by "faces_layer" key, and
	// ensuring that the length matches the number of faces in the graph.
	const orderIsCertain = graph[_faces_layer] != null
		&& graph[_faces_layer].length === graph[_faces_vertices].length;
	const classNames = [[_front], [_back]];
	const faces_winding = make_faces_winding(graph);
	// counter-clockwise faces are "face up", their front facing the camera
	// clockwise faces means "flipped", their back is facing the camera.
	// set these class names, and apply the style as attributes on each face.
	faces_winding.map(w => (w ? classNames[0] : classNames[1]))
		.forEach((className, i) => {
			svg_faces[i].setAttributeNS(null, _class, className);
			apply_style$1(svg_faces[i], isFolded
				? (orderIsCertain
					? FACE_STYLE_FOLDED_ORDERED[className]
					: FACE_STYLE_FOLDED_UNORDERED[className])
				: FACE_STYLE_FLAT[className]);
			apply_style$1(svg_faces[i], attributes[className]);
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
	apply_style$1(group, isFolded
		? (orderIsCertain ? GROUP_STYLE_FOLDED_ORDERED : GROUP_STYLE_FOLDED_UNORDERED)
		: GROUP_STYLE_FLAT);
	return group;
};
/**
 * @description build SVG faces using faces_vertices data. this is
 * slightly faster than the other method which uses faces_edges.
 * @returns {SVGElement[]} an SVG <g> group element containing all
 * of the <polygon> faces as children.
 */
const faces_vertices_polygon = (graph, attributes = {}) => {
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
const faces_edges_polygon = function (graph, attributes = {}) {
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

const apply_style = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
const boundaries_polygon = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) { return g; }
	const boundary = get_boundary(graph)
		.vertices
		.map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
	if (boundary.length === 0) { return g; }
	// create polygon, append to group
	const poly = root.svg.polygon(boundary);
	poly.setAttributeNS(null, _class, _boundary);
	g.appendChild(poly);
	// style attributes on group container
	apply_style(g, is_folded_form(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

/**
 * Rabbit Ear (c) Kraft
 */

// preference for using faces_vertices over faces_edges, it runs faster
const faces_draw_function = (graph, options) => (
	graph != null && graph[_faces_vertices] != null
		? faces_vertices_polygon(graph, options)
		: faces_edges_polygon(graph, options));

const svg_draw_func = {
	vertices: vertices_circle,
	edges: draw_edges, // edges_paths
	faces: faces_draw_function,
	boundaries: boundaries_polygon
};

/**
 * @param {string} key will be either "vertices", "edges", "faces", "boundaries"
 */
const draw_group = (key, graph, options) => {
	const group = options === false ? (root.svg.g()) : svg_draw_func[key](graph, options);
	group.setAttributeNS(null, _class, key);
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
	_vertices].map(key => draw_group(key, graph, options[key]));

// static style draw methods for individual components
[_boundaries,
	_faces,
	_edges,
	_vertices,
].forEach(key => {
	DrawGroups[key] = function (graph, options = {}) {
		return draw_group(key, graph, options[key]);
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
		svg: this
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
const get_bounding_rect = ({ vertices_coords }) => {
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
	const invalid = isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]);
	return (invalid
		? undefined
		: [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const getViewBox$1 = (graph) => {
	const viewBox = get_bounding_rect(graph);
	return viewBox === undefined
		? ""
		: viewBox.join(" ");
};
/**
 * @description given a group assumed to contain only circle elements,
 * set the "r" attribute on all circles.
 */
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i++) {
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
	if (!(options.strokeWidth || options.viewBox || groups[3].length)) { return; }
	const bounds = get_bounding_rect(graph);
	const vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth ? options.strokeWidth : options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: vmax * DEFAULT_STROKE_WIDTH;
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (groups[3].length) {
		const radius = typeof options.radius === "number"
			? vmax * options.radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], radius);
	}
};
/**
 * @description renders a FOLD object into an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} an already initialized SVG DOM element.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement} the first SVG parameter object.
 */
const drawInto = (element, graph, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	// set custom getters on the element to grab the component groups
	Object.keys(DrawGroups)
		.filter(key => element[key] == null)
		.forEach((key, i) => Object.defineProperty(element, key, { get: () => groups[i] }));
	return element;
};
/**
 * @description renders a FOLD object as an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 *  The drawInto() method will accept options/setViewBox in any order.
 * @param {object} graph FOLD object
 * @param {object} options (optional)
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
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

var detect = {
// compare to "undefined", the string
	isBrowser: typeof window !== str_undefined
		&& typeof window.document !== str_undefined,
	isNode: typeof process !== str_undefined
		&& process.versions != null
		&& process.versions.node != null,
	isWebWorker: typeof self === str_object
		&& self.constructor
		&& self.constructor.name === "DedicatedWorkerGlobalScope",
};

/**
 * SVG (c) Kraft
 */
/**
 * @description an object named "window" with DOMParser, XMLSerializer,
 * and document.
 * in the case of browser-usage, this object is simply the browser window,
 * in the case of nodejs, the package "xmldom" provides the methods.
 */
const SVGWindow = (function () {
	let win = {};
	if (detect.isNode) {
		const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
		win.DOMParser = DOMParser;
		win.XMLSerializer = XMLSerializer;
		// smallest, valid HTML5 document: doctype with non-whitespace title
		win.document = new DOMParser().parseFromString(
			"<!DOCTYPE html><title>.</title>", "text/html");
	} else if (detect.isBrowser) {
		win = window;
	}
	return win;
}());

/**
 * SVG (c) Kraft
 */
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
const vec = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];

const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
	if (endAngle == null) { return ""; }
	const start = vec(startAngle, radius);
	const end = vec(endAngle, radius);
	const arcVec = [end[0] - start[0], end[1] - start[1]];
	const py = start[0] * end[1] - start[1] * end[0];
	const px = start[0] * end[0] + start[1] * end[1];
	const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? `M ${x},${y} l ${start[0]},${start[1]} `
		: `M ${x+start[0]},${y+start[1]} `);
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
		}
	}
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
		}
	}
};

/**
 * SVG (c) Kraft
 */
const COUNT = 128;

const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
	.from(Array(COUNT + 1))
	.map((_, i) => (i - (COUNT)) / COUNT * 2 + 1)
	.map(i => [
		x + (i + 1) * width * 0.5,
		y + (i ** 2) * height
	]);

const parabolaPathString = (a, b, c, d) => [
	parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" ")
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
		.map((el, i) => 2 * Math.PI * i / sides)
		.map(a => [Math.cos(a), Math.sin(a)])
		.map(pts => origin.map((o, i) => o + radius * pts[i]));
};

const polygonPathString = (sides, cX = 0, cY = 0, radius = 1) => [
	regularPolygonArguments(sides, cX, cY, radius)
		.map(a => `${a[0]},${a[1]}`).join(" ")
];

/**
 * SVG (c) Kraft
 */

var RegularPolygon = {
	regularPolygon: {
		nodeName: "polygon",
		attributes: [str_points],
		args: polygonPathString
	}
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
		args: roundRectArguments
	}
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
		.charAt(0).toUpperCase() + s.slice(1)
};

/**
 * SVG (c) Kraft
 */

const svg_is_iterable = (obj) => {
	return obj != null && typeof obj[Symbol.iterator] === str_function;
};
/**
 * flatten only until the point of comma separated entities. recursive
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
var coordinates = (...args) => {
	// [top-level numbers] concat [{x:,y:} and [0,1]] style
	return args.filter(a => typeof a === str_number)
		.concat(
			args.filter(a => typeof a === str_object && a !== null)
				.map((el) => {
					if (typeof el.x === str_number) { return [el.x, el.y]; }
					if (typeof el[0] === str_number) { return [el[0], el[1]]; }
					return undefined;
				}).filter(a => a !== undefined)
				.reduce((a, b) => a.concat(b), [])
		);
};

/**
 * SVG (c) Kraft
 */
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];

var svg_algebra = /*#__PURE__*/Object.freeze({
	__proto__: null,
	svg_magnitudeSq2: svg_magnitudeSq2,
	svg_magnitude2: svg_magnitude2,
	svg_distanceSq2: svg_distanceSq2,
	svg_distance2: svg_distance2,
	svg_add2: svg_add2,
	svg_sub2: svg_sub2,
	svg_scale2: svg_scale2
});

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

const setArrowStyle = (element, options = {}, which) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	Object.keys(options)
		.map(key => ({ key, fn: path[Case.toCamel(key)] }))
		.filter(el => typeof el.fn === str_function)
		.forEach(el => el.fn(options[el.key]));
};

const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0]
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden"));
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
	for (let a = 0; a < args.length; a++) {
		if (typeof args[a] !== str_object) { continue; }
		const keys = Object.keys(args[a]);
		for (let i = 0; i < keys.length; i++) {
			if (arrowKeys.includes(keys[i])) {
				return args[a];
			}
		}
	}
};

const init = function (element, ...args) {
	element.setAttribute(str_class, str_arrow);
	const paths = ["line", str_tail, str_head]
		.map(key => SVG.path().setClass(`${str_arrow}-${key}`).appendTo(element));
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
		args: () => [],  // one function
		methods: ArrowMethods,  // object of functions
		init,
	}
};

/**
 * SVG (c) Kraft
 */

/**
 * totally flatten, recursive
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
	makeCurvePath(coordinates(...svg_flatten_arrays(...args)))
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
		? [move[move.length-2], move[move.length-1]]
		: [0, 0];
	const end = curve
		? [curve[curve.length-2], curve[curve.length-1]]
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
		args: curveArguments,  // one function
		methods: curve_methods  // object of functions
	}
};

/**
 * SVG (c) Kraft
 */

const nodes = {};

Object.assign(nodes,
	// to include/exclude nodes from this library
	// comment out nodes below, rebuild
	Arc,
	Wedge,
	Parabola,
	RegularPolygon,
	RoundRect,
	Arrow,
	Curve
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

const cdata = (textContent) => (new SVGWindow.DOMParser())
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
const parse = string => (new SVGWindow.DOMParser())
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
				.then(xml => xml.nodeName === str_svg
					? xml
					: xml.getElementsByTagName(str_svg)[0])
				.then(svg => (svg == null
						? reject("valid XML found, but no SVG element")
						: resolve(svg)))
				.catch(err => reject(err));
		}
		else if (input instanceof SVGWindow.Document) {
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
	&& detect.isBrowser
	&& typeof SVGWindow.fetch === str_function
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
	filename: "image.svg" // if "download" is true, the filename for the downloaded file
});

const getWindowStylesheets = function () {
	const css = [];
	if (SVGWindow.document.styleSheets) {
		for (let s = 0; s < SVGWindow.document.styleSheets.length; s += 1) {
			const sheet = SVGWindow.document.styleSheets[s];
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
	const blob = new SVGWindow.Blob([contentsAsString], { type: "text/plain" });
	const a = SVGWindow.document.createElement("a");
	a.setAttribute("href", SVGWindow.URL.createObjectURL(blob));
	a.setAttribute("download", filename);
	SVGWindow.document.body.appendChild(a);
	a.click();
	SVGWindow.document.body.removeChild(a);
};

const save = function (svg, options) {
	options = Object.assign(SAVE_OPTIONS(), options);
	// if this SVG was created inside the browser, it inherited all the <link>
	// stylesheets present on the window, this allows them to be included.
	// default: not included.
	if (options.windowStyle) {
		const styleContainer = SVGWindow.document.createElementNS(NS, str_style);
		styleContainer.setAttribute("type", "text/css");
		styleContainer.innerHTML = getWindowStylesheets();
		svg.appendChild(styleContainer);
	}
	// convert the SVG to a string and format it with good indentation
	const source = (new SVGWindow.XMLSerializer()).serializeToString(svg);
	const formattedString = vkXML(source);
	//
	if (options.download && detect.isBrowser && !detect.isNode) {
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
		backRect = this.Constructor("rect", ...getFrame(element));
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
		vector: (...args) => [...args]
	}
};

/**
 * SVG (c) Kraft
 */

const categories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"], // "mouseover",
	release: ["mouseup", "touchend"], // "mouseleave", "touchcancel",
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
	["pressX", "pressY"].filter(prop => !e.hasOwnProperty(prop))
		.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
	if (!e.hasOwnProperty("press")) {
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
		}
	};

	// assign handlers for onMove, onPress, onRelease
	Object.keys(categories).forEach((category) => {
		const propName = "on" + Case.capitalized(category);
		Object.defineProperty(element, propName, {
			set: (handler) => (handler == null)
				? removeHandler(category)
				: categories[category].forEach((handlerName) => {
						const handlerFunc = (e) => {
							// const pointer = (e.touches != null && e.touches.length
							const pointer = (e.touches != null
								? e.touches[0]
								: e);
							// onRelease events don't have a pointer
							if (pointer !== undefined) {
								const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
									.map(n => isNaN(n) ? undefined : n); // e.target
								["x", "y"]
									.filter(prop => !e.hasOwnProperty(prop))
									.forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
								if (!e.hasOwnProperty("position")) {
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
					}),
			enumerable: true
		});
	});

	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

/**
 * SVG (c) Kraft
 */
var UUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, '')
	.concat("aaaaa")
	.substr(0, 5);

/**
 * SVG (c) Kraft
 */

const Animation = function (element) {

	let start;
	const handlers = {};
	let frame = 0;
	let requestId;

	const removeHandlers = () => {
		if (SVGWindow.cancelAnimationFrame) {
			SVGWindow.cancelAnimationFrame(requestId);
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
					requestId = SVGWindow.requestAnimationFrame(handlers[uuid]);
				}
			};
			handlers[uuid] = handlerFunc;
			// node.js doesn't have requestAnimationFrame
			// we don't need to duplicate this if statement above, because it won't
			// ever be called if this one is prevented.
			if (SVGWindow.requestAnimationFrame) {
				requestId = SVGWindow.requestAnimationFrame(handlers[uuid]);
			}
		},
		enumerable: true
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
		}
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
			set: (v) => { cp[key] = v; }
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			// todo, do we need to do any other unwinding?
			removeFromParent(cp.svg);
			position.delegate = undefined;
		}
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

// const ElementConstructor = (new window.DOMParser())
//   .parseFromString("<div />", "text/xml").documentElement.constructor;

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
		}
	}
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
		}
	}
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
		"r",  // <radialGradient>
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

var circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d));
			// console.log("SVG circle coords", coords);
			switch (coords.length) {
				case 0: case 1: return [, , ...coords]
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
		}
	}
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
				case 0: case 1: case 2: return [, , ...coords]
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
		}
	}
};

/**
 * SVG (c) Kraft
 */

const Args$1 = (...args) => coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);

const setPoints$1 = (element, ...args) => { Args$1(...args)
	.forEach((value, i) => element.setAttribute(attributes.line[i], value)); return element; };

var lineDef = {
	line: {
		args: Args$1,
		methods: {
			setPoints: setPoints$1,
		}
	}
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
	z: "close"
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
	return results.map(match => ({
		command: str[match.index],
		index: match.index
	}))
	.reduceRight((all, cur) => {
		const chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
		return all.concat([
			 { command: cur.command,
			 index: cur.index,
			 chunk: (chunk.length > 0) ? chunk.substr(1, chunk.length - 1) : chunk }
		]);
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
		methods: path_methods
	}
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
		}
	}
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
			}
		}
	}
};

/**
 * SVG (c) Kraft
 */

var textDef = {
	text: {
		// assuming people will at most supply coordinate (x,y,z) and text
		args: (a, b, c) => coordinates(...svg_flatten_arrays(a, b, c)).slice(0, 2),
		init: (element, a, b, c, d) => {
			const text = [a,b,c,d].filter(a => typeof a === str_string).shift();
			if (text) {
				element.appendChild(SVGWindow.document.createTextNode(text));
				// it seems like this is excessive and will never happen
				// if (element.firstChild) {
				//   element.firstChild.nodeValue = text;
				// } else {
				//   element.appendChild(window.document.createTextNode(text));
				// }
			}
		}
	}
};

/**
 * SVG (c) Kraft
 */

const makeIDString = function () {
	return Array.from(arguments)
		.filter(a => typeof a === str_string || a instanceof String)
		.shift() || UUID();
};

const args = (...args) => [makeIDString(...args)];

var maskTypes = {
	mask: { args: args },
	clipPath: { args: args },
	symbol: { args: args },
	marker: {
		args: args,
		methods: {
			size: setViewBox,
			setViewBox: setViewBox
		}
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
	polyString(...coordinates(...svg_semi_flatten_arrays(...args)))
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
			addPoint
		}
	},
	polygon: {
		args: Args,
		methods: {
			setPoints,
			addPoint
		}
	}
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
var Spec = Object.assign({},
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
		"visibility"
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
		"dx",  // <text>
		"dy",  // <text>
		"alignment-baseline", // specifies how a text alignts vertically
		"baseline-shift",
		"dominant-baseline",
		"lengthAdjust",  // <text>
		"method", // for <textPath> only
		"overline-position",
		"overline-thickness",
		"rotate",  // rotates each individual glyph
		"spacing",
		"startOffset", // <textPath>
		"strikethrough-position",
		"strikethrough-thickness",
		"text-anchor",
		"text-decoration",
		"text-rendering",
		"textLength",   // <text>
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
	.reduce((a,b) => a.concat(b), [])
	.filter(nodeName => attributes[nodeName] === undefined)
	.forEach(nodeName => { attributes[nodeName] = []; });

[ [[str_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
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
	}
};

/**
 * SVG (c) Kraft
 */

const getAttr = (element) => {
	const t = element.getAttribute(str_transform);
	return (t == null || t === "") ? undefined : t;
};

const TransformMethods = {
	clearTransform: (el) => { el.removeAttribute(str_transform); return el; }
};

["translate", "rotate", "scale", "matrix"].forEach(key => {
	TransformMethods[key] = (element, ...args) => element.setAttribute(
		str_transform,
		[getAttr(element), `${key}(${args.join(" ")})`]
			.filter(a => a !== undefined)
			.join(" "));
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
	groups.forEach(n =>
		Object.keys(Methods).forEach((method) => {
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
		type: "text/css"
	}
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
	const element = SVGWindow.document.createElementNS(NS, Nodes[nodeName].nodeName);
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
	Object.keys(Nodes[nodeName].methods).forEach(methodName =>
		Object.defineProperty(element, methodName, {
			value: function () {
				// all custom methods are attached to the node.
				// if there is no return value specified,
				// the method will return the element itself
				// to encourage method-chaining design.
				// nevermind.
				// things need to be able to return undefined
				return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments);// || element;
			}
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
	[ "segment",
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
	if (SVGWindow.document.readyState === "loading") {
		SVGWindow.document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
	} else {
		initialize(svg, ...arguments);
	}
	return svg;
};

// const SVG = function () {
// 	const svg = Constructor(S.str_svg, null, ...arguments);
// 	// call initialize as soon as possible. check if page has loaded
// 	if (window.document.readyState === "loading") {
// 		window.document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
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

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description an object named "window" with DOMParser, XMLSerializer,
 * and document.
 * in the case of browser-usage, this object is simply the browser window,
 * in the case of nodejs, the package "xmldom" provides the methods.
 */
const Window = (function () {
	let win = {};
	if (isNode) {
		const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
		win.DOMParser = DOMParser;
		win.XMLSerializer = XMLSerializer;
		// smallest, valid HTML5 document: doctype with non-whitespace title
		win.document = new DOMParser().parseFromString(
			"<!DOCTYPE html><title>.</title>", "text/html");
	} else if (isBrowser) {
		win = window;
	}
	return win;
}());

/**
 * Rabbit Ear (c) Kraft
 */

// if three doesn't exist, throw an error

// const make_faces_geometry = (graph, material) => {
const make_faces_geometry = (graph) => {
	const { THREE } = Window;
	const vertices = graph.vertices_coords
		.map(v => [v[0], v[1], v[2] || 0])
		.flat();
	const normals = graph.vertices_coords
		.map(v => [0, 0, 1])
		.flat();
	const colors = graph.vertices_coords
		.map(v => [1, 1, 1])
		.flat();
	const faces = graph.faces_vertices
		.map(fv => fv
			.map((v, i, arr) => [arr[0], arr[i+1], arr[i+2]])
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
	if (math.core.mag_squared(edge_vector) < math.core.EPSILON) {
		return [];
	}
	const normalized = math.core.normalize(edge_vector);
	const perp = [ [1,0,0], [0,1,0], [0,0,1] ]
		.map(vec => math.core.cross3(vec, normalized))
		.sort((a, b) => math.core.magnitude(b) - math.core.magnitude(a))
		.shift();
	const rotated = [ math.core.normalize(perp) ];
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
	//console.log(dirs);
	return coords
		.map(v => dirs.map(dir => math.core.add(v, dir)))
		.flat();
};

const make_edges_geometry = function ({
	vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector
}, scale=0.002, end_pad = 0) {
	const { THREE } = Window;
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
		"B": [0.0,0.0,0.0],
 // "M": [0.9,0.31,0.16],
		"M": [0.0,0.0,0.0],//[34/255, 76/255, 117/255], //[0.6,0.2,0.11],
		"F": [0.0,0.0,0.0],//[0.25,0.25,0.25],
		"V": [0.0,0.0,0.0],//[227/255, 85/255, 54/255]//[0.12,0.35,0.50]
	};

	const colors = edges_assignment.map(e => 
		[colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
		colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
	).flat(3);

	const vertices = edges_coords
		.map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale, end_pad))
		.flat(2);

	const normals = edges_vector.map(vector => {
		if (math.core.mag_squared(vector) < math.core.EPSILON) { throw "degenerate edge"; }
		let normalized = math.core.normalize(vector);
		// scale to line width
		math.core.scale(normalized, scale);
		// let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
		const c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,-1])), scale);
		const c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,1])), scale);
		// let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
		// let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
		return [
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]],
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]]
		]
	}).flat(2);

	let faces = edges_coords.map((e,i) => [
		// 8 triangles making the long cylinder
		i*8+0, i*8+4, i*8+1,
		i*8+1, i*8+4, i*8+5,
		i*8+1, i*8+5, i*8+2,
		i*8+2, i*8+5, i*8+6,
		i*8+2, i*8+6, i*8+3,
		i*8+3, i*8+6, i*8+7,
		i*8+3, i*8+7, i*8+0,
		i*8+0, i*8+7, i*8+4,
		// endcaps
		i*8+0, i*8+1, i*8+3,
		i*8+1, i*8+2, i*8+3,
		i*8+5, i*8+4, i*8+7,
		i*8+7, i*8+6, i*8+5,
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
	vertex,
	text,
	webgl,
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

export { ear as default };
