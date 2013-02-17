var crypto = require('crypto');

module.exports = {
  md5: function (data) {
    return crypto.createHash('md5')
    .update(data)
    .digest('hex');
  },
  /*
    Calculates a checksum (weak when compared to md5)
    It's main properties is that it is cheaper to calculate, and when performed
    on a sliding window, can be efficiently computed with the previous checksum

    data: Buffer
    prev: optional previously caclulated checksum {a:.., b:.. sum:..}
      which must have been calculated on the same data, and length, starting at the position start-1

   should I use start-end, or start,length, Buffer class uses [start,end)
   should re-implement and use slice semantics from buffer ?
   */
   weak32: function (data, prev, start, end) {
    var a = 0, b = 0, sum = 0
    var M = 1 << 16;

    start = start||0;
    end = end||data.length;

    var len = (start >= 0 && end >= 0) ? end - start : data.length
    , i = 0;

    for (; i < len; i++) {
      a += data[i+start];
      // This is as the paper describes it
      //   b += (len-i)*data[i+start];
      // This is faster 430 MB/s vs 300 MB/s
      b += a;
    }

    a %= M;
    b %= M;
    return { a: a, b: b, sum: a + b * M };
  },

  weak32ttezel: function (data, prev, start, end) {
    var a = 0
    , b = 0
    , sum = 0
    , M = 1 << 16;

    start = start||0;
    end = end||data.length;

    if (!prev) {
      var len = start >= 0 && end >= 0 ? end - start : data.length
      , i = 0;

      for (; i < len; i++) {
        a += data[i+start];
        b += a;
      }

      a %= M;
      b %= M;
    } else {
      var k = start
      , l = end - 1
      , prev_k = k - 1
      , prev_l = l - 1
      , prev_first = data[prev_k]
      , prev_last = data[prev_l]
      , curr_first = data[k]
      , curr_last = data[l];

      a = (prev.a - prev_first + curr_last) % M
      b = (prev.b - (prev_l - prev_k + 1) * prev_first + a) % M
    }
    return { a: a, b: b, sum: a + b * M };
  },
  weak16: function (data) {
    return 0xffff & (data >> 16 ^ data*1009);
  }
};