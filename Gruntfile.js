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
			icons: {
				options: {},
				cwd: "/media/raid/Work/12qcp/fc2/frontend/images/icons",
				src: "*/**/*.{png,jpg,jpeg,gif}",
				dest: "./result.png"
			}
		}
	});

	grunt.loadTasks("tasks");

	grunt.registerTask("default", "tight_sprite");
};
