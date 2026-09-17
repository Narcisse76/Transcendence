#!/bin/sh
set -e

VAULT_ADDR="http://127.0.0.1:8200"
KEY_FILE="/vault/file/keys.json"

if [ ! -f "${KEY_FILE}" ]; then
    echo "Error: ${KEY_FILE} not found. Run init-vault.sh first."
    exit 1
fi

ROOT_TOKEN=$(jq -r '.root_token' "${KEY_FILE}")

echo "--- Enter secrets for Transcendence ---"
printf "Postgres User [transcendence]: " && read -r DB_USER
DB_USER=${DB_USER:-transcendence}

printf "Postgres Password: " && stty -echo && read -r DB_PASS && stty echo && echo ""
printf "Postgres Database [transcendencedb]: " && read -r DB_NAME
DB_NAME=${DB_NAME:-transcendencedb}

printf "JWT Secret: " && stty -echo && read -r JWT_SEC && stty echo && echo ""

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@db:5432/${DB_NAME}"

echo "1. Enabling KV-v2 secret engine at secret/..."
curl -s --header "X-Vault-Token: ${ROOT_TOKEN}" \
    --request POST \
    --data '{"type": "kv-v2"}' \
    "${VAULT_ADDR}/v1/sys/mounts/secret" > /dev/null 2>&1 || true

echo "2. Writing credentials directly into Vault's encrypted memory..."
PAYLOAD=$(jq -n \
  --arg user "$DB_USER" \
  --arg pass "$DB_PASS" \
  --arg db "$DB_NAME" \
  --arg db_url "$DATABASE_URL" \
  --arg jwt "$JWT_SEC" \
  '{data: {POSTGRES_USER: $user, POSTGRES_PASSWORD: $pass, POSTGRES_DB: $db, DATABASE_URL: $db_url, JWT_SECRET: $jwt}}')

curl -s --header "X-Vault-Token: ${ROOT_TOKEN}" \
    --request POST \
    --data "${PAYLOAD}" \
    "${VAULT_ADDR}/v1/secret/data/transcendence/backend" > /dev/null

echo "3. Creating access policy for backend container..."
curl -s --header "X-Vault-Token: ${ROOT_TOKEN}" \
    --request PUT \
    --data '{
        "policy": "path \"secret/data/transcendence/backend\" { capabilities = [\"read\"] }"
    }' \
    "${VAULT_ADDR}/v1/sys/policies/acl/backend-policy" > /dev/null

echo "4. Generating scoped token..."
BACKEND_TOKEN=$(curl -s --header "X-Vault-Token: ${ROOT_TOKEN}" \
    --request POST \
    --data '{"policies": ["backend-policy"], "ttl": "720h"}' \
    "${VAULT_ADDR}/v1/auth/token/create" | jq -r '.auth.client_token')

echo "${BACKEND_TOKEN}" > /vault/file/backend_token.txt

echo "========================================================="
echo "Secrets stored securely inside Vault memory!"
echo "Backend Scoped Token: ${BACKEND_TOKEN}"
echo "========================================================="
