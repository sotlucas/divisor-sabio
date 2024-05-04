<!-- PROJECT LOGO -->

# Divisor Sabio

<!-- GETTING STARTED -->

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

- **Step 2**: Run the **install** makefile

  ```bash
  make install
  ```

  Which does the following:

  - Copy the `.env.example` files

    ```bash
    cp .env.example .env
    ```

  - Install NPM packages

    ```bash
    npm install
    ```

  - Run the docker postgres container

    ```bash
    docker compose up -d
    ```

  - Run the migrations

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

### Running

- **Launch the project**:

  ```bash
  make run
  ```

- **Stop the project**:

  ```bash
  make down
  ```

- **Run the migrations**: Run when a database table is changed

  ```bash
  make migrate
  ```
