var assert = require("assert");

// Should probably require the top level index.js ???
var hash = require("../lib/hash");

describe('Hash', function(){
  describe('md5', function(){
    it('should return a known value for a "hello" string input', function(){
      assert.equal("5d41402abc4b2a76b9719d911017c592", hash.md5("hello"));
    });
    it('should return a known value for a "hello" buffer input', function(){
      assert.equal("5d41402abc4b2a76b9719d911017c592", hash.md5(new Buffer("hello")));
    });
    it('should not return an empty value for a known imput', function(){
      assert.notEqual("", hash.md5("hello"));
    });
    it('should test more things')
  });

  describe('weak32', function(){
    it('should return a known value for a "hello" buffer input', function(){
      assert.deepEqual({"a":532,"b":1575,"sum":103219732}, hash.weak32(new Buffer("hello")));
    });
    it('should return a known value for [0,0,0,..] buffer', function(){
      // new Buffer not guaranteed to be zero filled.
      var buf=new Buffer(10); buf.fill(0);
      assert.deepEqual({"a":0,"b":0,"sum":0}, hash.weak32(buf));
    });
    it('should return a known value for [1] buffer', function(){
      assert.deepEqual({"a":1,"b":1,"sum":65537}, hash.weak32(new Buffer([1])));
    });
    it('should return a known value for [1,1] buffer', function(){
      assert.deepEqual({"a":2,"b":3,"sum":196610}, hash.weak32(new Buffer([1,1])));
    });
    it('should return a known value for [1,2] buffer', function(){
      assert.deepEqual({"a":3,"b":4,"sum":262147}, hash.weak32(new Buffer([1,2])));
    });
    it('should return a known value for [2,1] buffer', function(){
      assert.deepEqual({"a":3,"b":5,"sum":327683}, hash.weak32(new Buffer([2,1])));
    });
  });

});

function randByte(){ return Math.floor(Math.random()*(256));}
function randBuffer(len){ 
  var buf = new Buffer(len);
  for (var i = buf.length - 1; i >= 0; i--) {
    buf[i] = randByte();
  }
  return buf;  
}
for (var j=0;j<30;j++){
  // console.log('r',randBuffer(30).toString('hex'));
}