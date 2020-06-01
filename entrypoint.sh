#!/bin/sh -l

JSON_STRING=$( jq -n \
                  --arg client_id "$CLIENT_ID" \
                  --arg picker "$PICKER" \
                  '{"google": {{client_id: $client_id, picker: $picker, fonts: $picker}}' )

echo $JSON_STRING

echo $JSON_STRING > .api_keys.dev.json
