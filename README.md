# microservice_node_mosquitto_to_broker

This microservice write in javascript works as a bridge for mosquitto to rabbitmq and mosquitto to kafka validating the structure data received with a data structure saved in a redis database.

It uses MQTT.js, ampqlib, node-kafka, redis, all in last version.

##Installation

npm install

node service_rabbit.js
to run rabbit bridge

node service_kafka.js
to run kafka bridge
