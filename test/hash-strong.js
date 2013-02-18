var assert = require("assert");

// Should probably require the top level index.js ???
var hash = require("../lib/hash");

describe('Hash', function(){
  describe('strong', function(){
    it('should return a known value for a "hello" string input', function(){
      assert.equal(hash.strong("hello"), "5d41402abc4b2a76b9719d911017c592");
    });
    it('should return a known value for a "hello" buffer input', function(){
      assert.equal(hash.strong(new Buffer("hello")), "5d41402abc4b2a76b9719d911017c592");
    });
    it('should not return an empty value for a known imput', function(){
      assert.notEqual(hash.strong("hello"), "");
    });
    it('should test more things')
  });
});
