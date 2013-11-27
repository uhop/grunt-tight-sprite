"use strict";


module.exports = {
	getGroups: function(rectangles){
		// rectangles are already sorted in such a way,
		// so identically shaped rectangles are grouped
		var prev = null, groups = [], group = [];
		rectangles.forEach(function(rect, i){
			rect.n = i;
			if(i){
				rect.group = prev.group;
				if(rect.w != prev.w || rect.h != prev.h){
					++rect.group;
					groups.push(group);
					group = [];
				}
			}else{
				rect.group = 0;
			}
			group.push(i);
			prev = rect;
		});
		if(rectangles.length){
			groups.push(group);
		}
		return groups;
	},
	makeSwapGroups: function(groups){
		var n = groups.length, swapGroups = new Array(n);
		for(var i = 0; i < n; ++i){
			var s = [];
			for(var j = 0; j < n; ++j){
				if(i !== j){
					s.push.apply(s, groups[j]);
				}
			}
			swapGroups[i] = s;
		}
		return swapGroups;
	},
	exclude: function(set, group){
		for(var i = 0, n = group.length; i < n; ++i){
			delete set[group[i]];
		}
	},
	include: function(set, group){
		for(var i = 0, n = group.length; i < n; ++i){
			set[group[i]] = 1;
		}
	}
};
