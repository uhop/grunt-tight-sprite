"use strict";


var Envelope  = require("./Envelope");
var RectState = require("./RectState");
var lookAhead = require("./lookAhead2");
var sortRectangles = require("./sortRectangles");


function windowOpt2(rectangles, depth){
	sortRectangles.byAreaDescending(rectangles);

	var bestScore, bestPosition = {x: 0, y: 0, i: 0, n: 0}, bestLayout = null,
		envelope = new Envelope(), state = new RectState(rectangles),
		area = 0, stack = [];

	function capturePosition(score, state, stack, bottom){
		var rect = rectangles[stack[bottom].rectIndex];
		bestPosition.x = rect.x;
		bestPosition.y = rect.y;
		bestPosition.i = rect.i;
		bestPosition.n = rect.n;
	}

	function captureLayout(score, state, stack, bottom){
		var n = rectangles.length;
		bestLayout = new Array(n - bottom);
		for(var i = bottom; i < n; ++i){
			var rect = rectangles[stack[i].rectIndex];
			bestLayout[i - bottom] = {x: rect.x, y: rect.y, i: rect.i, n: rect.n};
		}
	}

	if(rectangles.length <= depth){
		stack.push({envelope: envelope, area: area, index: 0, rectIndex: -1, next: null});
		bestScore = lookAhead(state, stack, rectangles.length, captureLayout);
		return {
			score:  bestScore,
			layout: bestLayout
		};
	}

	var n = rectangles.length - depth, layout = new Array(n);
	for(var i = 0; i < n; ++i){
		stack.push({envelope: envelope, area: area, index: 0, rectIndex: -1, next: null});
		lookAhead(state, stack, depth, capturePosition);
		layout[i] = {x: bestPosition.x, y: bestPosition.y, i: bestPosition.i, n: bestPosition.n};
		var rect = rectangles[bestPosition.n],
			next = state.getRectangle(state.groupNodes[rect.group]);
		stack.push({envelope: envelope, area: area, index: bestPosition.i, rectIndex: next.index, next: next.next});
		envelope = new Envelope(envelope);
		envelope.add(bestPosition.i, rect);
		area += rect.area;
	}
	stack.push({envelope: envelope, area: area, index: 0, rectIndex: -1, next: null});
	bestScore = lookAhead(state, stack, depth, captureLayout);

	return {
		score:  bestScore,
		layout: layout.concat(bestLayout)
	};
}

module.exports = windowOpt2;
