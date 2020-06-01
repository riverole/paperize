#!/bin/sh -l

JSON_FMT='{"google": {client_id: %s, picker: %s, fonts: %s}}\n'
JSON_API_KEYS=printf "$JSON_FMT" "$CLIENT_ID" "$PICKER" "$PICKER"

echo $JSON_API_KEYS

echo $JSON_API_KEYS > .api_keys.dev.json
