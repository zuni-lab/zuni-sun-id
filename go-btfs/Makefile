.PHONY: boot down tear-down exec restart log

# read env from env of os
ENV ?= testnet

loadEnv:
	export ARCH=$(ARCH)
	@echo "ENV: $(ENV) | ARCH: $(ARCH)"
log:
	docker compose -f compose/$(ENV).yml logs -f
boot: loadEnv
	docker compose -f compose/$(ENV).yml up -d --remove-orphans --build
down:
	docker compose -f compose/$(ENV).yml down --remove-orphans
tear-down:
	docker compose -f compose/$(ENV).yml down --remove-orphans --volumes
exec:
	docker compose -f compose/$(ENV).yml exec btfs /bin/sh
restart:
	docker compose -f compose/$(ENV).yml restart