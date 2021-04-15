# Introduction
Newsletter microservice archiqutecture designed to scale horizontally using docker.

## Basic info
There are 4 defined services
- www
- subscriptions
- rabbitmq
- mailing

### www
Backend that communicates with our subscriptions api.
### subscriptions
subscriptions: API that communicates with rabbitmq.
### rabbitmq
Enqueue our messages to send them asynchronously. Wait for this container to fully load when booting.
### mailing
Process the queue and send the message reading rabbitmq. Won't work till rabbitmq is fully loaded.

## Tutorial
Requirements needed to make it work:
- Docker
- Docker compose

### Clone the repository
`git clone url`

### Bring up the containers
`docker-compose up -d`