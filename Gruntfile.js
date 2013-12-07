/*
 * grunt-tight-sprite
 * https://github.com/uhop/grunt-tight-sprite
 *
 * Copyright (c) 2013 Eugene Lazutkin
 * Licensed under the New BSD license.
 */

"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		tight_sprite: {
			sprite1: {
				options: {},
				cwd: "tests/icons",
				src: ["*/**/*.{png,jpg,jpeg,gif}"],
				dest: "tests/icons/sprite1"
			}
		}
	});

	grunt.loadTasks("tasks");

	grunt.registerTask("default", "tight_sprite");
	grunt.registerTask("test",    "tight_sprite");
};
