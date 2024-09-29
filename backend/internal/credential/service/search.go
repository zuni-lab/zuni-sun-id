package service

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/zuni-lab/zuni-sun-id/pkg/db"
	"github.com/zuni-lab/zuni-sun-id/pkg/db/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type searchOneCredentialRequest struct {
	UID string `json:"uid"`
}

type searchManyCredentialRequest struct {
	SchemaUID string `json:"schema_uid"`
	Address   string `json:"address"`
	Page      int64  `json:"page"`
	Limit     int64  `json:"limit"`
}

type SearchCredentialRequest struct {
	searchOneCredentialRequest
	searchManyCredentialRequest
}

func SearchCredential(ctx context.Context, input *SearchCredentialRequest) (interface{}, error) {
	if input.UID != "" {
		var cred models.Credential
		filter := map[string]interface{}{
			"uid": input.UID,
		}
		err := db.Credential.FindOne(ctx, filter).Decode(&cred)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return nil, echo.NewHTTPError(http.StatusNotFound, "credential not found")
			}
			return nil, err
		}
		return &cred, nil
	}

	if input.Page <= 0 || input.Limit <= 0 {
		return nil, echo.NewHTTPError(http.StatusBadRequest, "page and limit must be greater than 0")
	}

	filters := bson.D{}

	if input.SchemaUID != "" {
		filters = append(filters, bson.E{Key: "schema_uid", Value: input.SchemaUID})
	} 
	
	if input.Address != "" {
		filters = append(filters, bson.E{Key: "$or", Value: bson.A{
			bson.D{{Key: "recipient", Value: input.Address}},
			bson.D{{Key: "issuer", Value: input.Address}},
		}})
	}

	skip := int64((input.Page - 1) * input.Limit)
	limit := int64(input.Limit)

	options := options.FindOptions{
		Skip:  &skip,
		Limit: &limit,
		Sort:  bson.D{{Key: "created_at", Value: -1}},
	}

	var creds []models.Credential
	cursor, err := db.Credential.Find(ctx, filters, &options)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &creds); err != nil {
		return nil, err
	}

	count, err := db.Credential.CountDocuments(ctx, filters)
	if err != nil {
		return nil, fmt.Errorf("failed to count documents: %w", err)
	}

	issuedCount, received := 0, 0

	if input.Address != "" {
		for _, cred := range creds {
			if cred.Recipient == input.Address {
				received += 1
			} else if cred.Issuer == input.Address {
				issuedCount += 1
			}
		}
		return map[string]interface{}{
			"total": count,
			"items": creds,
			"address_counts": map[string]interface{}{
				"issued":   issuedCount,
				"received": received,
			},
		}, nil
	}

	return map[string]interface{}{
		"total": count,
		"items": creds,
	}, nil
}
