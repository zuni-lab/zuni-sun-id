# ZUNI SUN ID

> This the monorepo for SUNID project

# Overview

# Table of contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [UI](#ui)
  - [Project commands](#project-commands)
- [Contract](#contract)
  - [Development](#development)
  - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

# Project Structure

```
zuni-your-app/
├── contracts (Tron)
├── ui (NextJS14)
├── backend (Echo)
├── go-btfs (BTFS deployment)
...

```

# Features

## UI Features
- List schemas and credentials (on Tron) and BTFS
- Create schemas and issue credentials
- Revoke credentials 

## Smart Contract Features
- Register schema
- Issue onchain credential
- Revoke onchain/offchain credential

## APIs:
- Listen onchain events
- Issue offchain credentials
- List offchain credentials

## Deployment
>> This repo includes a basic deployment in the **docker** folder. Please check it!

### Website
- [sunid.xyz](https://sunid.xyz)

### Smart contract addresses

- Network: `TRON Shasta Testnet`

  | Contract        | Address                              |
  | --------------- | ------------------------------------ |
  | Schema Registry | `TKn3gkDn587qQFjh9CrmQYqetctCfniL5f` |
  | SunID           | `TUYwo4WqGLVEpCrtbU7zHnrc7nzdoNNU5c` |


# Getting Started

## Prerequisites

- Node.js v21
- Bun
- Golang
- Docker

## Installation

 ```sh
  git clone git@github.com:zuni-lab/zuni-sun-id.git
 ```

# UI

## Project commands

- Run: `bun install` for install all packages
- Run: `bun dev` for start dev environment
- Run: `bun build` for build your project
- Run: `bun start` for start your built project
- Run: `bun lint` for checking error and fix it

# Contract

# Backend
Please read the `backend/README.md` carefully.

# Go-BTFS
We have pre-built the docker image for the btfs from the offical github repo.
Please check its `README.md`

## Testing

# Contributing

We welcome contributions! Please follow these steps to contribute:

- Fork the repository
- Create a new branch (`git checkout -b feature-branch`)
- Make your changes
- Commit your changes (`git commit -m 'Add some feature'`)
- Push to the branch (git push origin feature-branch)
- Create a new Pull Request

# License
