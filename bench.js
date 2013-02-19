var hash = require("./lib/hash");

// Just playing with timing with different definition scopes.
randBuffer = require('./test/helper').randBuffer;
randByte = require('./test/helper').randByte;
function randByte2(){ return Math.floor(Math.random()*(256));}
function randBuffer2(len){ 
  var buf = new Buffer(len);
  for (var i = buf.length - 1; i >= 0; i--) {
    buf[i] = randByte2();
  }
  return buf;  
}

var kB=1024;
var MB=1024*1024;
var GB=1024*1024*1024;

(function(){
  function timeit(runs,iterations,name,f){
    for (var j = 0; j < runs; j++) {
      var startTime=new Date().getTime();
      for (var i=0;i<iterations;i++){
        f();
      };
      var delta = (new Date().getTime() - startTime)/1000;
      var itps = (iterations)/(delta);
      console.log("%sx%d %d it/s - %ds.",name,iterations,itps.toFixed(1),delta);
    }
    console.log();
  }

  console.log('just random');
  var runs=5;
  var iterations=100;
  var blocksize=MB;

  timeit(runs,iterations,'randBuf(MB)',function(){
      randBuffer(blocksize);
  });
  timeit(runs,iterations,'randBuf2(MB)',function(){
      randBuffer2(blocksize);
  });
  timeit(runs,iterations,'randBuf3(MB)',function(){
    var len=blocksize
    var buf = new Buffer(len);
    for (var i = buf.length - 1; i >= 0; i--) {
      buf[i] = randByte2();
    }
    return buf;  
  });
  timeit(runs,iterations,'Math.rnd(MB)',function(){
      for (var bb=0;bb<blocksize;bb++){
        var v = Math.floor(Math.random()*(256))
      }
  });
  timeit(runs,iterations,'randByt(MB)',function(){
      for (var bb=0;bb<blocksize;bb++){
        randByte();
      }
  });

})();
console.log();

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

