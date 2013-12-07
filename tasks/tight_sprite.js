"use strict";


var path = require("path");
var fs   = require("fs");

var sizeOf = require("image-size");
var Canvas = require("canvas");
var _      = require("lodash");

var windowing = require("tight-sprite/windowing");
var getSize   = require("tight-sprite/lib/utils/getSize");


// score functions

var strategies = [
		function produceScore1(top, stack, state){
			var cp = top.envelope.cornerPoints, w = cp[cp.length - 1].x, h = cp[0].y,
				diff = cp.length - stack[stack.length - 2].envelope.cornerPoints.length;
			return [Math.max(state.totalArea, w * h), top.envelope.areaIn() - top.area, diff];
		},
		function produceScore2(top, stack, state){
			var cp = top.envelope.cornerPoints, w = cp[cp.length - 1].x, h = cp[0].y,
				diff = cp.length - stack[stack.length - 2].envelope.cornerPoints.length;
			return [Math.max(state.totalArea, w * h), top.envelope.areaIn() - top.area,
				diff, w * h < state.totalArea ? Math.abs(h - w) : 0];
		}
	];


// template helpers

function makeClassName(shortName){
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
					jpeg: null,
					classPrefix: "sprite_",
					absolute: false,
					depth: 3,
					finalDepth: 6
				});

			this.files.forEach(function(file){
				var images = file.src.map(function(shortName){
					var name = file.cwd ? path.join(file.cwd, shortName) : shortName,
						size = sizeOf(name);
					return {
						name: name,
						shortName: shortName,
						className: options.classPrefix + makeClassName(shortName),
						w: size.width,
						h: size.height
					};
				});

				var result = windowing(images, strategies, {
						depth: options.depth,
						finalDepth: options.finalDepth
					}),
					layout = result.layout;
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
				if(file.css){
					cssName = file.css;
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
