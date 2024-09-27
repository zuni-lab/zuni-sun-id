# SunID Backend

## Prerequisites
- Golang
- Air: `go install github.com/air-verse/air@latest`
- Docker
- Docker Compose

## How to start:
- Run `make compose` to start the services: mongo, openobseve
- Navigate to `http://localhost:5080/web/ingestion/recommended/traces?org_identifier=default` and copy the token
- Run `make watch` to start the server, check :12345