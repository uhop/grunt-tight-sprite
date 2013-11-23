"use strict";


var Envelope  = require("./Envelope");
var lookAhead = require("./lookAhead");


function exactFit2(rectangles){
	var bestLayout = null;

	function captureLayout(_, rectangles){
		bestLayout = rectangles.map(function(rect){
			return {x: rect.x, y: rect.y, i: rect.i};
		});
	}

	var stack = [{envelope: new Envelope(), area: 0, index: 0}];

	var bestScore = lookAhead(rectangles, stack, rectangles.length, captureLayout);

	return {
		score:  bestScore,
		layout: bestLayout
	};
}

module.exports = exactFit2;
