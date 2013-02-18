function randByte(){ return Math.floor(Math.random()*(256));}
function randBuffer(len){ 
  var buf = new Buffer(len);
  for (var i = buf.length - 1; i >= 0; i--) {
    buf[i] = randByte();
  }
  return buf;  
}

module.exports = {
  randBuffer: randBuffer
};