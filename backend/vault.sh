#!/bin/sh
set -e

VAULT_ADDR="${VAULT_ADDR:-http://vault:8200}"

echo "Fetching credentials from HashiCorp Vault..."

VAULT_RESPONSE=$(curl -s --header "X-Vault-Token: ${VAULT_TOKEN}" \
  "${VAULT_ADDR}/v1/secret/data/transcendence/backend")

export DATABASE_URL=$(echo "$VAULT_RESPONSE" | jq -r '.data.data.DATABASE_URL // empty')
export JWT_SECRET=$(echo "$VAULT_RESPONSE" | jq -r '.data.data.JWT_SECRET // empty')

if [ -z "$DATABASE_URL" ] || [ -z "$JWT_SECRET" ]; then
  echo "CRITICAL ERROR: Failed to load secrets from Vault."
  echo "Vault response: ${VAULT_RESPONSE}"
  exit 1
fi

echo "Secrets loaded into memory successfully. Starting application..."
exec "$@"
