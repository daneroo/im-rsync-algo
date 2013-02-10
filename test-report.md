# TOC
   - [Hash](#hash)
     - [md5](#hash-md5)
   - [Array](#array)
     - [#indexOf()](#array-indexof)
   - [Async](#async)
     - [setTimeout()](#async-settimeout)
<a name=""></a>
 
<a name="hash"></a>
# Hash
<a name="hash-md5"></a>
## md5
should return a known value for a known input.

```js
assert.equal("5d41402abc4b2a76b9719d911017c592", hash.md5("hello"));
```

should not return an empty value for a known imput.

```js
assert.notEqual("", hash.md5("hello"));
```

<a name="array"></a>
# Array
<a name="array-indexof"></a>
## #indexOf()
<a name="async"></a>
# Async
<a name="async-settimeout"></a>
## setTimeout()
should call it's callback.

```js
setTimeout(function(){
  assert.ok(true);
  done()
},0);
```

