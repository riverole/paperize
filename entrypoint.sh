#!/bin/sh -l

echo "Hello $1"
echo "You $2"

JSON_STRING='{"google"{"client_id":"$1"","picker":"$2","fonts":"$2"}}'

echo $JSON_STRING > .api_keys.dev.json
