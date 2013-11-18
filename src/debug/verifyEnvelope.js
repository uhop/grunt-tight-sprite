"use strict";


function verifyEnvelope(e){
	var cp = e.cornerPoints;
	if(cp.length < 1){
		return false;
	}
	var p = cp[0];
	if(p.x != 0){
		return false;
	}
	if(p.y < 0){
		return false;
	}
	for(var i = 1, n = cp.length; i < n; ++i){
		var c = cp[i];
		if(c.x < 0){
			return false;
		}
		if(c.y < 0){
			return false;
		}
		if(p.y <= c.y){
			return false;
		}
		if(p.x >= c.x){
			return false;
		}
		p = c;
	}
	if(p.x < 0){
		return false;
	}
	if(p.y != 0){
		return false;
	}
	return true;
}

module.exports = verifyEnvelope;
