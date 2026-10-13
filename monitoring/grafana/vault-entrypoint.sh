#!/bin/sh
set -eu

: "${VAULT_ADDR:=http://vault:8200}"
: "${VAULT_TOKEN:=root}"

export VAULT_ADDR VAULT_TOKEN

echo "Waiting for Vault..."

until curl -sf \
    -H "X-Vault-Token: $VAULT_TOKEN" \
    "$VAULT_ADDR/v1/sys/health" >/dev/null
do
    sleep 1
done

echo "Reading Grafana credentials from Vault..."

SECRET_URL="$VAULT_ADDR/v1/secret/data/transcendence/backend"

SECRET=$(curl -sf \
    -H "X-Vault-Token: $VAULT_TOKEN" \
    "$SECRET_URL")

export GF_SECURITY_ADMIN_USER
GF_SECURITY_ADMIN_USER=$(printf '%s' "$SECRET" |
    jq -er '.data.data.GRAFANA_ADMIN_USER')

export GF_SECURITY_ADMIN_PASSWORD
GF_SECURITY_ADMIN_PASSWORD=$(printf '%s' "$SECRET" |
    jq -er '.data.data.GRAFANA_ADMIN_PASSWORD')

echo "Starting Grafana..."
exec "$@"
