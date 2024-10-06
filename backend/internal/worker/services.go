package worker

import (
	"context"
	"time"

	"github.com/rs/zerolog/log"
	"github.com/zuni-lab/zuni-sun-id/pkg/db"
	"github.com/zuni-lab/zuni-sun-id/pkg/db/models"
	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// TODO: put all operations in a single transaction
func handleUpdateCredentialStatusTx(data []tron.RevokedEvent, blockNumber uint64) {

	for _, event := range data {
		// Update the credential status to revoked
		filter := models.Credential{
			UID:    "0x" + event.UID,
			Issuer: event.Revoker,
		}

		_, err := db.Credential.UpdateOne(context.Background(), filter, map[string]interface{}{"$set": map[string]interface{}{"is_revoked": true}})
		if err != nil {
			log.Error().Err(err).Msg("Failed to update credential status")
		}
	}

	log.Info().Uint64("block_number", blockNumber).Msg("Updated credential status")

	db.Tron.InsertOne(context.Background(), models.Tron{
		LatestBlock: blockNumber,
		CreatedAt:   time.Now().Unix(),
	})

}

func getLatestBlockNumber(ctx context.Context) (uint64, error) {
	var result uint64

	opts := options.FindOne().SetProjection(map[string]interface{}{"latest_block": 1}).SetSort(map[string]interface{}{"created_at": -1})

	var record models.Tron

	err := db.Tron.FindOne(ctx, bson.D{}, opts).Decode(&record)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Debug().Msg("No record found")
			return 0, nil
		}
		return result, err
	}

	return record.LatestBlock, nil
}
