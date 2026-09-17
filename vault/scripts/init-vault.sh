#!/bin/sh
set -e

VAULT_ADDR="http://127.0.0.1:8200"
KEY_FILE="/vault/file/keys.json"

echo "Waiting for Vault service at ${VAULT_ADDR} to be reachable..."
until curl -s "${VAULT_ADDR}/v1/sys/health" > /dev/null 2>&1; do
    sleep 1
done

INIT_STATUS=$(curl -s "${VAULT_ADDR}/v1/sys/init" | jq -r '.initialized')

if [ "$INIT_STATUS" = "false" ]; then
    echo "Initializing Vault with 3 key shares and a threshold of 2..."
    curl -s --request POST \
        --data '{"secret_shares": 3, "secret_threshold": 2}' \
        "${VAULT_ADDR}/v1/sys/init" > "${KEY_FILE}"
    echo "Vault initialized. Keys stored in ${KEY_FILE}."
else
    echo "Vault is already initialized."
fi

SEAL_STATUS=$(curl -s "${VAULT_ADDR}/v1/sys/seal-status" | jq -r '.sealed')

if [ "$SEAL_STATUS" = "true" ]; then
    echo "Vault is sealed. Unsealing..."
    KEY1=$(jq -r '.keys[0]' "${KEY_FILE}")
    KEY2=$(jq -r '.keys[1]' "${KEY_FILE}")

    curl -s --request POST --data "{\"key\": \"${KEY1}\"}" "${VAULT_ADDR}/v1/sys/unseal" > /dev/null
    curl -s --request POST --data "{\"key\": \"${KEY2}\"}" "${VAULT_ADDR}/v1/sys/unseal" > /dev/null
    echo "Vault unsealed successfully."
else
    echo "Vault is already unsealed."
fi
