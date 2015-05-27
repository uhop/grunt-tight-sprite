"use strict";


var path = require("path");
var fs   = require("fs");

var sizeOf   = require("image-size");
var Canvas   = require("canvas");
var template = require("lodash.template");

var solver   = require("tight-sprite/palletizing");


// template helpers

function makeClassName(shortName, options){
	if(!options.includePath){
		shortName = path.basename(shortName);
	}
	if(!options.includeExt){
		var ext = path.extname(shortName);
		if(ext){
			shortName = shortName.replace(new RegExp("\\" + ext + "$"), "");
		}
	}
	if(options.hide){
		var l = options.hide.length;
		if(l <= shortName.length && options.hide === shortName.substr(0, l)){
			shortName = shortName.substr(l);
		}
	}
	return shortName.replace(/\./g, options.dotSeparator).
		replace(new RegExp("\\" + path.sep, "g"), options.pathSeparator);
}

var defaultTemplate =
		".<%= className %> {" +
			"background: url(<%= url %>) -<%= x %>px -<%= y %>px no-repeat; " +
			"width: <%= w %>px; " +
			"height: <%= h %>px;" +
		"}\n";


// the main function

module.exports = function(grunt) {
	grunt.registerMultiTask("tight_sprite",
		"Tight 2D packing of images into a sprite with a corresponding CSS.",
		function(){
			var done = this.async(),
				options = this.options({
					jpeg:          null,
					absolute:      false,
					hide:          "",
					classPrefix:   "sprite_",
					dotSeparator:  "_",
					pathSeparator: "_",
					includePath:   true,
					includeExt:    false,
					silent:        false,
					fragment:      true,
					padding:       0
				});
			if(isNaN(options.padding) || options.padding < 0){
				options.padding = 0;
			}

			this.files.forEach(function(file){
				if(file.expand){
					grunt.fatal("grunt-tight-sprite does not support 'expand' option.", 3);
					return;
				}
				if(file.cwd){
					grunt.log.error("grunt-tight-sprite: 'cwd' is deprecated, use 'options.hide' instead.");
				}
				var layout, size, images = file.src.map(function(shortName){
						var name = file.cwd ? path.join(file.cwd, shortName) : shortName,
							size = sizeOf(name);

						return {
							name: name,
							shortName: shortName,
							className: options.classPrefix + makeClassName(shortName, options),
							extension: path.extname(shortName),
							w: size.width  + options.padding,
							h: size.height + options.padding
						};
					}).sort(function(a, b){
						if(a.name === b.name){
							return 0;
						}
						return a.name < b.name ? -1 : 1;
					});

				if(images.length === 0){
					grunt.fatal("task: tight_sprite: " + this.target + " has 0 source files, exiting.");
					done();
					return;
				}

				if(images.length > 1){
					var result = solver(images, {silent: options.silent});
					layout = result.layout;
					images = result.rectangles;
					size   = result;	// only using w and h
				}else{
					// one image
					layout = [{n: 0, x: 0, y: 0}];
					size   = images[0];	// only using w and h
				}

				size.w += options.padding;
				size.h += options.padding;

				// prepare rectangles

				var cssName, imgName;
				if(path.extname(file.dest)){
					imgName = file.dest;
					cssName = imgName.replace(
						new RegExp("\\" + path.extname(imgName) + "$"),
						".css");
				}else{
					imgName = file.dest + (options.jpeg ? ".jpg" : ".png");
					cssName = file.dest + ".css";
				}
				if(options.cssDest){
					cssName = options.cssDest;
				}

				var url = options.absolute ? path.resolve(imgName) :
						path.relative(path.dirname(path.resolve(cssName)), path.resolve(imgName)),
					rectangles = layout.map(function(pos){
							var rect = images[pos.n];
							return {
								name: rect.name,
								shortName: rect.shortName,
								className: rect.className,
								extension: rect.extension,
								w: rect.w - options.padding,
								h: rect.h - options.padding,
								x: pos.x  + options.padding,
								y: pos.y  + options.padding,
								url: url,
								size: size,
								params: options.templateParams || {}
							};
						}).sort(function(a, b){
							if(a.shortName === b.shortName){
								return 0;
							}
							return a.shortName < b.shortName ? -1 : 1;
						});

				// create a sprite image

				var canvas = new Canvas(size.w, size.h),
					ctx = canvas.getContext("2d");

				if(options.background){
					ctx.fillStyle = options.background;
					ctx.fillRect(0, 0, size.w, size.h);
				}

				rectangles.forEach(function(rect){
					var image = new (Canvas.Image)();
					image.src = rect.name;
					ctx.drawImage(image, rect.x, rect.y);
				});

				var inFlight = 2,
					imgOutput = fs.createWriteStream(imgName),
					stream = options.jpeg ? canvas.jpegStream(options.jpeg) : canvas.pngStream();

				imgOutput.on("finish", function(){
					if(!--inFlight){
						done();
					}
				});

				stream.pipe(imgOutput);

				// create a CSS file

				var cssOutput = fs.createWriteStream(cssName);
				cssOutput.on("finish", function(){
					if(!--inFlight){
						done();
					}
				});

				var tmpl;
				if(options.template){
					grunt.log.error("grunt-tight-sprite: 'options.template' is deprecated, use 'options.templateFile' instead.");
					tmpl = template(tmpl);
				}else if(options.templateFile){
					tmpl = template(fs.readFileSync(options.templateFile, {options: "utf8"}));
				}

				if(tmpl && !options.fragment){
					cssOutput.write(tmpl({
						images: rectangles,
						url: url,
						size: size,
						params: options.templateParams || {}
					}));
				}else{
					if(!options.fragment && !tmpl){
						grunt.log.error("grunt-tight-sprite: when 'options.fragment' is false, 'options.templateFile' should be specified as well.");
					}
					tmpl = tmpl || template(defaultTemplate);
					rectangles.forEach(function(rect){
						cssOutput.write(tmpl(rect));
					});
				}

				cssOutput.end();
			});
		}
	);
};
