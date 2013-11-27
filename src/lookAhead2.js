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


function lookAhead2(state, stack, depth, callback){
	var bestScore = Infinity, bottom = stack.length - 1,
		rl = state.rectangles.length, limit = Math.min(rl, bottom + depth),
		mark, level, top, cp;
	while(stack.length > bottom){
		if(stack.length !== mark){
			level = stack.length - 1;
			top = stack[level];
			cp = top.envelope.cornerPoints;
			mark = stack.length;
		}
		if(level >= limit){
			// we placed all rectangles
			var score = cp[0].y * cp[cp.length - 1].x - top.area;
			if(score < bestScore){
				// the best score so far
				bestScore = score;
				callback && callback(score, state, stack, bottom, limit);
				if(score == 0){
					// the perfect score
					while(stack.length > bottom){
						top = stack.pop();
						state.free(top.rectIndex, top.next);
					}
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
		state.free(top.rectIndex, top.next);
		var next = state.getRectangle(top.next);
		if(!next){
			// we tried all rectangles
			++top.index;
			top.rectIndex = -1;
			top.next = null;
			continue;
		}
		top.rectIndex = next.index;
		top.next = next.next;
		var rect = state.rectangles[top.rectIndex],
			e = new Envelope(top.envelope), area = top.area + rect.area;
		e.add(top.index, rect);
		// prepare for the next cycle
		stack.push({envelope: e, area: area, index: 0, rectIndex: -1, next: null});
	}
	return bestScore;
}

module.exports = lookAhead2;
