package service

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/pkg/db"
	"github.com/zuni-lab/zuni-sun-id/pkg/db/models"
	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RevokeCredentialRequest struct {
	TxID string `json:"tx_id" validate:"bytes32"`
	Uid  string `json:"uid" validate:"bytes32"`
}

func RevokeCredential(ctx context.Context, input *RevokeCredentialRequest) (bool, error) {

	filters := bson.D{
		{Key: "uid", Value: input.Uid},
	}

	projection := bson.M{
		"uid":        1,
		"is_revoked": 1,
	}

	var cred models.Credential

	err := db.Credential.FindOne(ctx, filters, options.FindOne().SetProjection(projection)).Decode(&cred)

	if err != nil {
		return false, err
	}

	if cred.IsRevoked {
		return true, nil
	}

	event, err := tron.GetRevokedEvent(input.TxID)
	if err != nil {
		return false, err
	}

	if len(event.Data) == 0 {
		return false, echo.NewHTTPError(http.StatusNotFound, "event not found")
	}

	if event.Data[0].ParsedResult.Uid != input.Uid {
		return false, echo.NewHTTPError(http.StatusBadRequest, "uid mismatch")
	}

	_, err = db.Credential.UpdateOne(ctx, filters, bson.D{{Key: "$set", Value: bson.D{{Key: "is_revoked", Value: true}}}})

	return err == nil, err
}
