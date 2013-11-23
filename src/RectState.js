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
	allocate: function(groupIndex){
		for(var i = 0;; ++i){
			var group = this.groups[i];
			if(group.length){
				if(!groupIndex--){
					break;
				}
			}
		}
		var index = group.pop();
		this.used[index] = 1;
		if(!group.length){
			--this.available;
		}
		return index;
	},
	free: function(index){
		if(this.used[index]){
			this.used[index] = 0;
			if(this.groups[this.rectangles[index].group].push(index) == 1){
				++this.available;
			}
		}
		return this;
	}
};


module.exports = RectState;
