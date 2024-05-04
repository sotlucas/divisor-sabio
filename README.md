# Divisor Sabio

![divisor_sabio](https://github.com/sotlucas/tp-gestion/assets/36085103/3feb1447-3d4a-4fae-b8ce-b73d598f1da0)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose
- Node.js
- NPM

### Installation

- **Step 1**: Clone the repo

  ```bash
  git clone git@github.com:sotlucas/tp-gestion.git
  cd tp-gestion
  ```

- **Step 2**: Copy the `.env.example` files

  ```bash
  cp .env.example .env
  ```

- **Step 2**: Run the docker postgres container

  ```bash
  docker compose up -d
  ```

- **Step 3**: Install NPM packages

  ```bash
  npm install
  ```

- **Step 4**: Run migrations

  ```bash
  npm run db:generate
  npm run db:migrate
  ```

- **Step 5**: Launch the project

  ```bash
  npm run dev
  ```
