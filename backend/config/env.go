package config

import (
	"log"
	"os"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
)

type ServerEnv struct {
	ENV             string
	CORS_WHITE_LIST []string

	APP_NAME         string `validate:"min=1"`
	MONGODB_URI      string `validate:"uri"`
	MONGODB_DATABASE string `validate:"min=1"`
	JWT_SECRET       string `validate:"min=10"`

	PORT string `validate:"number"`

	IsProd    bool
	IsStaging bool
	IsDev     bool
	IsTest    bool

	OPENOBSERVE_ENDPOINT   string `validate:"url"`
	OPENOBSERVE_CREDENTIAL string `validate:"min=1"`
	SUN_ID_ADDRESS         string `validate:"min=20"`
	TRON_GRID_API_URL      string `validate:"min=1"`
	TRON_GRID_API_KEY      string `validate:"min=1"`
	BTFS_NODE_URL          string `validate:"min=1"`
}

var Env ServerEnv

func LoadEnvWithPath(path string) {
	err := godotenv.Load(os.ExpandEnv(path))
	if err != nil {
		log.Fatalf("Error loading %s file: %s", path, err)
	}

	loadEnv()
}

func LoadEnv() {
	if os.Getenv("ENV") == "" {
		os.Setenv("ENV", "development")
		err := godotenv.Load(os.ExpandEnv(".env"))
		if err != nil {
			log.Fatalln("Error loading .env file: ", err)
		}
	} else if os.Getenv("ENV") == "test" {
		err := godotenv.Load(os.ExpandEnv(".env.test"))
		if err != nil {
			log.Fatalln("Error loading .env.test file: ", err)
		}
	}

	loadEnv()
}

func loadEnv() {
	rawCORSWhiteList := os.Getenv("CORS_WHITE_LIST")
	var corsWhiteList []string
	if rawCORSWhiteList == "" {
		corsWhiteList = []string{
			"http://localhost:3000",
		}
	} else {
		corsWhiteList = strings.Split(rawCORSWhiteList, ",")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "12345"
	}

	Env = ServerEnv{
		ENV:             os.Getenv("ENV"),
		CORS_WHITE_LIST: corsWhiteList,

		APP_NAME:         os.Getenv("APP_NAME"),
		MONGODB_URI:      os.Getenv("MONGODB_URI"),
		MONGODB_DATABASE: os.Getenv("MONGODB_DATABASE"),
		JWT_SECRET:       os.Getenv("JWT_SECRET"),
		PORT:             port,

		OPENOBSERVE_ENDPOINT:   os.Getenv("OPENOBSERVE_ENDPOINT"),
		OPENOBSERVE_CREDENTIAL: os.Getenv("OPENOBSERVE_CREDENTIAL"),
		SUN_ID_ADDRESS:         os.Getenv("SUN_ID_ADDRESS"),
		TRON_GRID_API_URL:      os.Getenv("TRON_GRID_API_URL"),
		TRON_GRID_API_KEY:      os.Getenv("TRON_GRID_API_KEY"),
		BTFS_NODE_URL:          os.Getenv("BTFS_NODE_URL"),
	}

	validate := validator.New()
	err := validate.Struct(Env)

	if err != nil {
		panic(err)
	}

	Env.IsProd = Env.ENV == "production"
	Env.IsStaging = Env.ENV == "staging"
	Env.IsDev = Env.ENV == "development" || len(Env.ENV) == 0
	Env.IsTest = Env.ENV == "test"
}
