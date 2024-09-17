#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a port number"
  exit 1
fi

PID=$(lsof -i :$1 | grep LISTEN | awk '{print $2}')

if [ -z "$PID" ]; then
  echo "No process listening on port $1"
else
  kill -9 $PID
  echo "Killed process $PID listening on port $1"
fi
