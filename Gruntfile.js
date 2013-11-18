/*
 * grunt-tight-sprite
 * https://github.com/uhop/grunt-tight-sprite
 *
 * Copyright (c) 2013 Eugene Lazutkin
 * Licensed under the New BSD license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks("tasks");

  // These plugins provide necessary tasks.
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  // grunt.registerTask('test', ['clean', 'tight_sprite', 'nodeunit']);

  // By default, lint and run all tests.
  // grunt.registerTask('default', ['jshint', 'test']);

};
