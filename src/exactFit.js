"use strict";


var Envelope = require("./Envelope");


// At each level we have:
//
// * level number from 0 to rectangles.length - 1
// * current envelope
// * current occupied (not wasted) area
// * the corner point number we should try
//
// This is a classic stack-based algorithm. We should:
//
// 1. If we cannot use the corner point, we backtrack.
// 2. We try the corner point, saving the next corner point.
// 3. If our area criterium is negative, we backtrack.
// 4. Advance the level number, save it along with current
//    envelope, area, and start the corner point from 0.


function exactFit(rectangles){
	var bestScore = Infinity, bestLayout = null, score,
		stack = [{level: 0, envelope: new Envelope(), area: 0, index: 0}];
	while(stack.length){
		var top = stack[stack.length - 1], cp = top.envelope.cornerPoints;
		if(top.level >= rectangles.length){
			// did we place all rectangles? yes
			score = cp[0].y * cp[cp.length - 1].x - top.area;
			if(score < bestScore){
				// is it the best score so far? yes
				bestScore = score;
				bestLayout = rectangles.map(function(rect){
					return {x: rect.x, y: rect.y};
				});
				if(score == 0){
					// perfect score
					break;
				}
			}
			stack.pop();
			continue;
		}
		if(top.index >= cp.length){
			// did we try all corner points for this rectangle? yes
			stack.pop();
			continue;
		}
		var e = new Envelope(top.envelope), rect = rectangles[top.level];
		e.add(top.index, rect);
		score = e.areaIn() - top.area - rect.area;
		++top.index;
		if(score < bestScore){
			// is our current score better than the best score so far? yes
			stack.push({level: top.level + 1, envelope: e, area: top.area + rect.area, index: 0});
		}
	}
	return {
		score:  bestScore,
		layout: bestLayout
	};
}

module.exports = exactFit;
