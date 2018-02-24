# Microservice: nodejs mosquitto to kafka

This microservice write in javascript works as a bridge for mosquitto to rabbitmq or mosquitto to kafka, comparing the message structure against a structure saved in a redis database.

It uses last version of MQTT.js, ampqlib, node-kafka and redis.

## Installation
```
npm install

#to run rabbit bridge
node service_rabbit.js

#to run kafka bridge
node service_kafka.js
```
