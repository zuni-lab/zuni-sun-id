package service

import (
	"context"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	"github.com/zuni-lab/zuni-sun-id/pkg/db"
	"github.com/zuni-lab/zuni-sun-id/pkg/db/models"
	"golang.org/x/crypto/sha3"
)

type IssueCredentialRequest struct {
	Issuer         string `json:"issuer" validate:"address"`
	Signature      string `json:"signature" validate:"bytes"`
	SchemaUID      string `json:"schema_uid" validate:"bytes32"`
	Recipient      string `json:"recipient" validate:"address"`
	ExpirationTime uint64 `json:"expiration_time" validate:"min=1"`
	Revocable      bool   `json:"revocable"`
	RefUID         string `json:"ref_uid" validate:"bytes32"`
	Data           string `json:"data" validate:"bytes"`
}

func IssueCredential(ctx context.Context, input *IssueCredentialRequest) (string, error) {

	now := time.Now().Unix()
	uid, err := getCredentialUID(input, now)
	if err != nil {
		return "", fmt.Errorf("failed to get credential uid: %w", err)
	}

	credential := models.Credential{
		UID:            uid,
		Issuer:         input.Issuer,
		Signature:      input.Signature,
		SchemaUID:      input.SchemaUID,
		Recipient:      input.Recipient,
		ExpirationTime: input.ExpirationTime,
		Revocable:      input.Revocable,
		RefUID:         input.RefUID,
		Data:           input.Data,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	_, err = db.Credential.InsertOne(ctx, credential)
	if err != nil {
		return "", err
	}

	return uid, nil
}

func getCredentialUID(input *IssueCredentialRequest, now int64) (string, error) {

	schemaUId, err := hex.DecodeString(strings.Replace(input.SchemaUID, "0x", "", 1))
	if err != nil {
		return "", fmt.Errorf("failed to decode schema uid: %w", err)
	}

	recipient, err := hex.DecodeString(strings.Replace(input.Recipient, "0x", "", 1))
	if err != nil {
		return "", fmt.Errorf("failed to decode recipient: %w", err)
	}

	issuer, err := hex.DecodeString(strings.Replace(input.Issuer, "0x", "", 1))
	if err != nil {
		return "", fmt.Errorf("failed to decode issuer: %w", err)
	}

	time := make([]byte, 8)
	binary.LittleEndian.PutUint64(time, uint64(now))

	expiration := make([]byte, 8)
	binary.LittleEndian.PutUint64(expiration, input.ExpirationTime)

	revocalbe := make([]byte, 1)
	if input.Revocable {
		revocalbe[0] = 1
	}

	refUID, err := hex.DecodeString(strings.Replace(input.RefUID, "0x", "", 1))
	if err != nil {
		return "", fmt.Errorf("failed to decode ref uid: %w", err)
	}

	data, err := hex.DecodeString(strings.Replace(input.Data, "0x", "", 1))
	if err != nil {
		return "", fmt.Errorf("failed to decode data: %w", err)
	}

	uid := make([]byte, 0)
	uid = append(uid, schemaUId...)
	uid = append(uid, recipient...)
	uid = append(uid, issuer...)
	uid = append(uid, time...)
	uid = append(uid, expiration...)
	uid = append(uid, revocalbe...)
	uid = append(uid, refUID...)
	uid = append(uid, data...)

	hash := sha3.Sum256(uid)
	return "0x" + hex.EncodeToString(hash[:]), nil
}
