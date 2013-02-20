"use strict";

var hash = require("./lib/hash");
var Generator = require('./test/helper').Generator;

var kB=1024;
var MB=1024*1024;
var GB=1024*1024*1024;

console.log();
(function(){
  console.log('collision rates')

  var gen = new Generator(kB,MB)
  // var gen = new Generator(1024,4096);
  var prev;
  var it=0;
  var hashesA={};
  var hashesB={};
  var collisions=0;
  var shownKeys=0;
  while (true) {
    // g:=={buffer,start,end}
    var g = gen.next();
    var weak32 = hash.weak32(g.buffer,prev,g.start,g.end);

    if (hashesA[weak32.a]){
      collisions++;
      // console.log('got collision %d/%d: %j',collisions,it,hashesA[weak32.a]);
      var keys=Object.keys(hashesA).length;
      if (keys>shownKeys){
        console.log('keys',keys,'it',it);
        shownKeys=keys;
      }
      // assert.equal(hashesA[weak32.a].a,weak32.a);
    } else {
      weak32.firstIndex=it;
      hashesA[weak32.a]=weak32;
    }

    // if (it%MB==0)console.log('w32',it,weak32);
    if (it%GB==0)console.log('---GB----');
    if (it%GB==0 && it>0)process.exit();

    prev = weak32;
    it++;

  } 


})();

