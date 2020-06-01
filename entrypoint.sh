#!/bin/sh -l
CLIENT_ID_SECRET=$CLIENT_ID
PICKER_SECRET=$PICKER 
echo "Hello" CLIENT_ID_SECRET
echo "You" PICKER_SECRET

JSON_STRING='{"google": {"client_id":"$CLIENT_ID_SECRET","picker":"$PICKER_SECRET","fonts":"$PICKER_SECRET"}}'

echo $JSON_STRING

echo $JSON_STRING > .api_keys.dev.json
