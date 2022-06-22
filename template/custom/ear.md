# Rabbit Ear

Welcome. This is the technical documentation for [Rabbit Ear](https://rabbitear.org), an origami library for Javascript, able to be run in a front-end browser or in a back-end environment (Node.js).

To learn more about what this library does, check out [the book](https://rabbitear.org/book/) where there are plenty of interactive examples.

The source code is spread out across multiple repositories, each of which are available online: [Rabbit Ear](https://github.com/robbykraft/Origami), [Math](https://github.com/robbykraft/Math), [SVG](https://github.com/robbykraft/SVG).

## how to read these docs

- <span class="img">▶</span> this object **contains** nested methods (functions can be containers too)
- ![constant](C.svg) this is a **constant** (boolean, number, string, object)
- ![function](F.svg) this is a **function**

<!-- - ![static](S.svg) this is a function with **static** properties or methods -->

## installation

### html

```html
<script type="text/javascript" src="https://robbykraft.github.io/Origami/rabbit-ear.js"></script>
```

### node

```shell
npm i rabbit-ear
```

```text
// es
import ear from "rabbit-ear";
// umd
const ear = require("rabbit-ear");
```

this will give you the `ear` object, the contents of which is described here in the documentation.
