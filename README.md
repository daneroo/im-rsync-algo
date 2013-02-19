# Rsync Algorithm Components

[![Build Status](https://travis-ci.org/daneroo/im-rsync-algo.png?branch=master)](https://travis-ci.org/daneroo/im-rsync-algo)


This project aims to implement the parts of the rsync algorithm.

First iteration, will work on buffers, then we will look at node 0.10 streams.

Also, I am trying to get TDD style right, so testing is important.

Some parts have been adapted from [the work of Mihai Tomescu &lt;matomesc@gmail.com&gt; & Tolga Tezel &lt;tolgatezel11@gmail.com&gt; in their github repo: ttezel/achor](https://github.com/ttezel/anchor.git).

## Tests
We have chosen [mocha](http://visionmedia.github.com/mocha/) for out test runner, and the **BDD** style  *describe/it* (although this can be mixed with **TDD**'s *suite/test*). 

For assertions, we are start with baseline `assert` but [chai.js](http://chaijs.com/) is on the docket

To run the tests, alternatively: 

	npm test      # invoves the npm `script.test` attribute
	make          # invokes the default target which is make test, with default spec reporter
	make test REPORTER=dot  # which selects the reporter.

To see a list of reporters:

	./node_modules/.bin/mocha --reporters

And to update the markdown flavored test result, in `./test-report.md`:

	make test-report

The project has been integrated with [travis](travis-ci.org) for continuous integration, (which gives us a pretty badge:), as [documented here](http://about.travis-ci.org/docs/user/languages/javascript-with-nodejs/)

[![Build Status](https://travis-ci.org/daneroo/im-rsync-algo.png?branch=master)](https://travis-ci.org/daneroo/im-rsync-algo)

## TODO

Algorithm/Domain

* Refactor bench with timeit -> MS/s
* Generator into helper
	* test (even if in test)
	* use in test
	* use in bench
* seedable random: too slow didn't workout: 
	* [node-mersenne](https://github.com/jwatte/node-mersenne) (slow)
	* [chancejs](https://github.com/abe33/chancejs) (slow+coffee)
	* [alea](https://github.com/coverslide/node-alea) slow:30MB/s
* read through rsync source
	* `generator.c:681 static int generate_and_send_sums`
	* `sender.c`
	* `match.c:353 void match_sums`
	* `receiver.c:227 static int receive_data`
* Signature of hash: string vs uintXX vs buffer

Project/Setup

* integrate into jenkins@solo
* npm module registration
* Experiment TDD/BDD, and assertion style (chai.js)
* travis-ci integration
* Figure out jscoverage, [help?](https://npmjs.org/package/mochawrapper)
* browser usage, of module itself and test (`mocha init`, see chai.js site: API/test).

## References

* [Rsync Docs](http://rsync.samba.org/documentation.html)
* [ttezel's anchor repo](https://github.com/ttezel/anchor.git)

## License 

(The MIT License)

Copyright (c) 2013 Daniel Lauzon &lt;daniel.lauzon@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.