var assert = require("assert")

// Should probably require the top level index.js ???
var hash = require("../lib/hash")

describe('Hash', function(){
  describe('md5', function(){
    it('should return a known value for a known input', function(){
      assert.equal("5d41402abc4b2a76b9719d911017c592", hash.md5("hello"));
    });
    it('should not return an empty value for a known imput', function(){
      assert.notEqual("", hash.md5("hello"));
    });
    it('should test more things')
  })
});

