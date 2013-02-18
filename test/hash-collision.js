var assert = require("assert");

// Should probably require the top level index.js ???
var hash = require("../lib/hash");
var randBuffer = require("./helper").randBuffer;

describe('Hash', function(){
  describe('collision', function(){
    it('should eventually create a 16bit collision', function(){
      var collisions=0;
      var blocksize=1024;
      var shifts=1000;
      var buf = randBuffer(blocksize+shifts-1);
      var hashes = {};
      var prev;
      for (var i=0;i<shifts;i++){
        var weak32 = hash.weak32(buf,prev,i,i+blocksize);
        weak32.index=i;
        var weak16 = weak32.b;
        if (hashes[weak16]){
          console.log('got collision %d: %j : %j',i,hashes[weak16],weak32);
          collisions++;
          assert.equal(hashes[weak16].b,weak32.b);
        }
        hashes[weak16]=weak32;
        prev = weak32;
      }
      // console.log('Collisions: %d',collisions);
      assert.ok(collisions>0,'At least one collision');
    });

  });

});
