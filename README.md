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

Currently using `axios` package to make requests between containers.

Depending on the application given to the software it might be better to have emails as primary key, and newsletters as a relation.

Subscriptions cannot be duplicated when creating them throught the API request. Restriction made up by looking the newsletter and email fields. This requirement is not a Schema validation.

### Development+

Further development folder structure should continue express standards. This has been our goals developing.
Current code needs improvement.

```
src
│   app.js          # App entry point
└───api             # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───jobs            # Jobs definitions for agenda.js
└───loaders         # Split the startup process into modules
└───models          # Database models
└───services        # All the business logic is here
└───subscribers     # Event handlers for async task
└───types           # Type declaration files (d.ts) for Typescript
```

## Suggestions

- Refactor code and make it cleaner. Separate RabbitMQ enqueuer functions from the routes files.
- Make environments variables to define some options. Examples: ports, hostnames...
- Improve security by adding CORS or secret keys in our backend requests.
- Improve error handling and decide what to do in case our messsage broker fails at subscription creation.
