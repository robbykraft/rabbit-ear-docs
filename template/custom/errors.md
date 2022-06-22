# Error Messages

There are very few times the library will actually throw an error. As more are included, they will be listed here.

### error 10

> "window" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )

#### problem

This error is intended for those using Rabbit Ear in some backend environment like Node.js or Deno.js. You are trying to perform a "window" operation, and no window object natively exists. Most likely you tried to create an SVG and SVG elements are made using window.document.createElement, and Rabbit Ear does not come with a "document" object.

#### solution

If you are trying to load/save (window.fetch) or start an animation (window.requestAnimationFrame), there is no native solution. Consult your system level specific methods.

If you are trying to create an SVG, the fix is simple: include the package **@xmldom/xmldom** and assign it to the "window" property of Rabbit Ear.

install xmldom `npm i @xmldom/xmldom`

```text
const ear = require("rabbit-ear");
const xmldom = require("@xmldom/xmldom");

ear.window = xmldom;
```

If you are using Rabbit Ear in the browser, something strange has gone wrong. Try to re-set the window object:

```javascript
ear.window = window;
```
