# grunt-tight-sprite

[![Build Status](https://secure.travis-ci.org/uhop/grunt-tight-sprite.png?branch=master)](http://travis-ci.org/uhop/grunt-tight-sprite) [![Dependency Status](https://david-dm.org/uhop/grunt-tight-sprite.png)](https://david-dm.org/uhop/grunt-tight-sprite) [![devDependency Status](https://david-dm.org/uhop/grunt-tight-sprite/dev-status.png)](https://david-dm.org/uhop/grunt-tight-sprite#info=devDependencies)

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
var iconPath = "tests/icons/";
grunt.initConfig({
  tight_sprite: {
    // describe my sprite #1
    my_sprite1: {
      options: {
        classPrefix: "",
        silent: true,
        hide: iconPath
      },
      src: [iconPath + "*/**/*.{png,jpg,jpeg,gif}"],
      dest: iconPath + "sprite1.png"
    }
  }
});
```

### Documentation

Please consult [Wiki](https://github.com/uhop/grunt-tight-sprite/wiki) and
[FAQ](https://github.com/uhop/grunt-tight-sprite/wiki/FAQ).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- 0.1.9 *added the ability to specify dot and path separators.*
- 0.1.8 *fixed an example.*
- 0.1.7 *added `hide` option.*
- 0.1.6 *added arbitrary parameters to a template. Thanks, Vladimir Lugovsky!*
- 0.1.5 *removed some accidental garbage.*
- 0.1.4 *accurate work with layouting 0 and 1 rectangle.*
- 0.1.3 *bugfix.*
- 0.1.2 *added support for skipping path from CSS class names.*
- 0.1.1 *added support for file extensions.*
- 0.1.0 *the initial release.*
