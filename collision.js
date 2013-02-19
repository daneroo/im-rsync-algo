var hash = require("./lib/hash");

var assert = require("assert");

var kB=1024;
var MB=1024*1024;
var GB=1024*1024*1024;
randBuffer = require('./test/helper').randBuffer;

Generator = function(blocksize,length){
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


console.log();
(function(){
  console.log('collision rates')

  var gen = new Generator(kB,MB)
  // var gen = new Generator(1024,4096);
  var prev;
  var it=0;
  hashesA={};
  hashesB={};

  while (true) {
    // {buf,start,end}
    var g = gen.next();
    // var part = g.buffer.toString('hex',g.start,g.end);
    // console.log('computed on %s - %d,%d',part,g.start,g.end);

    // var expected = hash.weak32(g.buffer,null,g.start,g.end);
    var incremental = hash.weak32(g.buffer,prev,g.start,g.end);
    // assert.deepEqual(expected, incremental);

    if (it%MB==0)console.log('w32',it,incremental);
    if (it%GB==0)console.log('---GB----');
    if (it%GB==0 && it>0)process.exit();

    prev = incremental;
    it++;

  } 


})();

