# rabbit-ear docgen

documentation generator for [rabbit-ear](https://rabbitear.org).

```bash
npm i
npm run docs
```

the workflow is:

1. using `jsdoc-to-markdown`, convert all library source code JSDoc comments to .json data.
2. using custom code, build markdown files from json data.
3. using `showdown` convert markdown files into html.

the custom code inspects the rabbit-ear library object recursively, finds all methods and constants, (this includes instancing all functions and looking for instance methods), and assembles a tree structure describing at each level:

- constants
- static methods
- instance methods
- simple objects (which contain other things)

this tree structure is used to build the navigation sidebar and to better organize the contents of the documentation page for each entry.
