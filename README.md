# grunt-tight-sprite

[![Build status][travis-image]][travis-url]
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]


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

- 0.2.5 *refreshed dependencies.*
- 0.2.4 *refreshed dependencies.*
- 0.2.3 *new dependencies on Grunt to include its version of 1.0.0.*
- 0.2.2 *refreshed dependencies.*
- 0.2.1 *added the ability to pad images.*
- 0.2.0 *stability fixes, more flexible template options.*
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

## License

BSD

[npm-image]:      https://img.shields.io/npm/v/grunt-tight-sprite.svg
[npm-url]:        https://npmjs.org/package/grunt-tight-sprite
[deps-image]:     https://img.shields.io/david/uhop/grunt-tight-sprite.svg
[deps-url]:       https://david-dm.org/uhop/grunt-tight-sprite
[dev-deps-image]: https://img.shields.io/david/dev/uhop/grunt-tight-sprite.svg
[dev-deps-url]:   https://david-dm.org/uhop/grunt-tight-sprite?type=dev
[travis-image]:   https://img.shields.io/travis/uhop/grunt-tight-sprite.svg
[travis-url]:     https://travis-ci.org/uhop/grunt-tight-sprite
