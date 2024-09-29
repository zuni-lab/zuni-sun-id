package service

import (
	"context"
)

type RevokeCredentialRequest struct {
	TxID string `json:"tx_id" validate:"bytes32"`
	Uid  string `json:"uid" validate:"bytes32"`
}

func RevokeCredential(ctx context.Context, input *RevokeCredentialRequest) (bool, error) {

	// txIdWithoutOx := strings.Replace(input.TxID, "0x", "", 1)
	// inputTxIdWithoutOx := strings.Replace(input.TxID, "0x", "", 1)

	// filters := bson.D{
	// 	{Key: "uid", Value: input.Uid},
	// }

	// projection := bson.M{
	// 	"uid":        1,
	// 	"is_revoked": 1,
	// }

	// var cred models.Credential

	// err := db.Credential.FindOne(ctx, filters, options.FindOne().SetProjection(projection)).Decode(&cred)

	// if err != nil {
	// 	return false, err
	// }

	// if cred.IsRevoked {
	// 	return true, nil
	// }

	// event, err := tron.GetRevokedEvent(txIdWithoutOx)
	// if err != nil {
	// 	return false, err
	// }

	// if len(event.Data) == 0 {
	// 	return false, echo.NewHTTPError(http.StatusNotFound, "event not found")
	// }

	// if event.Data[0].ParsedResult.Uid != inputTxIdWithoutOx {
	// 	return false, echo.NewHTTPError(http.StatusBadRequest, "uid mismatch")
	// }

	// _, err = db.Credential.UpdateOne(ctx, filters, bson.D{{Key: "$set", Value: bson.D{{Key: "is_revoked", Value: true}}}})

	// return err == nil, err
	return false, nil
}
