#!/bin/sh -l
echo "Hello" $CLIENT_ID
echo "You" $PICKER

JSON_STRING='{"google": {"client_id":"$CLIENT_ID","picker":"$PICKER","fonts":"$PICKER"}}'

echo $JSON_STRING

echo $JSON_STRING > .api_keys.dev.json
