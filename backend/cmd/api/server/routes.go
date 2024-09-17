package server

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/credential"
	"github.com/zuni-lab/zuni-sun-id/internal/health"
)

func setupRoute(e *echo.Echo) {
	api := e.Group("/api")
	health.Route(e, "/health")
	credential.Route(api, "/credential")
}
