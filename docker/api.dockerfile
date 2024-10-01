ARG GO_VERSION=1.22.2

# Builder stage
FROM golang:${GO_VERSION} as builder
WORKDIR /app

COPY . .
RUN go mod download
RUN go build -o dist/main cmd/api/main.go

# Use the debian image as the base image for a small and secure image
FROM debian:12.5-slim
WORKDIR /app

# Install CA certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy the compiled binary from the builder stage
COPY --from=builder /app/dist/ .

ENV PORT=12345
EXPOSE $PORT
ENV GIN_MODE=release

# Start the application
CMD ["/app/main"]
