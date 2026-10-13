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
	./vault/vault-init.sh

up: vault-init
	$(COMPOSE) up -d --build db backend game frontend proxy prometheus grafana node-exporter

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
