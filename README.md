
<p align="center">
  <img src="https://github.com/sotlucas/tp-gestion/assets/36085103/3feb1447-3d4a-4fae-b8ce-b73d598f1da0" />
  <h1 align="center"> Divisor Sabio </h1>
</p>

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
