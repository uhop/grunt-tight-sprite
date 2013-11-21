"use strict";


var bsearch = require("heya-ctr/algos/binarySearch");

var searchHorizontally = bsearch("a.x < b.x").compile(),
	searchVertically   = bsearch("a.y > b.y").compile();


var p0 = {x: 0, y: 0};

function Envelope(envelope){
	this.cornerPoints = envelope instanceof Envelope ? envelope.cornerPoints.slice(0) : [p0];
}

Envelope.prototype = {
	add: function(index, rect){
		var cp = this.cornerPoints, p = cp[index],
			br = {x: p.x + rect.w, y: p.y + rect.h};
		rect.x = p.x;
		rect.y = p.y;
		rect.i = index;
		var i1 = searchVertically(cp, br, 0, index),
			i2 = searchHorizontally(cp, br, index + 1),
			len = i2 - i1;
		if(i2 < cp.length && cp[i2].x == br.x){
			cp.splice(i1, len, {x: cp[i1].x, y: br.y});
		}else{
			cp.splice(i1, len, {x: cp[i1].x, y: br.y}, {x: br.x, y: i2 < cp.length ? rect.y : 0});
		}
		return this;
	},
	areaIn: function(){
		var cp = this.cornerPoints, p = cp[0], area = 0;
		for(var i = 1, n = cp.length; i < n; ++i){
			var c = cp[i];
			area += p.y * (c.x - p.x);
			p = c;
		}
		return area;
	},
	clone: function(){
		return new Envelope(this);
	}
};

module.exports = Envelope;
