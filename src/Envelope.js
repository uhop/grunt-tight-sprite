"use strict";


var bsearch = require("heya-ctr/algos/binarySearch");

var searchHorizontally = bsearch("a.x < b.x").compile(),
	searchVertically   = bsearch("a.y > b.y").compile();


function Envelope(){
	this.cornerPoints = [{x: 0, y: 0}];
}

Envelope.prototype = {
	add: function(index, rect){
		// This function mutates an array, and its objects.
		// It is possible to make objects immutable.
		// Potentially, it may reduce the memory load.
		var cp = this.cornerPoints, p = cp[index],
			br = {x: p.x + rect.w, y: p.y + rect.h};
		rect.x = p.x;
		rect.y = p.y;
		var i1 = searchVertically(cp, br, 0, index),
			i2 = searchHorizontally(cp, br, index + 1),
			next = i1 + 1, len = i2 - next;
		cp[i1].y = br.y;
		if(i2 < cp.length && cp[i2].x == br.x){
			cp.splice(next, len);
		}else{
			if(len > 0){
				cp.splice(next, len - 1);
				cp[next].x = br.x;
			}else{
				cp.splice(next, 0, {x: br.x, y: rect.y});
			}
		}
		return this;
	},
	areaIn: function(){
		var cp = this.cornerPoints, p = cp[0], area = 0;
		for(var i = 1, n = cp.length; i < n; ++i){
			var c = cp[i];
			area += p.y * (x - p.x);
			p = c;
		}
		return area;
	},
	clone: function(){
		// The next one is a candidate for heya-pipe.
		// All it does it clones an array and its objects.
		// If we make objects immutable, we can just slice an array.
		return this.cornerPoints.map(function(p){
			return {x: p.x, y: p.y};
		});
	}
};

module.exports = Envelope;
