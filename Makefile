TESTS = test/*.js

# other reporters include dot,spec,list,tap,html-cov
# ./node_modules/.bin/mocha --reporters
REPORTER = list
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 600 \
		$(TESTS)

test-report:
	make test REPORTER=markdown >test-report.md


.PHONY: test
