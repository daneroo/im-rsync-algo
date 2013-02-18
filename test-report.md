# TOC
   - [Hash](#hash)
     - [strong](#hash-strong)
     - [weak32](#hash-weak32)
<a name=""></a>
 
<a name="hash"></a>
# Hash
<a name="hash-strong"></a>
## strong
should return a known value for a "hello" string input.

```js
assert.equal(hash.strong("hello"), "5d41402abc4b2a76b9719d911017c592");
```

should return a known value for a "hello" buffer input.

```js
assert.equal(hash.strong(new Buffer("hello")), "5d41402abc4b2a76b9719d911017c592");
```

should not return an empty value for a known imput.

```js
assert.notEqual(hash.strong("hello"), "");
```

<a name="hash-weak32"></a>
## weak32
should return a known value for a "hello" buffer input.

```js
assert.deepEqual(hash.weak32(new Buffer("hello")), {"a":532,"b":1575,"sum":103219732});
```

should return a known value for [0,0,0,..] buffer.

```js
// new Buffer not guaranteed to be zero filled.
var buf=new Buffer(10); buf.fill(0);
assert.deepEqual(hash.weak32(buf), {"a":0,"b":0,"sum":0});
```

should return a known value for [1] buffer.

```js
assert.deepEqual(hash.weak32(new Buffer([1])), {"a":1,"b":1,"sum":65537});
```

should return a known value for [1,1] buffer.

```js
assert.deepEqual(hash.weak32(new Buffer([1,1])), {"a":2,"b":3,"sum":196610});
```

should return a known value for [1,2] buffer.

```js
assert.deepEqual(hash.weak32(new Buffer([1,2])), {"a":3,"b":4,"sum":262147});
```

should return a known value for [2,1] buffer.

```js
assert.deepEqual(hash.weak32(new Buffer([2,1])), {"a":3,"b":5,"sum":327683});
```

should respect its start argument for [8,9] buffer.

```js
assert.deepEqual(hash.weak32(new Buffer([8,9]), null,1), hash.weak32(new Buffer([9])));
```

should respect its start argument.

```js
var buf123=new Buffer([1,2,3,4,5,6]);
var buf234=new Buffer([2,3,4,5,6]);
assert.deepEqual(hash.weak32(buf123, null, 1), hash.weak32(buf234,null, 0));
```

should respect its end argument.

```js
assert.deepEqual(hash.weak32(new Buffer([1,2,3]), null, 0,2), hash.weak32(new Buffer([1,2])));
```

should respect its start and end arguments.

```js
var buf123=new Buffer([1,2,3,4,5,6]);
var buf234=new Buffer([2,3,4,5,6,7]);
assert.deepEqual(hash.weak32(buf123, null, 3,5), hash.weak32(buf234,null, 2,4));
```

should be able to calculate incrementally.

```js
// var buf = new Buffer([1,2,3,4]);
var len=1024;
var buf = randBuffer(len+1);
var prev = hash.weak32(buf,null,1,len-1)
var expected = hash.weak32(buf,null,2,len);
var incremental = hash.weak32(buf,prev,2,len);
// console.log('\n1',prev,'\n',expected,'\n',incremental);
assert.deepEqual(expected, incremental);
```

should be able to calculate incrementally,repeatedly.

```js
var blocksize=1024;
var shifts=10000;
var buf = randBuffer(blocksize+shifts+1);
var prev = null;
for (var i=0;i<shifts;i++){
  var expected = hash.weak32(buf,null,i,i+blocksize);
  var incremental = hash.weak32(buf,prev,i,i+blocksize);
  // console.log('\n'+i,prev,'\n',expected,'\n',incremental);
  assert.deepEqual(expected, incremental);
  prev = incremental;
}
```

should eventually create a 16bit collision.

```js
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
    // console.log('got collision %d: %j : %j',i,hashes[weak16],weak32);
    assert.equal(hashes[weak16].b,weak32.b);
  }
  hashes[weak16]=weak32;
  prev = weak32;
}
```

