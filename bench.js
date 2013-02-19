var hash = require("./lib/hash");
var sprintf = require('sprintf').sprintf;

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

// Pure duck-typing implementation taken from Underscore.js.
function isFunction(object) {
 return !!(object && object.constructor && object.call && object.apply);
}

function timeit(runs,iterations,name,bytesPerIterationForRun,setupForRun,f){
  "use strict";
  for (var run = 0; run < runs; run++) {
    if (isFunction(setupForRun)) setupForRun(run);
    var startTime=new Date().getTime();
    for (var iteration=0;iteration<iterations;iteration++){
      f(run,iteration);
    };

    var delta = (new Date().getTime() - startTime)/1000;
    var bytes = isFunction(bytesPerIterationForRun) ? bytesPerIterationForRun(run) : bytesPerIterationForRun;
    var mbs = iterations * bytes / MB / delta;
    // console.log("%s(%d)x%d %d MB/s - %ds.",name,bytes,iterations,mbs.toFixed(1),delta);
    // console.log(sprintf("%12s %d x%d %d MB/s - %ds.",name,bytes,iterations,mbs.toFixed(1),delta));
    var msg = sprintf("%14s(%10d)x%-7d %.1f MB/s - %.3fs.",name,bytes,iterations,mbs,delta);
    console.log(msg);
  }
  console.log();
}

if(0)(function(){
  "use strict";
  console.log('just random');
  var runs=5;
  var iterations=10;
  var blocksize=MB;

  function setupForRun(){};

  timeit(runs,iterations,'randBuf',blocksize,setupForRun,function(){
    randBuffer(blocksize);
  });
  timeit(runs,iterations,'randBuf2',blocksize,setupForRun,function(){
    randBuffer2(blocksize);
  });
  timeit(runs,iterations,'randBuf3',blocksize,setupForRun,function(){
    var len=blocksize
    var buf = new Buffer(len);
    for (var i = buf.length - 1; i >= 0; i--) {
      buf[i] = randByte2();
    }
    return buf;  
  });
  timeit(runs,iterations,'Math.rnd',blocksize,setupForRun,function(){
    for (var bb=0;bb<blocksize;bb++){
      var v = Math.floor(Math.random()*(256))
    }
  });
  timeit(runs,iterations,'randByt',blocksize,setupForRun,function(){
    for (var bb=0;bb<blocksize;bb++){
      randByte();
    }
  });

})();
console.log();


(function(){
  "use strict";

  // # speed for weak32
  var runs=5;
  var iterations=100;
  var blockSizeRef=102400;

  // used per run
  function bytesPerIterationForRun(run){
    return blockSizeRef<<run;
  };
  var blocksize=0;
  var buf = new Buffer(0);
  function setBlocksizeAndBuf(run){
    blocksize=bytesPerIterationForRun(run);
    buf = randBuffer(blocksize);
  }
  timeit(runs,iterations,'weak32-static',bytesPerIterationForRun,setBlocksizeAndBuf,function(run,iteration){
    var weak32 = hash.weak32(buf);
  });

  function setBlocksizeAndBuf2(run){
    blocksize=bytesPerIterationForRun(run);
    buf = randBuffer(blocksize+iterations);
  }
  timeit(runs,iterations,'weak32-slide',bytesPerIterationForRun,setBlocksizeAndBuf2,function(run,iteration){
    var weak32 = hash.weak32(buf,null,iteration,iteration+blocksize);
  });

  console.log('rolling sums - hash all positions')
  iterations*=1000;
  // PROBLEM PROBLEM PROBLEM PROBLEM
  function bytesPerIterationForRunRoll(run){
    return blockSizeRef*1024+iterations;
  };
  function setBlocksizeAndBufRoll(run){
    var blocksize=blockSizeRef*1024;
    var buf = randBuffer(blocksize+iterations);
  }
  var prev;
  timeit(runs,iterations,'weak32-roll',bytesPerIterationForRunRoll,setBlocksizeAndBufRoll,function(run,iteration){
      var weak32 = hash.weak32(buf,prev,iteration,iteration+blocksize);
      prev=weak32;
  });

})();

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
    console.log("weak32-static(%d)x%d %d MB/s - %ds.",blocksize,iterations,mbs.toFixed(1),delta);
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
    console.log("weak32-slide(%d)x%d %d MB/s - %ds.",blocksize,iterations,mbs.toFixed(1),delta);
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

