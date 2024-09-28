.PHONY: fe fe-build be be-build

fe:
	@echo "Starting frontend..."
	@docker compose -f docker/ui.compose.yml up -d
	
fe-build:
	@echo "Building frontend..."
	@docker compose -f docker/ui.compose.yml up --build -d