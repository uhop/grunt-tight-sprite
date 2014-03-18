/*
 * grunt-tight-sprite
 * https://github.com/uhop/grunt-tight-sprite
 *
 * Copyright (c) 2013 Eugene Lazutkin
 * Licensed under the New BSD license.
 */

"use strict";

var iconPath = "tests/icons/";

module.exports = function(grunt) {
	grunt.initConfig({
		tight_sprite: {
			sprite1: {
				options: {
					hide: iconPath
				},
				src:  [iconPath + "*/**/*.{png,jpg,jpeg,gif}"],
				dest: iconPath + "sprite1.png"
			}
		}
	});

	grunt.loadTasks("tasks");

	grunt.registerTask("default", "tight_sprite");
	grunt.registerTask("test",    "tight_sprite");
};
