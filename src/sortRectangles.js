"use strict";


module.exports = {
	byAreaDescending: function(rectangles){
		rectangles.forEach(function(rect){
			rect.area = rect.w * rect.h;
		});
		rectangles.sort(function(a, b){
			var sign = b.area - a.area;
			if(sign) return sign;
			sign = b.w - a.w;
			if(sign) return sign;
			return b.h - a.h;
		});
	},
	byPerimeterDescending: function(rectangles){
		rectangles.sort(function(a, b){
			var sign = b.w + b.h - a.w - a.h;
			if(sign) return sign;
			sign = b.w - a.w;
			if(sign) return sign;
			return b.h - a.h;
		});
	}
};
