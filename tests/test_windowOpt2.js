var windowOpt = require("../src/windowOpt2");

var rectangles = [], i;

// create a sample
for(i = 0; i < 10; ++i){
	rectangles.push({w: 16, h: 16});
}
for(i = 0; i < 6; ++i){
	rectangles.push({w: 32, h: 32});
}
for(i = 0; i < 11; ++i){
	rectangles.push({w: 24, h: 24});
}
for(i = 0; i < 4; ++i){
	rectangles.push({w: 40, h: 40});
}

var result = windowOpt(rectangles, 4);
console.log(rectangles.length + " rectangles: ", rectangles);
console.log(result);

var totalHeight = rectangles.reduce(function(acc, rect){ return acc + rect.h; }, 0),
	totalWidth  = rectangles.reduce(function(acc, rect){ return Math.max(acc, rect.w); }, -Infinity),
	totalArea   = rectangles.reduce(function(acc, rect){ return acc + rect.area; }, 0);
console.log("width: " + totalWidth + ", height: " + totalHeight + ", waste: " +
	(totalWidth * totalHeight - totalArea));
