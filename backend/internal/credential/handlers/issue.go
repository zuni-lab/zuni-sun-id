package handlers

import (
	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/internal/credential/service"
	"github.com/zuni-lab/zuni-sun-id/pkg/utils"
)

func IssueCredential(c echo.Context) error {
	var body service.IssueCredentialRequest
	if err := utils.BindAndValidate(c, &body); err != nil {
		return err
	}

	result, err := service.IssueCredential(c.Request().Context(), &body)
	if err != nil {
		return err
	}

	return c.JSON(200, result)
}
