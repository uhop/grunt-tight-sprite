# grunt-tight-sprite  [![Build Status](https://secure.travis-ci.org/uhop/grunt-tight-sprite.png?branch=master)](http://travis-ci.org/uhop/grunt-tight-sprite) [![Dependency Status](https://david-dm.org/uhop/grunt-tight-sprite.png)](https://david-dm.org/uhop/grunt-tight-sprite) [![devDependency Status](https://david-dm.org/uhop/grunt-tight-sprite/dev-status.png)](https://david-dm.org/uhop/grunt-tight-sprite#info=devDependencies)

> Tight 2D packing of images into a sprite with a corresponding CSS.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tight-sprite --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tight-sprite');
```

## The "tight_sprite" task

### Overview
In your project's Gruntfile, add a section named `tight_sprite` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tight_sprite: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.classPrefix
Type: `String`
Default value: `'sprite_'`

A string value that is used as a prefix for generated CSS class names.

#### options.absolute
Type: `Boolean`
Default value: `false`

A boolean value that indicates to use an absolute path of a generated sprite image in CSS.
Otherwise a path relative to a CSS file is used.

Usually `absolute: true` is used for a postprocessing of a generated CSS file to replace an absolute file path with an absolute URL.

#### options.silent
Type: `Boolean`
Default value: `false`

A boolean value that indicates to suppress all informational output to console.

#### options.jpeg
Type: `Object`
Default value: `null`

This parameters governs the output type: JPEG (when non-null), or PNG (when null).

If specified, it is passed to a `canvas` object as parameter when creating a JPEG stream.
See [Canvas#jpegStream() and Canvas#syncJPEGStream()](https://github.com/LearnBoost/node-canvas/blob/master/Readme.md#canvasjpegstream-and-canvassyncjpegstream)
for details. If `null`, a PNG stream is created.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  tight_sprite: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  tight_sprite: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
