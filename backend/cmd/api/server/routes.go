package server

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/health"
)

func setupRoute(e *echo.Echo) {
	api := e.Group("/api")
	health.Route(e, "/health")
	_ = api
}
