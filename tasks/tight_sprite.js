"use strict";


var path = require("path");
var fs   = require("fs");

var sizeOf = require("image-size");
var Canvas = require("canvas");
var _      = require("lodash");

var solver  = require("tight-sprite/palletizing");
var getSize = require("tight-sprite/lib/utils/getSize");


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
	return shortName.replace(".", "_").replace(path.sep, "_");
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
			var done = this.async();

			var options = this.options({
					jpeg:        null,
					classPrefix: "sprite_",
					includePath: true,
					includeExt:  false,
					absolute:    false,
					silent:      false
				});

			this.files.forEach(function(file){
				var images = file.src.map(function(shortName){
					var name = file.cwd ? path.join(file.cwd, shortName) : shortName,
						size = sizeOf(name);
					return {
						name: name,
						shortName: shortName,
						className: options.classPrefix + makeClassName(shortName, options),
						extension: path.extname(shortName),
						w: size.width,
						h: size.height
					};
				});

				var result = solver(images, {silent: options.silent}), layout = result.layout;
				images = result.rectangles;

				// draw images

				var size = getSize(images, layout),
					canvas = new Canvas(size.w, size.h),
					ctx = canvas.getContext("2d");

				if(options.background){
					ctx.fillStyle = options.background;
					ctx.fillRect(0, 0, size.w, size.h);
				}

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

				var tmpl;
				if(options.template){
					tmpl = _.template(options.template);
				}else if(options.templateFile){
					tmpl = _.template(fs.readFileSync(options.templateFile, {options: "utf8"}));
				}else{
					tmpl = _.template(defaultTemplate);
				}

				var inFlight = 2;

				var url = options.absolute ? path.resolve(imgName) :
						path.relative(path.dirname(path.resolve(cssName)), path.resolve(imgName)),
					cssOutput = fs.createWriteStream(cssName);
				cssOutput.on("finish", function(){
					if(!--inFlight){
						done();
					}
				});

				layout.map(function(pos){
					var rect = images[pos.n];
					return {
						name: rect.name,
						shortName: rect.shortName,
						className: rect.className,
						extension: rect.extension,
						w: rect.w,
						h: rect.h,
						x: pos.x,
						y: pos.y,
						url: url
					};
				}).sort(function(a, b){
					if(a.shortName === b.shortName){
						return -1;
					}
					return a.shortName < b.shortName ? -1 : 1;
				}).forEach(function(rect){
					var image = new (Canvas.Image)();
					image.src = rect.name;
					ctx.drawImage(image, rect.x, rect.y);
					cssOutput.write(tmpl(rect));
				});
				cssOutput.end();

				var stream = options.jpeg ? canvas.jpegStream(options.jpeg) : canvas.pngStream(),
					imgOutput = fs.createWriteStream(imgName);
				imgOutput.on("finish", function(){
					if(!--inFlight){
						done();
					}
				});
				stream.pipe(imgOutput);
			});
		}
	);
};
