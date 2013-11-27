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
	this.used = {};
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
		this.used[index] = 1;
		if(!group.length){
			node.remove();
		}
		return {index: index, next: next};
	},
	free: function(index, next){
		if(index >= 0 && next){
			this.used[index] = 0;
			var groupIndex = this.rectangles[index].group;
			if(this.groups[groupIndex].push(index) == 1){
				next.addBefore(this.groupNodes[groupIndex]);
			}
		}
		return this;
	}
};


module.exports = RectState;
