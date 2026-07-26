COMPOSE = docker compose

all: up

.env:
	cp .env.example .env

build: .env
	$(COMPOSE) build

up: .env
	$(COMPOSE) up -d --build

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

.PHONY: all build up down logs ps clean fclean re
