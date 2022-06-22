# rabbit-ear docgen

Documentation generator for [rabbit-ear](https://rabbitear.org). Sources the JSDoc comments throughout the source code and builds HTML files.

Instead of letting a JSDocs generator run the show, this generator inspects the actual library object (rabbit-ear) and carefully assembles the structure of the documentation to mimic the library. This includes the sidebar navigation and the contents of each individual page.

```bash
npm i
npm run docs
```

broadly, the workflow is:

1. using `jsdoc-to-markdown`, convert all library source code JSDoc comments to .json data.
2. using custom code, build markdown files from json data.
3. using `showdown` convert markdown files into html.

the custom code (step 2) does three things:

- recursively build a tree representation of the object in question (rabbit-ear), gathering all methods and constants (this includes instancing all functions and gathering instance properties/methods). Match each of these properties/methods to the corresponding definition that was gathered in the JSDoc.
- using the tree and the matched JSDocs definition, format each entry into a markdown file. The output differs heavily depending on the presence of static/instance properties and methods, and the type of the object.
- build the navigation sidebar using the tree representation of rabbit-ear.
