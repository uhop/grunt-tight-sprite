"use strict";


var Envelope  = require("./Envelope");
var lookAhead = require("./lookAhead");


function windowOpt(rectangles, depth){
	var bestScore, bestPosition = {x: 0, y: 0, i: 0}, bestLayout = null,
		envelope = new Envelope(), area = 0, stack = [];

	function capturePosition(_, rectangles, bottom){
		var rect = rectangles[bottom];
		bestPosition.x = rect.x;
		bestPosition.y = rect.y;
		bestPosition.i = rect.i;
	}

	function captureLayout(_, rectangles, bottom){
		var n = rectangles.length;
		bestLayout = new Array(n - bottom);
		for(var i = bottom; i < n; ++i){
			var rect = rectangles[i];
			bestLayout[i - bottom] = {x: rect.x, y: rect.y, i: rect.i};
		}
	}

	if(rectangles.length <= depth){
		stack.push({envelope: envelope, area: area, index: 0});
		bestScore = lookAhead(rectangles, stack, rectangles.length, captureLayout);
		return {
			score:  bestScore,
			layout: bestLayout
		};
	}

	var n = rectangles.length - depth, layout = new Array(n);
	for(var i = 0; i < n; ++i){
		stack.push({envelope: envelope, area: area, index: 0});
		lookAhead(rectangles, stack, depth, capturePosition);
		layout[i] = {x: bestPosition.x, y: bestPosition.y, i: bestPosition.i};
		stack.push({envelope: envelope, area: area, index: bestPosition.i});
		var rect = rectangles[i];
		envelope = new Envelope(envelope);
		envelope.add(bestPosition.i, rect);
		area += rect.area;
	}
	stack.push({envelope: envelope, area: area, index: 0});
	bestScore = lookAhead(rectangles, stack, depth, captureLayout);

	return {
		score:  bestScore,
		layout: layout.concat(bestLayout)
	};
}

module.exports = windowOpt;
