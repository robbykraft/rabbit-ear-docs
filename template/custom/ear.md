# rabbit ear

Welcome. This is the technical documentation for [Rabbit Ear](https://rabbitear.org), an origami library for front or back-end Javascript.

Installing Rabbit Ear gives you access to the `ear` object, these docs describe the contents of this object.

For visual and interactive examples, check out [the book](https://rabbitear.org/book/).

> Rabbit Ear is in *alpha release*, it should not be used in production, its structure is subject to change.

## the sidebar

- <span class="img">▶</span> this object **contains** nested methods (functions can be containers too)
- ![constant](C.svg) this is a **constant** (boolean, number, string, object)
- ![function](F.svg) this is a **function**

<!-- - ![static](S.svg) this is a function with **static** properties or methods -->

## installation

To install Rabbit Ear on an HTML page, link [this CDN](https://robbykraft.github.io/Origami/rabbit-ear.js):

```html
<script type="text/javascript" src="https://robbykraft.github.io/Origami/rabbit-ear.js"></script>
```

To install [Rabbit Ear in Node.js](https://www.npmjs.com/package/rabbit-ear):

```shell
npm i rabbit-ear
```

and include it in your project,

```typescript
// ES
import ear from "rabbit-ear";
```

```typescript
// CommonJS
const ear = require("rabbit-ear");
```

## general overview

Broadly, the library does a few things:

- [ear.graph](ear.graph.html): create and modify FOLD objects ([FOLD](https://github.com/edemaine/fold/blob/main/doc/spec.md) is the graph model which represents an origami)
- [ear.svg](ear.svg.html): draw SVG elements (including renderings of FOLD objects)
- [ear.math](ear.math.html): contains a small math library (mostly simple linear algebra and geometry intersection)
- [ear.axiom](ear.axiom.html) and [ear.singleVertex](ear.singleVertex.html) contains general origami-specific calculations.

### back-end SVG

In Node.js, in a terminal environment without a front-end, the **window** object does not exist. If you would like to generate virtual SVG elements, this library allows you to pair with [@xmldom/xlmdom](https://www.npmjs.com/package/@xmldom/xmldom); otherwise this pairing is unnecessary.

```typescript
const ear = require("rabbit-ear");
ear.window = require("@xmldom/xmldom");
```

> This is not necessary for React/Angular/Svelte apps. These environments still expose the window object.

## source code

The source code is spread out across multiple repositories, each of which are freely available:

- [Rabbit Ear](https://github.com/robbykraft/Origami)
- [Math](https://github.com/robbykraft/Math)
- [SVG](https://github.com/robbykraft/SVG)

Feel free to copy code in your projects, if you do, please cite this project. This is an unfunded community project, the more people know about it the better it can be.
