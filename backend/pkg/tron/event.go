package tron

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"

	"github.com/zuni-lab/zuni-sun-id/config"
)

const (
	RevokedOffchainEvent = "RevokedOffchain"
)

type RevokedEvent struct {
	Revoker   string `json:"revoker"`
	Data      string `json:"data"`
	Timestamp string `json:"timestamp"`
}

type (
	EventData[T any] struct {
		BlockNumber           uint64                 `json:"block_number"`
		BlockTimestamp        uint64                 `json:"block_timestamp"`
		CallerContractAddress string                 `json:"caller_contract_address"`
		ContractAddress       string                 `json:"contract_address"`
		EventIndex            int                    `json:"event_index"`
		EventName             string                 `json:"event_name"`
		Result                map[string]interface{} `json:"result"`
		ResultType            map[string]interface{} `json:"result_type"`
		ParsedResult          *T                     `json:"parsed_result"`
		Event                 string                 `json:"event"`
		TransactionID         string                 `json:"transaction_id"`
	}
	EventMeta struct {
		PageSize    int    `json:"page_size"`
		At          int    `json:"at"`
		Fingerprint string `json:"fingerprint"`
	}

	GetEventResponse[T any] struct {
		Data    []EventData[T] `json:"data"`
		Success bool           `json:"success"`
		Meta    EventMeta      `json:"meta"`
	}
)

func populateStructFromMap(result map[string]interface{}, targetStruct interface{}) error {
	// just get the fields of the struct
	targetType := reflect.TypeOf(targetStruct).Elem()
	targetValue := reflect.ValueOf(targetStruct).Elem()

	for i := 0; i < targetType.NumField(); i++ {
		field := targetType.Field(i)
		fieldValue := targetValue.Field(i)

		// Get the key of the field from the struct tag
		key := field.Tag.Get("json")
		if key == "" {
			var newKey string
			for i, char := range key {
				if i > 0 && 'A' <= char && char <= 'Z' {
					newKey += "_"
				}
				newKey += string(char)
			}
			key = newKey
		}

		// Get the value of the field from the map
		value, ok := result[key]
		if !ok {
			return fmt.Errorf("key %s not found in the map", key)
		}

		// Set the value of the field
		fieldValue.Set(reflect.ValueOf(value))
	}

	return nil
}

type GetEventParams struct {
	ContractAddress string
	EventName       string
	Fingerprint     string
}

func GetEvent[T any](params *GetEventParams) (*GetEventResponse[T], error) {
	url := fmt.Sprintf("%s/v1/contracts/%s/events?event_name=%s&order_by=block_timestamp,desc&limit=200", TronClient.ApiUrl, params.ContractAddress, params.EventName)
	if params.Fingerprint != "" {
		url += fmt.Sprintf("&fingerprint=%s", params.Fingerprint)
	}

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("accept", "application/json")
	req.Header.Add("TRON-PRO-API-KEY", TronClient.ApiKey)
	res, err := TronClient.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var response GetEventResponse[T]
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	// Parse each event's result based on the predefined struct type
	for i, event := range response.Data {
		// Dynamically create a new instance of T
		parsedResult := new(T)

		err := populateStructFromMap(event.Result, parsedResult)
		if err != nil {
			return nil, err
		}

		// Assign the parsed result to the Result field
		response.Data[i].ParsedResult = parsedResult
	}

	return &response, nil
}

func GetRevokedOffchainEvent(fingerprint string) (*GetEventResponse[RevokedEvent], error) {
	result, err := GetEvent[RevokedEvent](&GetEventParams{
		ContractAddress: config.Env.SUN_ID_ADDRESS,
		EventName:       RevokedOffchainEvent,
		Fingerprint:     fingerprint,
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}
