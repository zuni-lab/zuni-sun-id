package worker

import (
	"time"

	"github.com/go-co-op/gocron"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/zuni-lab/zuni-sun-id/pkg/utils"
)

type Worker interface {
	Start()
	Shutdown()
	AddJob(func())
}

type Scheduler struct {
	raw      *gocron.Scheduler
	duration time.Duration
	jobs     []func()
	log      *zerolog.Event
}

var _ Worker = &Scheduler{}

func NewScheduler(duration time.Duration, name ...string) *Scheduler {
	nameStr := "Scheduler"
	if len(name) > 0 {
		nameStr = name[0]
	}
	return &Scheduler{
		raw:      gocron.NewScheduler(time.UTC),
		duration: duration,
		log: log.Info().Func(func(e *zerolog.Event) {
			e.Any(utils.YellowMsg("scheduler"), nameStr).Any(utils.BlueMsg("duration"), duration.String())
		}),
	}
}

func (s *Scheduler) Start() {
	for _, job := range s.jobs {
		s.raw.Every(s.duration).Do(job)
	}

	s.log.Msg("Starting scheduler")
	s.raw.StartAsync()
}

func (s *Scheduler) Shutdown() {
	s.raw.Stop()
}

func (s *Scheduler) AddJob(job func()) {
	s.jobs = append(s.jobs, job)
}

func (s *Scheduler) Len() int {
	return len(s.jobs)
}
