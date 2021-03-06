var assert = require("assert");

// Should probably require the top level index.js ???
var hash = require("../lib/hash");
var randBuffer = require("./helper").randBuffer;

describe('Hash', function(){
  describe('weak32', function(){
    it('should return a known value for a "hello" buffer input', function(){
      assert.deepEqual(hash.weak32(new Buffer("hello")), {"a":532,"b":1575,"sum":103219732});
    });
    it('should return a known value for [0,0,0,..] buffer', function(){
      // new Buffer not guaranteed to be zero filled.
      var buf=new Buffer(10); buf.fill(0);
      assert.deepEqual(hash.weak32(buf), {"a":0,"b":0,"sum":0});
    });
    it('should return a known value for [1] buffer', function(){
      assert.deepEqual(hash.weak32(new Buffer([1])), {"a":1,"b":1,"sum":65537});
    });
    it('should return a known value for [1,1] buffer', function(){
      assert.deepEqual(hash.weak32(new Buffer([1,1])), {"a":2,"b":3,"sum":196610});
    });
    it('should return a known value for [1,2] buffer', function(){
      assert.deepEqual(hash.weak32(new Buffer([1,2])), {"a":3,"b":4,"sum":262147});
    });
    it('should return a known value for [2,1] buffer', function(){
      assert.deepEqual(hash.weak32(new Buffer([2,1])), {"a":3,"b":5,"sum":327683});
    });

    it('should respect it\s start argument for [8,9] buffer', function(){
      assert.deepEqual(hash.weak32(new Buffer([8,9]), null,1), hash.weak32(new Buffer([9])));
    });

    it('should respect it\s start argument', function(){
      var buf123=new Buffer([1,2,3,4,5,6]);
      var buf234=new Buffer([2,3,4,5,6]);
      assert.deepEqual(hash.weak32(buf123, null, 1), hash.weak32(buf234,null, 0));
    });
    it('should respect it\s end argument', function(){
      assert.deepEqual(hash.weak32(new Buffer([1,2,3]), null, 0,2), hash.weak32(new Buffer([1,2])));
    });
    it('should respect it\s start and end arguments', function(){
      var buf123=new Buffer([1,2,3,4,5,6]);
      var buf234=new Buffer([2,3,4,5,6,7]);
      assert.deepEqual(hash.weak32(buf123, null, 3,5), hash.weak32(buf234,null, 2,4));
    });

    it('should be able to calculate incrementally', function(){
      var len=1024;
      var buf = randBuffer(len+1);
      var prev = hash.weak32(buf,null,1,len-1)
      var expected = hash.weak32(buf,null,2,len);
      var incremental = hash.weak32(buf,prev,2,len);
      assert.deepEqual(expected, incremental);
    });

    it('should be able to calculate incrementally,repeatedly', function(){
      var blocksize=1024;
      var shifts=10000;
      var buf = randBuffer(blocksize+shifts+1);
      var prev = null;
      for (var i=0;i<shifts;i++){
        var expected = hash.weak32(buf,null,i,i+blocksize);
        var incremental = hash.weak32(buf,prev,i,i+blocksize);
        assert.deepEqual(expected, incremental);
        prev = incremental;
      }
    });


  });

});
