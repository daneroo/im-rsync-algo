"use strict";

var crypto = require('crypto');

/*
   Calculates a checksum (strong and weak when compared to md5)
   It's main properties is that it is cheaper to calculate, and when performed
   on a sliding window, can be efficiently computed with the previous checksum

   data: Buffer
   prev: optional previously caclulated checksum {a:.., b:.. sum:..}
     which must have been calculated on the same data, and length, starting at the position start-1

  should I use start-end, or start,length, Buffer class uses [start,end)
  should re-implement and use slice semantics from buffer ?

  optimisation:
  doing b+=a, instead of b += (end-i)*data[i]; speeds up from 300MB/s to 430MB/s
  doing the loop on i=[start,end), instead of [0,len) speeds up from 430MB/s -> 500MB/s

*/


module.exports = {
  strong: function (data) {
    return crypto.createHash('md5')
    .update(data)
    .digest('hex');
  },

  weak32: function (data, prev, start, end) {
    var a = 0, b = 0, sum = 0
    var M = 1 << 16;
    var Mflag = (1<<16)-1;

    start = start||0;
    end = end||data.length;

    if (!prev) {

      var i = start;
      for (; i < end; i++) {
        a += data[i];
        b += a;
      }
    } else {
      var k = start
      , l = end - 1;

      a = (prev.a - data[k-1] + data[l]);
      b = (prev.b - ( (l-1) - (k-1) + 1) * data[k-1] + a );
    }

    // modulo expression preserving positive sign replaced by bitMask
    a &= Mflag;
    b &= Mflag;

    return { a: a, b: b, sum: a + b * M };
  },

  weak16: function (data) {
    return 0xffff & (data >> 16 ^ data*1009);
  }
};