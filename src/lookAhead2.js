"use strict";


var Envelope = require("./Envelope");


// At each level we have:
//
// * current envelope
// * currently occupied (not wasted) area
// * a corner point number we should try
// * a rectangle we should try
//
// This is a classic stack-based algorithm. We should:
//
// 1. If we cannot use the corner point, we backtrack.
// 2. We try the corner point, saving the next corner point.
// 3. If our area criterium is negative, we backtrack.
// 4. Save an envelope, area, and start the corner point from 0.


function lookAhead2(rectangles, stack, depth, callback){
	var bestScore = Infinity, bottom = stack.length - 1,
		limit = isNaN(depth) ? rectangles.length :
			Math.min(rectangles.length, bottom + depth),
		useFinalTest = limit == rectangles.length,
		mark, level, top, cp, rect, score;
	while(stack.length > bottom){
		if(stack.length !== mark){
			level = stack.length - 1;
			top = stack[level];
			cp = top.envelope.cornerPoints;
		}
		if(level >= limit){
			// we placed all rectangles
			score = (useFinalTest ? cp[0].y * cp[cp.length - 1].x : top.envelope.areaIn()) - top.area;
			if(score < bestScore){
				// the best score so far
				bestScore = score;
				callback && callback(score, rectangles, bottom, limit);
				if(score == 0){
					// the perfect score
					stack.splice(bottom, stack.length);
					break;
				}
			}
			stack.pop();
			continue;
		}
		if(top.index >= cp.length){
			// we tried all corner points
			stack.pop();
			continue;
		}
		if(top.group >= groups.length){
			// we tried all rectangles
			++top.index;
			top.rectangle = 0;
			continue;
		}
		if(top.rectangle in taken){
			// the current rectangle is already used
			++top.rectangle;
			continue;
		}
		rect = rectangles[top.rectangle];
		var e = new Envelope(top.envelope), area = top.area + rect.area;
		e.add(top.index, rect);
		// prepare for the next cycle: unfinished
		stack.push({envelope: e, area: area, index: 0, group: 0});
	}
	return bestScore;
}

module.exports = lookAhead;
