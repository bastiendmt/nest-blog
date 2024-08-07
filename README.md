# NestJS Blog Microservice

This repository is a technical test for a blog microservice.

📔 It's my first time using monorepo, I hope the instructions are clear enough.

## Requirements

- node >= 18
- docker
- MongoDB

## Project Architecture

- **Producer** `/producer`

Producer is the main API which handles the creation of articles and authors.

When an article is created, it is sent to the queue `articles_queue` to be processed by the consumer.

The producer has a Swagger documentation available at `http://localhost:3000/docs` when the server is running.

Unit tests are available.

- **Consumer** `/consumer`

Consumer is the microservice which handles the queue and is supposed to send emails. Mail implementation was not required for this test.

- **RabbitMQ**

Message broker used to send and receive messages between microservices.

## Installation

### Run Producer (main API)

```bash
cd producer
npm i
npm run start
```

### Run Consumer (microservice)

```bash
cd consumer
npm i
npm run start
```

### Run RabbitMQ

Run a RabbitMQ server on local :

```sh
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3.13-management
```

Console will be available at `http://localhost:15672/` with credentials `user/password`.

## How to use the APIs

For calling APIs, you can use the VSCode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). You can then open any `file.http` and click on the `Send Request` button.

📔 to avoid id duplication, use the syntax `@variable = value` to define a variable that can be used in requests.

## My comments about the test

My approach to this test was to :

- connect MongoDB
- create CRUD operations for articles
- create basics operations for authors
- link articles to authors
- implement unit tests
- create a filter method for articles
- create a `/articles/with-authors` endpoint to get articles with their authors
- create the rabbitmq queues
- create a rabbitmq mock consumer

### Articles's Authors

Not sure wether to use the author id or the author name when creating an article. I chose the id because I'm used to this schema.

### RabbitMQ

Never worked with RabbitMQ before but pretty straight forward to implement.

### Types

I mostly used implicit types for this project. As the project gets larger, explicit types might be better.
