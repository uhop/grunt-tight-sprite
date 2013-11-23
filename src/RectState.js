"use strict";


var groupRectangles = require("./groupRectangles");
var DLink = require("./DLink");


function RectState(rectangles){
	// rectangles are assumed to be sorted and groupped
	this.rectangles = rectangles;
	this.groups = groupRectangles.getGroups(rectangles);
	this.available = this.groups.length;
	this.used = {};
}


RectState.prototype = {
	allocate: function(group){
		var i = -1;
		++group;
		do{
			for(++i; !this.groups[i].length; ++i);
		}while(--group);
		var index = this.groups[i].pop();
		this.used[index] = 1;
		return index;
	},
	free: function(index){
		if(this.used[index]){
			this.used[index] = 0;
			var rect = this.rectangles[index];
			this.groups[rect.group].push(index);
		}
		return this;
	}
};


module.exports = RectState;
