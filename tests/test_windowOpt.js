var windowOpt = require("../src/windowOpt");

var rectangles = [], i;

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

rectangles.forEach(function(rect){
	rect.area = rect.w * rect.h;
});

rectangles.sort(function(a, b){ return b.area - a.area; });

console.log(rectangles.length + " rectangles: ", rectangles);

var totalHeight = rectangles.reduce(function(acc, rect){ return acc + rect.h; }, 0),
	totalWidth  = rectangles.reduce(function(acc, rect){ return Math.max(acc, rect.w); }, -Infinity),
	totalArea   = rectangles.reduce(function(acc, rect){ return acc + rect.area; }, 0);
console.log("width: " + totalWidth + ", height: " + totalHeight + ", waste: " +
	(totalWidth * totalHeight - totalArea));

var result = windowOpt(rectangles, 10);
console.log(result);


var Envelope = require("../src/Envelope");
var e = new Envelope();

for(i = 0; i < rectangles.length; ++i){
	console.log(i, rectangles[i]);
	e.add(rectangles[i].i, rectangles[i]);
	console.log(e.cornerPoints);
}