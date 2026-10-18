COMPOSE = docker compose
GAME_CONTAINER ?= ft_game

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

users:
	docker exec -i $(GAME_CONTAINER) node --input-type=module < server-test/show-users.js

clean: down
	$(COMPOSE) down -v

fclean: clean
	docker system prune -af

re: fclean up

.PHONY: all build vault-init up down logs ps users clean fclean re
