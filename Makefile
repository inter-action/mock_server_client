#created by miaojing-243127395@qq.com on 2016-08-09 18:26:10

# see http://www.ruanyifeng.com/blog/2015/03/build-website-with-make.html
# for more info on Makefile
PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: 

clean:
	rm -rf dist

cp-res: clean
	mkdir -p dist

tsc:
	tsc

tscw:
	tsc -w

compile: cp-res tsc

dev: tsc
	webpack-dev-server --config webpack.config.dev.js

dist: compile
	webpack --config webpack.config.prod.js --progress