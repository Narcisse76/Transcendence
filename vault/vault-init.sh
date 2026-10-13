#!/bin/sh

# -e : stop script if command fails
# -u : stop script if it tries to use undefined variable
set -eu

# use COMPOSE env variable otherwise default to "docker compose"
COMPOSE="${COMPOSE:-docker compose}"

# check if .env exists then set -a to export variables +a to stop exporting
if [ -f .env ]; then
    set -a
    . ./.env
    set +a
fi

# verify that all required variables are defined and non empty
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"
: "${OPENAI_API_KEY:?OPENAI_API_KEY is required}"
: "${GRAFANA_ADMIN_USER:?GRAFANA_ADMIN_USER is required}"
: "${GRAFANA_ADMIN_PASSWORD:?GRAFANA_ADMIN_PASSWORD is required}"

# VAULT_CONTAINER is vault if not defined, VAULT_TOKEN root if not defined
VAULT_CONTAINER="${VAULT_CONTAINER:-vault}"
VAULT_TOKEN="${VAULT_TOKEN:-root}"

echo "Starting Vault..."
$COMPOSE up -d vault

# sleep until container is up
echo "Waiting for Vault daemon to be ready..."
until docker exec "$VAULT_CONTAINER" sh -c \
    'vault status >/dev/null 2>&1'
do
    sleep 0.5
done

echo "Seeding secrets into Vault KV engine..."

# built PostgresSQL connextion using values from .env
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@ft_db:5432/${POSTGRES_DB}"

# pass VAULT_TOKEN into container env so vault CLI can authentificate
# vault kv put variables into secrets
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" "$VAULT_CONTAINER" \
    vault kv put secret/transcendence/backend \
    "DATABASE_URL=$DATABASE_URL" \
    "JWT_SECRET=$JWT_SECRET" \
	"OPENAI_API_KEY=$OPENAI_API_KEY" \
    "GRAFANA_ADMIN_USER=$GRAFANA_ADMIN_USER" \
    "GRAFANA_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD"

echo "Vault secrets initialized."
