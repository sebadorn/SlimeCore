#!/usr/bin/env bash

cd $(dirname "$0")

if [ -d 'build/' ]; then
	rm -r 'build/'
fi

jsdoc ../README.md -c jsdoc.json
