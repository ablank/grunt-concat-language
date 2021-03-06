# grunt-concat-language

> Concatenate files, with support for combining php, html, and xml partials.



## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-concat-language --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-concat-language');
```

## Concat task
_Run this task with the `grunt concat` command._

Task targets, files and options may be specified according to the Grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### separator
Type: `String`  
Default: `grunt.util.linefeed`

Concatenated files will be joined on this string. If you're post-processing concatenated JavaScript files with a minifier, you may need to use a semicolon `';'` as the separator.

#### banner
Type: `String`  
Default: empty string

This string will be prepended to the beginning of the concatenated output. It is processed using [grunt.template.process][], using the default options.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

#### footer
Type: `String`  
Default: empty string

This string will be appended to the end of the concatenated output. It is processed using [grunt.template.process][], using the default options.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

#### stripBanners  
Type: `Boolean` `Object`
Default: `false`

Strip JavaScript banner comments from source files.

* `false` - No comments are stripped.
* `true` - `/* ... */` block comments are stripped, but _NOT_ `/*! ... */` comments.
* `options` object:
  * By default, behaves as if `true` were specified.
  * `block` - If true, _all_ block comments are stripped.
  * `line` - If true, any contiguous _leading_ `//` line comments are stripped.

#### process
Type: `Boolean` `Object` `Function`  
Default: `false`

Process source files before concatenating, either as [templates][] or with a custom function.

* `false` - No processing will occur.
* `true` - Process source files using [grunt.template.process][] defaults.
* `data` object - Process source files using [grunt.template.process][], using the specified options.
* `function(src, filepath)` - Process source files using the given function, called once for each file. The returned value will be used as source code.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

  [templates]: https://github.com/gruntjs/grunt-docs/blob/master/grunt.template.md
  [grunt.template.process]: https://github.com/gruntjs/grunt-docs/blob/master/grunt.template.md#grunttemplateprocess

### *SourceMap Options*

#### sourceMap
Type: `Boolean`  
Default: `false`

Set to true to create a source map. The source map will be created alongside the destination file, and share the same file name with the `.map` extension appended to it.

#### sourceMapName
Type: `String` `Function`  
Default: `undefined`

To customize the name or location of the generated source map, pass a string to indicate where to write the source map to. If a function is provided, the concat destination is passed as the argument and the return value will be used as the file name.

#### sourceMapStyle
Type: `String`  
Default: `embed`

Determines the type of source map that is generated. The default value, `embed`, places the content of the sources directly into the map. `link` will reference the original sources in the map as links. `inline` will store the entire map as a data URI in the destination file.

### *Language Options*
#### language
Type: `Boolean` `Object`  
Default: `false`

Wrapper object for language options. 

Build php, html, or other file types that require opening/closing tags by specifying a language type. This module may be used to strip multiple line breaks & spaces from any file, and will provide basic opening/closing tags to format documents compiled of the type html, php, or xml.

#### language.opentag
Type: `String`  
Default: empty string

Tag used to open document (before banner).

#### language.closetag
Type: `String`  
Default: empty string

Tag used to close document.

#### language.rmSpace
Type: `Boolean`  
Default: null

Remove spaces & empty lines > 1

#### language.type
Type: `String`  
Default: null

Define language type: the type is used to search & replace tags specific to the selected language. Opening and closing tags will be added with the option to override default values.

* `html` - Combines the content found in `<body></body>` tags, with the option to remove all `<script></script>` by setting `language.rmScript: true`

* `php` - Combine php documents, removes the opening and closing `<?php ?>` tags 

* `xml` - Combine xml documents, stripping the declaration and doctype.

#### language.doctype
Type: `String`  
Default: `<!DOCTYPE html>`, `[]`

Doctype declaration of language.type `html` & `xml`, this variable is part of `language.opentag` and will be overridden if `language.opentag` is specified.

In XML files, this attribute sets the correct `standalone` & `SYSTEM` attributes automatically.

#### language.rmScript
Type: `Boolean`  
Default: null

Remove `<script>...</script>` from `language.type html`

#### language.expand
Type: `Boolean`  
Default: null

Create a line break at each closing brace '>'.

#### language.rmClose
Type: `Boolean`  
Default: `true`

Remove the closing `?>` from `language.type: php`

#### language.version
Type: `String`  
Default: `1.0`

Version number of `language.type: xml`

#### language.encoding
Type: `String`  
Default: `UTF-8`

Encoding of language.type `xml`

#### language.docroot
Type: `String`  
Default: `document`

Root element used by language.type `xml`

### Usage Examples

#### Concatenating with a custom separator
In this example, running `grunt concat:dist` (or `grunt concat` because `concat` is a [multi task][multitask]) will concatenate the three specified source files (in order), joining files with `;` and writing the output to `dist/built.js`.

```js
// Project configuration.
grunt.initConfig({
  concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.js',
    },
  },
});
```

#### Banner comments

In this example, running `grunt concat:dist` will first strip any preexisting banner comment from the `src/project.js` file, then concatenate the result with a newly-generated banner comment, writing the output to `dist/built.js`.

This generated banner will be the contents of the `banner` template string interpolated with the config object. In this case, those properties are the values imported from the `package.json` file (which are available via the `pkg` config property) plus today's date.

