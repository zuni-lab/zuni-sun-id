package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Credential struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UID            string             `json:"uid" bson:"uid,omitempty"`
	Issuer         string             `json:"issuer" bson:"issuer,omitempty"`
	Signature      string             `json:"signature" bson:"signature,omitempty"`
	SchemaUID      string             `json:"schema_uid" bson:"schema_uid,omitempty"`
	Recipient      string             `json:"recipient" bson:"recipient,omitempty"`
	ExpirationTime uint64             `json:"expiration_time" bson:"expiration_time,omitempty"`
	Revocable      bool               `json:"revocable" bson:"revocable,omitempty"`
	RefUID         string             `json:"ref_uid" bson:"ref_uid,omitempty"`
	Data           string             `json:"data" bson:"data,omitempty"`
	CreatedAt      int64              `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt      int64              `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}
