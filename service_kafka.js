var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
var Kafka = require('no-kafka');
var producer = new Kafka.Producer();


client.on('connect', function () {
    client.subscribe('gps');
    client.on('message', function (topic, message) {
        console.log(topic +": "+message.toString());
        producer.init().then(function(){
            return producer.send({
                connectionString: '127.0.0.1:9092',
                topic: topic,
                partition: 0,
                message: {
                    value: message.toString()
                }
            });
        });
    });
});