_Note: you don't have to use an external JSON file. It's also valid to create the `pkg` object inline in the config. That being said, if you already have a JSON file, you might as well reference it._

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  concat: {
    options: {
      stripBanners: true,
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
    },
    dist: {
      src: ['src/project.js'],
      dest: 'dist/built.js',
    },
  },
});
```

#### Multiple targets

In this example, running `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to `dist/basic.js`, and another "with_extras" concatenated version written to `dist/with_extras.js`.

While each concat target can be built individually by running `grunt concat:basic` or `grunt concat:extras`, running `grunt concat` will build all concat targets. This is because `concat` is a [multi task][multitask].

```js
// Project configuration.
grunt.initConfig({
  concat: {
    basic: {
      src: ['src/main.js'],
      dest: 'dist/basic.js',
    },
    extras: {
      src: ['src/main.js', 'src/extras.js'],
      dest: 'dist/with_extras.js',
    },
  },
});
```

#### Multiple files per target

Like the previous example, in this example running `grunt concat` will build two separate files. One "basic" version, with the main file essentially just copied to `dist/basic.js`, and another "with_extras" concatenated version written to `dist/with_extras.js`.

This example differs in that both files are built under the same target.

Using the `files` object, you can have list any number of source-destination pairs.

```js
// Project configuration.
grunt.initConfig({
  concat: {
    basic_and_extras: {
      files: {
        'dist/basic.js': ['src/main.js'],
        'dist/with_extras.js': ['src/main.js', 'src/extras.js'],
      },
    },
  },
});
```

#### Dynamic filenames

Filenames can be generated dynamically by using `<%= %>` delimited underscore templates as filenames.

In this example, running `grunt concat:dist` generates a destination file whose name is generated from the `name` and `version` properties of the referenced `package.json` file (via the `pkg` config property).

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  concat: {
    dist: {
      src: ['src/main.js'],
      dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
    },
  },
});
```

#### Advanced dynamic filenames

In this more involved example, running `grunt concat` will build two separate files (because `concat` is a [multi task][multitask]). The destination file paths will be expanded dynamically based on the specified templates, recursively if necessary.

For example, if the `package.json` file contained `{"name": "awesome", "version": "1.0.0"}`, the files `dist/awesome/1.0.0/basic.js` and `dist/awesome/1.0.0/with_extras.js` would be generated.

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  dirs: {
    src: 'src/files',
    dest: 'dist/<%= pkg.name %>/<%= pkg.version %>',
  },
  concat: {
    basic: {
      src: ['<%= dirs.src %>/main.js'],
      dest: '<%= dirs.dest %>/basic.js',
    },
    extras: {
      src: ['<%= dirs.src %>/main.js', '<%= dirs.src %>/extras.js'],
      dest: '<%= dirs.dest %>/with_extras.js',
    },
  },
});
```

#### Working with Multiple Languages

This example demonstrates configuration for combining files with language options, both explicitly ordering files in an array and loading all files from a specified directory.

```js
// Project configuration.
grunt.initConfig({
  php: {
    options: {
      language: {
        type: 'php',
        // rmClose is specific to type: php.
        rmClose: true
      }
    },
    src: [
      // Specify files in the order they will be included.
      'preprocess/theme-settings/markup.inc',
      'preprocess/theme-settings/style.inc',
      'preprocess/theme-settings/js.inc'
    ],
    dest: 'theme-settings.php'
  },
  html: {
    options: {
      language: {
        type: 'html',
        doctype: '<!DOCTYPE html>',
        expand: true,
        // rmScript is specific to type html
        rmScript: true
      }
    },
    src: ['process/html/**/*.html'],
    dest: 'processed.html'
  },
  xml: {
    options: {
      language: {
      // version, encoding, & docroot are specific to type xml
        type: 'xml',
        version: '1.0',
        encoding: 'UTF-8',
        // Link to DTD
        doctype: 'path/to/doctype',
        // Root element of document
        docroot: 'document',
        expand: true,
      }
    },
    src: ['process/xml/**/*.xml'],
    dest: 'processed.xml'
  },
  js: {
    options: {
      language: {
      // These options are available to any language.
        rmSpace: true,
        // Displays before banner
        opentag: '// I'm opening the document now',
        // Displays after footer
        closetag: '// That's all, folks!'
      }
    },
    src: ['process/js/**/*.js'],
    dest: 'processed.js'
  }
});
```

#### Invalid or Missing Files Warning
If you would like the `concat` task to warn if a given file is missing or invalid be sure to set `nonull` to `true`:

```js
grunt.initConfig({
  concat: {
    missing: {
      src: ['src/invalid_or_missing_file'],
      dest: 'compiled.js',
      nonull: true,
    },
  },
});
```

See [configuring files for a task](http://gruntjs.com/configuring-tasks#files) for how to configure file globbing in Grunt.


#### Custom process function
If you would like to do any custom processing before concatenating, use a custom process function:

```js
grunt.initConfig({
  concat: {
    dist: {
      options: {
        // Replace all 'use strict' statements in the code with a single one at the top
        banner: "'use strict';\n",
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
      files: {
        'dist/built.js': ['src/project.js'],
      },
    },
  },
});
```

[multitask]: http://gruntjs.com/creating-tasks#multi-tasks


