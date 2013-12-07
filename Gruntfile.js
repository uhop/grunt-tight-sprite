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
				src: ["*/**/*.{png,jpg,jpeg,gif}", "!x16/**/*", "!x64/**/*"],
				dest: "tests/icons/sprite1.png"
			},
			fc2: {
				cwd: "../12qcp/fc2/frontend/images/icons",
				src: "*/**/*.{png,jpg,jpeg,gif}",
				dest: "sprite.png"
			}
		}
	});

	grunt.loadTasks("tasks");

	grunt.registerTask("default", "tight_sprite");
};
