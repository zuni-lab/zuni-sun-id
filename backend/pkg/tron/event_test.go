package tron_test

// import (
// 	"fmt"
// 	"testing"

// 	"github.com/zuni-lab/zuni-sun-id/config"
// 	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
// )

// func TestMain(m *testing.M) {
// 	config.LoadEnvWithPath("../../.env")
// 	tron.Init()
// 	m.Run()
// }

// func TestGetEvent(t *testing.T) {
// 	eventResponse, err := tron.GetRevokedOffchainEvent()
// 	if err != nil {
// 		t.Error(err)
// 		return
// 	}

// 	// Check the response and parsed event
// 	if len(eventResponse.Data) > 0 {
// 		fmt.Printf("Parsed Event: %+v\n", eventResponse.Data[0].ParsedResult)
// 	} else {
// 		t.Error("No events found")
// 	}
// }
