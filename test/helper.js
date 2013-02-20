
"use strict";

function randByte(){ return Math.floor(Math.random()*(256));}
function randBuffer(len){ 
	var buf = new Buffer(len);
	for (var i = buf.length - 1; i >= 0; i--) {
		buf[i] = randByte();
	}
	return buf;  
}

/*
  Generator.next() returns {buffer:this.buffer, start:start, end:end}
  -the buffer will be shifted by one every call
  -buffer[start-1] will always be available (except on first call)
  -buffer's indexes will at least cover [start-1,end)
*/
var Generator = function(blocksize,length){
	this.blocksize=blocksize;
	this.length=length;
	this.buffer = null; 
	this.current=0;
	this.last=length - blocksize;
};
Generator.prototype.next = function() {
	if (!this.buffer) {
		this.buffer = randBuffer(this.length);
	} else if (this.current >= this.last) {
    // copy over the end first/after.
    var old = this.buffer;
    this.buffer = randBuffer(this.length);
    old.copy(this.buffer,0,this.last); // to the end
    this.current=1;
  } else {
  	this.current++;
  }

  var start=this.current;
  var end = start+this.blocksize;

  return {buffer:this.buffer, start:start, end:end}
}


module.exports = {
	randByte: randByte,
	randBuffer: randBuffer,
	Generator: Generator
};