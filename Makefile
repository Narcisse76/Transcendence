COMPOSE = docker compose

ifneq (,$(wildcard .env))
  include .env
  export
endif

all: up

.env:
	cp .env.example .env

build: .env
	$(COMPOSE) build --no-cache

vault-init: .env
	$(COMPOSE) up -d --build vault
	@echo "Waiting for Vault daemon to be ready..."
	@docker exec vault sh -c 'until vault status >/dev/null 2>&1; do sleep 0.5; done'
	@echo "Seeding secrets into Vault KV engine..."
	docker exec -e VAULT_TOKEN=root vault vault kv put secret/transcendence/backend \
		DATABASE_URL="postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@ft_db:5432/$(POSTGRES_DB)" \
		JWT_SECRET="$(JWT_SECRET)"

up: vault-init
	$(COMPOSE) up -d --build db backend frontend proxy

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

clean: down
	$(COMPOSE) down -v

fclean: clean
	docker system prune -af

re: fclean up

.PHONY: all build vault-init up down logs ps clean fclean re
