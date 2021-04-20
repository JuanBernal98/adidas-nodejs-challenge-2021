![alt text](https://github.com/juanbernal98/adidas-nodejs-challenge-2021/blob/main/screenshot.PNG?raw=true)

# Introduction

Newsletter microservices architecture designed to scale horizontally using docker.

## Basic information

We find five defined **services**:

- www
- subscriptions
- mongodb
- rabbitmq
- mailing

There are two defined **networks**:

- public
- private

| Container     | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| www           | Backend that communicates with our subscriptions api.                                                  |
| subscriptions | API that communicates with rabbitmq.                                                                   |
| mongodb       | Database to store subscriptions related content. NoSQL                                                 |
| rabbitmq      | Enqueue messages to send them asynchronously. Wait for this container to fully load when booting.      |
| mailing       | Process the queue and send the message reading rabbitmq. Will not work until rabbitmq is fully loaded. |

| Container     | Private            | Public             |
| ------------- | ------------------ | ------------------ |
| www           | :x:                | :heavy_check_mark: |
| subscriptions | :heavy_check_mark: | :heavy_check_mark: |
| mongodb       | :heavy_check_mark: | :x:                |
| rabbitmq      | :heavy_check_mark: | :x:                |
| mailing       | :heavy_check_mark: | :x:                |

## Setting Up

Two requirements to make it work:

- Docker
- Docker compose

### Get the project files

Use git to download the files by cloning the repository `git clone https://github.com/JuanBernal98/adidas-nodejs-challenge-2021`

### Bring up the containers

Start the containers by running `docker-compose up -d`. It will start the containers and generate new folders like `./rabbitmq/db` where container "rabbitmq" will store its database contents. This happens due to the current docker-compose configuration.

The idea is to only run the images from dockerhub

## Security

When sending any request from the public to the private network we must check the request origin. The simplest way to implement this security layer is by comparing a secret phrase on the backend. CORS its a great alternative.

The mail system should send templates by reading the newsletter id. Mail content cannnot be altered by any user as it is predefined by the attribute. Even if security measures fail and malicious attacks are performed that would not be a problem.

Mongoose is used to to validate our data with models and schemas created.

As private networks should not been compromised, it might not be a problem to use http. Https is safer but can lead to slower requests due to the required initial handshake.

## Additional Info

Images listed down below have `/app` folder as WORKDIR to store its nodejs code.

- www
- subscriptions
- mailing

Currently using **axios** package to make requests and **MongoDB** NoSQL database to store our subscriptions.

Depending on the use given to the API it might be better to have newsletters as a relationship between tables. But considering that need we ought be using a SQL database.

In this coded challenge, **subscriptions cannot be duplicated when created via our `POST /api/subscription` request**. 

**Restriction has been made up by looking the newsletter and email fields**. This restriction is not made by the database structure, has been made at the request.

### Folder structure

Further development folder structure should continue express standards. Down below structure has been our goals when developing.
Current code needs improvement.

```
# File names may vary
src
│   server.js       # App entry point
└───routes          # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───models          # Database models
└───services        # All services logic is here (amqplib connector, etc)
```

## Unit testing

### Susbscriptions

File is located at `/app/src/test/subscriptions.test.js`

Packages used: **mocha**, **chai** and **chai-http**. 

Start all the containers, then run the test files to operate with the database.

- `docker-compose up -d --build`
- `docker-compose run subscriptions npm run test`

## Email sending

I have not configured any email library related. I would use any SMTP Relay to get a fast and guaranteed email deliverability and connect to the service. 

## Improvements and suggestions

- Refactor code and make it cleaner. 
- Separate RabbitMQ enqueuer functions from the routes files.
- Improve docker-compose rabbitmq healthycheck.
- Make environments variables to define app vars. Examples: ports, hostnames...
- Improve security by adding CORS or a secret api check in our public-private backend communication.
- Improve error handling and decide what to do in case our messsage rabbitmq fails at the subscription creation.
- Decide HTTPS/HTTP, speed may be affected.
- Use docker swarm to manage our docker cluster?.
- Set up CI/CD
- Consider the use of Apache Kafka vs RabbitMQ for real development
