"use strict";


var groupRectangles = require("./groupRectangles");
var DLink = require("./DLink");


function RectState(rectangles){
	// rectangles are assumed to be sorted and groupped
	this.rectangles = rectangles;
	this.groups = groupRectangles.getGroups(rectangles);
	this.groupList = new DLink();
	this.groupNodes = this.groups.map(function(_, index){
		var node = new DLink();
		node.index = index;
		this.groupList.addBefore(node);
		return node;
	}, this);

	this.totalArea = this.rectangles.reduce(function(acc, rect){
		return acc + rect.area;
	}, 0);
	this.minSide = Math.ceil(Math.sqrt(this.totalArea));
}

var H_LIMIT = 121;

function sigmoid(x){
	return 1 / (1 + Math.exp(-x));
}

function S(x, scale, bias){
	return sigmoid(2 * (x - bias) * scale);
}

RectState.prototype = {
	getRectangle: function(node){
		node = node || this.groupList.next;
		if(node === this.groupList){
			return null;
		}
		var next = node.next,
			group = this.groups[node.index],
			index = group.pop();
		if(!group.length){
			node.remove();
		}
		return {index: index, next: next};
	},
	free: function(index, next){
		if(index >= 0 && next){
			var groupIndex = this.rectangles[index].group;
			if(this.groups[groupIndex].push(index) == 1){
				next.addBefore(this.groupNodes[groupIndex]);
			}
		}
		return this;
	},
	getScore: function(w, h, envelopeArea, area, diff){
		return [Math.max(this.totalArea, w * h), envelopeArea - area, diff, this.totalArea - area]; //
		//return [Math.max(this.totalArea, w * h), envelopeArea - area, diff]; // 960
		//return [Math.max(this.totalArea, w * h), envelopeArea - area, diff, this.totalArea - area]; // 960
		//return [Math.max(this.totalArea, w * h), envelopeArea - area, diff, w * h < this.totalArea ? Math.abs(h - w) : 0]; // 1600
		//return h > H_LIMIT ? Infinity : Math.max(envelopeArea - area, w * h - this.totalArea);
		//return h > H_LIMIT ? Infinity : (w * h < this.totalArea ? this.totalArea + envelopeArea - area : w * h) - area;
		//return h > H_LIMIT ? Infinity : (envelopeArea - area) + Math.max(0, w * h - envelopeArea - (this.totalArea - area));
		//return Math.max(w * h, this.totalArea) - area;
		//return envelopeArea - area + Math.max(w * h - envelopeArea, this.totalArea - area);

		// MINIMUM: 640
		var minimizeEnvelope = area / this.totalArea < 0.5 ? 1 : 0, H_LIMIT = 121;
		//var minimizeEnvelope = w * h < this.totalArea ? 1 : 0;
		return h > H_LIMIT ? Infinity : (envelopeArea - area) * minimizeEnvelope +
			(w * h - area) * (1 - minimizeEnvelope);
	},
	acceptScore: function(score, bestScore){
		//return bestScore === null || score < bestScore;
		if(bestScore === null){
			return true;
		}
		if(!isNaN(score)){
			return score < bestScore;
		}
		for(var i = 0, n = score.length; i < n; ++i){
			if(score[i] !== bestScore[i]){
				return score[i] < bestScore[i];
			}
		}
		return false;
	}
};


module.exports = RectState;
