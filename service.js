var amqp = require('amqplib/callback_api');
var mqtt    = require('mqtt');
//var mqtt = require('mqtt')
//  , host = 'localhost' // or localhost
//  , client = mqtt.connect();

var client  = mqtt.connect('mqtt://localhost');
//var client = mqtt.createClient(1883, 'localhost');
//var client = mqtt.connect(options);
var channel = null
  console.log(" Connecting to rabbit");
  //ec2-52-91-34-111.compute-1.amazonaws.com:5672
amqp.connect('amqp://localhost', function(err, conn) {
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
