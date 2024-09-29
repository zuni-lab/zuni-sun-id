package handlers

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/credential/service"
	"github.com/zuni-lab/zuni-sun-id/pkg/utils"
)

func RevokeCredential(c echo.Context) error {
	var body service.RevokeCredentialRequest
	if err := utils.BindAndValidate(c, &body); err != nil {
		return err
	}

	result, err := service.RevokeCredential(c.Request().Context(), &body)
	if err != nil {
		return err
	}

	return c.JSON(200, result)
}
