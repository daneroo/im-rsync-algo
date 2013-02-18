var hash = require("./lib/hash");

var MB=1024*1024;
var GB=1024*1024*1024;
randBuffer = require('./test/helper').randBuffer;
// # speed for weak32
var runs=5;
var iterations=1000;
var blockSizeRef=10240;

(function(){
  for (var j = 0; j < runs; j++) {
    var blocksize=(blockSizeRef)<<j;
    var buf = randBuffer(blocksize);
    var startTime=new Date().getTime()
    for (var i=0;i<iterations;i++){
      var weak32 = hash.weak32(buf);
    }
    var delta = (new Date().getTime() - startTime)/1000;
    var mbs = (blocksize/MB)/(delta/iterations);
    console.log("weak32(%d)x%d %d MB/s - %ds.",blocksize,iterations,mbs.toFixed(1),delta);
  };
})();

console.log();

(function(){
  for (var j = 0; j < runs; j++) {
    var blocksize=(blockSizeRef)<<j;
    var buf = randBuffer(blocksize+iterations);
    var startTime=new Date().getTime()
    for (var i=0;i<iterations;i++){
      var weak32 = hash.weak32(buf,null,i,i+blocksize);
    }
    var delta = (new Date().getTime() - startTime)/1000;
    var mbs = (blocksize/MB)/(delta/iterations);
    console.log("weak32(%d)x%d %d MB/s - %ds.",blocksize,iterations,mbs.toFixed(1),delta);
  };
})();

console.log();

iterations*=1000;
(function(){
  console.log('rolling sums - hash all positions')
  for (var j = 0; j < runs; j++) {
    var blocksize=(blockSizeRef*1024);

    var buf = randBuffer(blocksize+iterations);
    var startTime=new Date().getTime();
    var prev;
    for (var i=0;i<iterations;i++){
      var weak32 = hash.weak32(buf,prev,i,i+blocksize);
      prev=weak32;
    }
    var delta = (new Date().getTime() - startTime)/1000;
    var mbs = ((blocksize+iterations)/MB)/(delta);
    console.log("weak32-roll(%d+%d) %d MB/s - %ds.",blocksize,iterations,mbs.toFixed(1),delta);
  };
})();

