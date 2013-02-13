var hash = require("./lib/hash");

function randByte(){ return Math.floor(Math.random()*(256));}
function randBuffer(len){ 
  var buf = new Buffer(len);
  for (var i = buf.length - 1; i >= 0; i--) {
    buf[i] = randByte();
  }
  return buf;  
}

// # speed for waek32
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
    var kbs = (blocksize/1024)/(delta/iterations);
    console.log("weak32(%d)x%d %d kB/s",blocksize,iterations,kbs);
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
    var kbs = (blocksize/1024)/(delta/iterations);
    console.log("weak32(%d)x%d %d kB/s",blocksize,iterations,kbs);
  };
})();

console.log();

iterations*=1;
(function(){
  for (var j = 0; j < runs; j++) {
    var blocksize=(blockSizeRef*1024);

    var buf = randBuffer(blocksize+iterations);
    var startTime=new Date().getTime();
    var prev
    for (var i=0;i<iterations;i++){
      var weak32 = hash.weak32ttezel(buf,prev,i,i+blocksize);
      prev=weak32;
    }
    var delta = (new Date().getTime() - startTime)/1000;
    var kbs = (blocksize/1024)/(delta/iterations);
    console.log("weak32(%d)x%d %d kB/s - %ds.",blocksize,iterations,kbs,delta);
  };
})();



