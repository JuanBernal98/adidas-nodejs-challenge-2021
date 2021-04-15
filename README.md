![alt text](https://github.com/juanbernal98/adidas-nodejs-challenge-2021/blob/main/screenshot.png?raw=true)

# Introduction
Newsletter microservice archiqutecture designed to scale horizontally using docker.

## Basic information
There are 4 defined services
- www
- subscriptions
- rabbitmq
- mailing

There are 2 defined networks
- public
- private

| Container | Description |
| --- | --- |
| wwww | Backend that communicates with our subscriptions api. |
| subscriptions | API that communicates with rabbitmq. |
| rabbitmq | Enqueue our messages to send them asynchronously. Wait for this container to fully load when booting. |
| mailing | Process the queue and send the message reading rabbitmq. Won't work till rabbitmq is fully loaded. |

| Container | Private | Public |
| --- | --- | --- 
| wwww | :x: | :heavy_check_mark: | 
| subscriptions | :heavy_check_mark: | :heavy_check_mark: |
| rabbitmq | :heavy_check_mark: | :x: |
| mailing | :heavy_check_mark: | :x: |

## Tutorial
Requirements needed to make it work:
- Docker
- Docker compose

### Clone the repository
`git clone url`

### Bring up the containers
`docker-compose up -d`
This action will generate a new folder `./rabbitmq/db` where container "rabbitmq" will store its database contents.