package handlers

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/credential/service"
	"github.com/zuni-lab/zuni-sun-id/pkg/utils"
)

func SearchCredential(c echo.Context) error {
	var body service.SearchCredentialRequest
	if err := utils.BindAndValidate(c, &body); err != nil {
		return err
	}

	result, err := service.SearchCredential(c.Request().Context(), &body)
	if err != nil {
		return err
	}

	return c.JSON(200, result)
}
