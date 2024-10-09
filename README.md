# ZUNI DAPP TEMPLATE

> This repo helps you start the dapp faster.

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
│
├── contracts/
│
├── ui/
│   ├── app/
│   ├── components/
│   │   ├── shadcn
│   │   ├── ...
│   │
│   ├── constants/
│   ├── hooks/
│   ├── public/
│   ├── stats/
│   ├── types
│   ├── utils/
│   ├── package.json
│   ├── tsconfig.json
│   ├── ...
│
├── README.md
└── package.json
```

# Features

## UI Features

## Smart Contract Features

- Register schema
- Issue onchain credential
- Revoke onchain/offchain credential

## Deployment

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

## Installation

1. Clone the repo

   ```sh
    git clone git@github.com:zuni-lab/zuni-sun-id.git
   ```

2. Copy `.env.example` to `.env`:

   ```sh
   cp .env.example .env
   ```

3. Example:

# UI

## Project commands

- Run: `bun install` for install all packages
- Run: `bun dev` for start dev environment
- Run: `bun build` for build your project
- Run: `bun start` for start your built project
- Run: `bun lint` for checking error and fix it

# Contract

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
