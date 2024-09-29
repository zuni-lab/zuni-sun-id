package tron

import (
	"net/http"

	"github.com/zuni-lab/zuni-sun-id/config"
)

type TronService struct {
	ApiUrl     string
	ApiKey     string
	httpClient *http.Client
}

var TronClient *TronService

func Init() {
	if config.Env.TRON_GRID_API_URL == "" || config.Env.TRON_GRID_API_KEY == "" {
		panic("TRON_GRID_API_URL and TRON_GRID_API_KEY must be set")
	}

	TronClient = &TronService{
		ApiUrl:     config.Env.TRON_GRID_API_URL,
		ApiKey:     config.Env.TRON_GRID_API_KEY,
		httpClient: &http.Client{},
	}
}
