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
    // describe my sprite #1
    my_sprite1: {
      options: {
        classPrefix: "",
        silent: true
      },
      cwd: "tests/icons",
      src: ["*/**/*.{png,jpg,jpeg,gif}"],
      dest: "tests/icons/sprite1.png"
    }
  }
})
```

### Options

Following options are supported and documented in excrusiating details with examples:

- [options.absolute](https://github.com/uhop/grunt-tight-sprite/wiki/options.absolute) --
  indicates to use an absolute path of a generated sprite image in CSS. Default: `false`.
- [options.background](https://github.com/uhop/grunt-tight-sprite/wiki/options.background) --
  specifies a color to be used as a background. Default: transparent.
- [options.classPrefix](https://github.com/uhop/grunt-tight-sprite/wiki/options.classPrefix) --
  prefix for generated CSS class names. Default: `'sprite_'`.
- [options.cssDest](https://github.com/uhop/grunt-tight-sprite/wiki/options.cssDest) --
  file name for a generated CSS file. Default: the same as `dest`, but with `'.css'` extension.
- [options.includeExt](https://github.com/uhop/grunt-tight-sprite/wiki/options.includeExt) --
  include image file's extension in a generated CSS class name. Default: `false`.
- [options.jpeg](https://github.com/uhop/grunt-tight-sprite/wiki/options.jpeg) --
  object, when specified it generates JPEG, or PNG when `null`. Default: `null` (PNG).
- [options.includePath](https://github.com/uhop/grunt-tight-sprite/wiki/options.includePath) --
  include image file's path in a generated CSS class name. Default: `true`.
- [options.silent](https://github.com/uhop/grunt-tight-sprite/wiki/options.silent) --
  suppress all informational output to console. Default: `false`.
- [options.template](https://github.com/uhop/grunt-tight-sprite/wiki/options.template) --
  string template to generate individual entries corresponding to original source images in a sprite's CSS file.
- [options.templateFile](https://github.com/uhop/grunt-tight-sprite/wiki/options.templateFile) --
  alternative way to specify a template as an external file. Default: none.

### Documentation

Please consult [Wiki](https://github.com/uhop/grunt-tight-sprite/wiki) and
[FAQ](https://github.com/uhop/grunt-tight-sprite/wiki/FAQ).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.1.4 -- accurate work with layouting 0 and 1 rectangle.

0.1.3 -- a bug fix.

0.1.2 -- added support for skipping path from CSS class names.

0.1.1 -- added support for file extensions.

0.1.0 -- the initial release.
