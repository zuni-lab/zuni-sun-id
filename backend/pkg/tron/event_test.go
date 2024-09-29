package tron_test

import (
	"fmt"
	"testing"

	"github.com/zuni-lab/zuni-sun-id/config"
	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
)

func TestMain(m *testing.M) {
	config.LoadEnvWithPath("../../.env")
	tron.Init()
	m.Run()
}

func TestGetEvent(t *testing.T) {
	eventResponse, err := tron.GetRevokedEvent("5646d436751ef4cd64eec33e9ecfa776d7d96d0a8e0572440637f30a1d8ec098")
	if err != nil {
		t.Error(err)
		return
	}

	// Check the response and parsed event
	if len(eventResponse.Data) > 0 {
		fmt.Printf("Parsed Event: %+v\n", eventResponse.Data[0].ParsedResult)
	} else {
		t.Error("No events found")
	}
}
