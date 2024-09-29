package server

import (
	"context"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
	"github.com/zuni-lab/zuni-sun-id/config"
	"github.com/zuni-lab/zuni-sun-id/internal/worker"
	"github.com/zuni-lab/zuni-sun-id/pkg/db"
	"github.com/zuni-lab/zuni-sun-id/pkg/openobserve"
	"github.com/zuni-lab/zuni-sun-id/pkg/tron"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

type Server struct {
	Raw           *echo.Echo
	traceProvider *sdktrace.TracerProvider
	workers       []worker.Worker
}

func New() *Server {
	config.LoadEnv()

	appName := config.Env.APP_NAME
	if config.Env.IsDev {
		appName = appName + "-dev"
	}
	openobserve.Init(openobserve.OpenObserveConfig{
		Endpoint:    config.Env.OPENOBSERVE_ENDPOINT,
		Credential:  config.Env.OPENOBSERVE_CREDENTIAL,
		ServiceName: appName,
		Env:         config.Env.ENV,
	})

	config.InitLogger()

	e := echo.New()
	e.HideBanner = true
	tp := openobserve.SetupTraceHTTP()

	w := worker.NewScheduler(time.Second*30, tron.RevokedOffchainEvent)
	w.AddJob(w.ProcessRevokedCredentials)

	setupAddHandlerEvent(e)
	setupMiddleware(e)
	setupErrorHandler(e)
	setupRoute(e)
	setupValidator(e)

	return &Server{e, tp, []worker.Worker{w}}
}

func (s *Server) Start(addr string) error {
	loadSvcs()

	for _, w := range s.workers {
		w.Start()
	}

	s.printRoutes()

	return s.Raw.Start(addr)
}

func (s *Server) Close() {
	closeSvcs()
	s.Raw.Close()
	err := s.traceProvider.Shutdown(context.Background())
	if err != nil {
		log.Err(err).Msg("Error shutting down trace provider")
	}
}

func loadSvcs() {
	db.Init()
	tron.Init()
}

func closeSvcs() {
	db.Close()
}
