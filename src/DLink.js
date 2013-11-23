"use strict";


function DLink(){
	this.next = this.prev = this;
}


DLink.prototype = {
	add: function(link){
		var last  = link.prev;
		last.next = this.next;
		last.next.prev = last;
		link.prev = this;
		this.next = link;
		return this;
	},
	addBefore: function(link){
		var last  = link.prev;
		link.prev = this.prev;
		link.prev.next = link;
		last.next = this;
		this.prev = last;
		return this;
	},
	remove: function(){
		this.prev.next = this.next;
		this.next.prev = this.prev;
		this.next = this.prev = this;
		return this;
	},
	extract: function(from, upto){
		from.prev.next = upto.next;
		upto.next.prev = from.prev;
		from.prev = upto;
		upto.next = from;
		return from;
	}
	/*
	// possible candidates for methods
	isEmpty: function(){
		return this.next === this;
	},
	push: function(){
		var link = new DLink();
		this.addBefore(link);
		return link;
	},
	pop: function(){
		return this.prev.remove();
	}
	*/
};


module.exports = DLink;
