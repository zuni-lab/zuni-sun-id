package credential

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/credential/handlers"
)

func Route(g *echo.Group, path string) {
	credetialGr := g.Group(path)
	credetialGr.POST("", handlers.IssueCredential)
	credetialGr.POST("/search", handlers.SearchCredential)
	credetialGr.PATCH("/revoke", handlers.RevokeCredential)
}
