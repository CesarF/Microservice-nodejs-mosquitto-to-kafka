var amqp = require('amqplib/callback_api');
var mqtt    = require('mqtt');

var client  = mqtt.connect('mqtt://localhost');
var channel = null
console.log(" Connecting to rabbit");
amqp.connect('amqp://'+PASSWD+':'+USER+'@'+IP_RABBIT+':'+RABBIT_PORT, function(err, conn) {
     conn.createChannel(function(err, ch) {
        channel = ch
        console.log(" Connected to rabbit");
     });
});
console.log(" Connecting to mosquitto");
client.subscribe('gps');
client.on('connect', function () {
    client.subscribe('gps');
    console.log(" Connected to mosquitto");
});
client.on('message', function (topic, message) {
    console.log(topic +": "+message.toString());
    var q = 'gps';
    channel.assertQueue(q, {durable: false});
    channel.sendToQueue(q, new Buffer(message.toString()));
    console.log(" [x] Sent message from mosquitto to rabbit");
});
