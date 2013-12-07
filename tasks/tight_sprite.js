"use strict";


var path = require("path");
var fs   = require("fs");

var sizeOf = require("image-size");
var Canvas = require("canvas");
var _      = require("lodash");

var windowOpt      = require("tight-sprite/lib/windowOpt");
var sortRectangles = require("tight-sprite/lib/sortRectangles");


// score functions

function produceScore1(top, stack, state){
	var cp = top.envelope.cornerPoints, w = cp[cp.length - 1].x, h = cp[0].y,
		diff = cp.length - stack[stack.length - 2].envelope.cornerPoints.length;
	return [Math.max(state.totalArea, w * h), top.envelope.areaIn() - top.area, diff];
}

function produceScore2(top, stack, state){
	var cp = top.envelope.cornerPoints, w = cp[cp.length - 1].x, h = cp[0].y,
		diff = cp.length - stack[stack.length - 2].envelope.cornerPoints.length;
	return [Math.max(state.totalArea, w * h), top.envelope.areaIn() - top.area, diff, w * h < state.totalArea ? Math.abs(h - w) : 0];
}


// geometric helpers

function getTotalArea(rectangles){
	return rectangles.reduce(function(acc, rect){ return acc + rect.w * rect.h; }, 0);
}

function getSize(rectangles, layout){
	var w = 0, h = 0;
	layout.forEach(function(pos){
		var rect = rectangles[pos.n];
		w = Math.max(w, pos.x + rect.w);
		h = Math.max(h, pos.y + rect.h);
	});
	return {w: w, h: h};
}

function getArea(rectangles, layout){
	var size = getSize(rectangles, layout);
	return size.w * size.h;
}

function rotateLayout(layout){
	return layout.map(function(){
		return {
			i: layout.i,
			n: layout.n,
			x: layout.y,
			y: layout.x
		}
	});
}


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

				var totalArea = getTotalArea(images), layout, area;

				positioning: {
					// normal orientation

					// 1st pass
					var result1 = windowOpt(images, produceScore1, options.depth, options.finalDepth),
						area = getArea(images, result1.layout);

					layout = result1.layout;
					if(area === totalArea){
						break positioning;
					}

					// 2nd pass
					var result2 = windowOpt(images, produceScore2, options.depth, options.finalDepth),
						area2 = getArea(images, result2.layout);

					if(area2 < area){
						layout = result2.layout;
						area = area2;
						if(area === totalArea){
							break positioning;
						}
					}

					// does it make sense to try 90 degree rotation?

					var images2 = images.map(function(image){
							return {name: image.name, shortName: image.shortName,
								className: image.className, w: image.h, h: image.w};
						});
					sortRectangles.byAreaDescending(images2);
					for(var i = 0, n = images.length; i < n; ++i){
						var img = images[i], img2 = images2[i];
						if(img.w !== img2.w || img.h !== img2.h){
							break;
						}
					}
					if(i === n){
						break positioning;
					}

					// 90 degree rotated

					// 3rd pass
					var result3 = windowOpt(images2, produceScore1, options.depth, options.finalDepth),
						area3 = getArea(images2, result3.layout);

					if(area3 < area){
						layout = rotateLayout(result3.layout);
						area = area3;
						if(area === totalArea){
							break positioning;
						}
					}

					// 4th pass
					var result4 = windowOpt(images2, produceScore2, options.depth, options.finalDepth),
						area4 = getArea(images2, result4.layout);

					if(area4 < area){
						layout = rotateLayout(result4.layout);
					}
				}

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

				layout.forEach(function(pos){
					var rect = images[pos.n], image = new (Canvas.Image)();
					image.src = rect.name;
					ctx.drawImage(image, pos.x, pos.y);
					cssOutput.write(tmpl({
						name: rect.name,
						shortName: rect.shortName,
						className: rect.className,
						w: rect.w,
						h: rect.h,
						x: pos.x,
						y: pos.y,
						url: url
					}));
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
