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

### www
This container have public access. It communicates with our API via backend so nobody sees the IP of our private system.

### subscriptions
This container have private access. It handles the logic to create, list and delete subscriptions and to store this information in mongodb. It also emmits messages to the rabbitmq broker.

### mongo
This container have private access. It stores data.

### rabbitmq
This container have private access. It handles the logic to enqueue messages and to deliver them.

### mailing
This container have private access. It handles the logic to consume the RabbitMQ queue.


### Folder structure

Further development, structure should continue express community standards. Down below structure has been my goal when developing.
*Current code needs refactoring improvements to achive this structure.*

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

## Sending emails

Although I have not configured any email library related, i do have configured the message broker. Right now the RabbitMQ consummer would need to find the newsletter template and send the email to the `subscription.email`. 

For production environments consider using Apache Kafka.

Use any SMTP Relay to get a fast email deliverability without the need of configuring a server.

## Improvements and suggestions

- Some code refactoring. 
- Separate RabbitMQ enqueuer functions from the routes files.
- Improve docker-compose rabbitmq healthycheck.
- Make environments variables to define app vars. Examples: ports, hostnames...
- Improve security by adding CORS or a secret api check in our public-private backend communication.
- Improve error handling and decide what to do in case our messsage rabbitmq fails at the subscription creation.
- Decide HTTPS/HTTP, speed may be affected.
- Use docker swarm to manage our docker cluster?.
- Set up CI/CD
- Consider the use of Apache Kafka vs RabbitMQ for real development
