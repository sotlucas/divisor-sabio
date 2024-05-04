SHELL := /bin/bash
PWD := $(shell pwd)

run:
	docker compose -f docker-compose.yml up -d
	npm run dev

down:
	docker compose -f docker-compose.yml stop -t 1
	docker compose -f docker-compose.yml down

migrate:
	npm run db:generate
	npm run db:migrate