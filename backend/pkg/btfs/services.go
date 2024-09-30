package btfs

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
	"github.com/zuni-lab/zuni-sun-id/config"
)

func StoreDataInBTFS(data []byte) (string, error) {
	client := resty.New()

	// Create a temporary file to store the credential JSON
	tmpFile, err := os.CreateTemp("", "credential_*.json")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpFile.Name())

	// Write the credential JSON data to the temp file
	if _, err := tmpFile.Write(data); err != nil {
		return "", fmt.Errorf("failed to write to temp file: %w", err)
	}
	if err := tmpFile.Close(); err != nil {
		return "", fmt.Errorf("failed to close temp file: %w", err)
	}

	// Upload the file to BTFS/IPFS
	resp, err := client.R().
		SetFile("file", tmpFile.Name()).
		Post(config.Env.BTFS_NODE_URL + "/api/v0/add")

	if err != nil {
		return "", fmt.Errorf("failed to add file to BTFS: %w", err)
	}

	// Parse the response to get the CID
	var result map[string]interface{}
	err = json.Unmarshal(resp.Body(), &result)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal BTFS response: %w", err)
	}

	if cid, exists := result["Hash"]; exists {
		return cid.(string), nil
	}

	return "", fmt.Errorf("failed to get CID from BTFS response")
}
