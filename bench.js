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

function timeit(runs,iterations,name,bytesForRun,setupForRun,f){
  "use strict";
  for (var run = 0; run < runs; run++) {
    if (isFunction(setupForRun)) setupForRun(run);
    var startTime=new Date().getTime();
    for (var iteration=0;iteration<iterations;iteration++){
      f(run,iteration);
    };

    var delta = (new Date().getTime() - startTime)/1000;
    var bytes = isFunction(bytesForRun) ? bytesForRun(run) : bytesForRun;
    var mbs = bytes / MB / delta;
    var msg = sprintf("%14s(%10d) %7dit %.1f MB/s - %.3fs.",name,bytes,iterations,mbs,delta);
    console.log(msg);
  }
  console.log();
}

(function(){
  "use strict";
  console.log('just random');
  var runs=5;
  var iterations=10;
  var blocksize=MB;
  var bytesForRun=blocksize*iterations;
  function setupForRun(){};

  timeit(runs,iterations,'randBuf',bytesForRun,setupForRun,function(){
    randBuffer(blocksize);
  });
  timeit(runs,iterations,'randBuf2',bytesForRun,setupForRun,function(){
    randBuffer2(blocksize);
  });
  timeit(runs,iterations,'randBuf3',bytesForRun,setupForRun,function(){
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
  var iterations=1000;
  var blockSizeRef=10240;

  // used per run
  function bytesForRun(run){
    return iterations*blockSizeRef<<run;
  };
  var blocksize=0;
  var buf = new Buffer(0);
  function setBlocksizeAndBuf(run){
    blocksize=blockSizeRef<<run;
    buf = randBuffer(blocksize);
  }
  timeit(runs,iterations,'weak32-static',bytesForRun,setBlocksizeAndBuf,function(run,iteration){
    var weak32 = hash.weak32(buf);
  });

  function setBlocksizeAndBuf2(run){
    blocksize=blockSizeRef<<run;
    buf = randBuffer(blocksize+iterations);
  }
  timeit(runs,iterations,'weak32-slide',bytesForRun,setBlocksizeAndBuf2,function(run,iteration){
    var weak32 = hash.weak32(buf,null,iteration,iteration+blocksize);
  });

  console.log('rolling sums - hash all positions')
  iterations*=1000;
  // PROBLEM PROBLEM PROBLEM PROBLEM
  function bytesForRunRoll(run){
    return (blockSizeRef*1024+iterations);
  };
  function setBlocksizeAndBufRoll(run){
    blocksize=blockSizeRef*1024;
    buf = randBuffer(blocksize+iterations);
  }
  var prev;
  timeit(runs,iterations,'weak32-roll',bytesForRunRoll,setBlocksizeAndBufRoll,function(run,iteration){
    var weak32 = hash.weak32(buf,prev,iteration,iteration+blocksize);
    prev=weak32;
  });

})();


