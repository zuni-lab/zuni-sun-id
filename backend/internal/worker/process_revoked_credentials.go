package worker

import (
	"context"

	"github.com/rs/zerolog/log"
	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
)

func (s *Scheduler) ProcessRevokedCredentials() {
	ctx := context.Background()

	latestBlock, err := getLatestBlockNumber(ctx)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get latest block number")
		return
	}

	var data []tron.EventData[tron.RevokedEvent]

	var fingerprint string

	for {
		log.Info().Str("fingerprint", fingerprint).Msg("Getting revoked offchain event")

		events, err := tron.GetRevokedOffchainEvent(fingerprint)
		if err != nil {
			log.Error().Err(err).Msg("Failed to get revoked offchain event")
			return
		}

		if len(events.Data) == 0 {
			break
		}

		if events.Data[0].BlockNumber <= latestBlock {
			break
		}

		data = append(data, events.Data...)

		if events.Meta.Fingerprint == "" {
			break
		}

		fingerprint = events.Meta.Fingerprint
	}

	if len(data) == 0 {
		log.Info().Msg("No new revoked credential found")
		return
	}

	var filteredData []tron.RevokedEvent

	for _, event := range data {
		if event.ParsedResult != nil && event.BlockNumber > latestBlock {
			filteredData = append(filteredData, *event.ParsedResult)
		}
	}

	if len(filteredData) == 0 {
		log.Info().Msg("No new filtered revoked credential found")
		return
	}

	newLatestBlock := data[0].BlockNumber

	handleUpdateCredentialStatusTx(filteredData, newLatestBlock)
}
