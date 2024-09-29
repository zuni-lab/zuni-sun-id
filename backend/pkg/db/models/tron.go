package models

type Tron struct {
	LatestBlock uint64 `json:"latest_block" bson:"latest_block,omitempty"`
	CreatedAt   int64  `json:"created_at" bson:"created_at,omitempty"`
}
