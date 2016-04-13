var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost');
var Kafka = require('no-kafka');
var producer = new Kafka.Producer();
var redis = require("redis"),
    clientRedis = redis.createClient();

clientRedis.on("error", function (err) {
    console.log("Error " + err);
});

startRedis()

console.log('start service');
client.on('connect', function () {
    client.subscribe('gps');
    console.log('connected to mosquitto');
    startReceiverMosquitto()
});

function startReceiverMosquitto(){
    client.on('message', function (topic, message) {
        console.log(topic +": "+message.toString());
        try {
            var jsonCall = JSON.parse(message.toString());
            validateData(jsonCall);
        }
        catch(err) {
           console.log(err)
           console.log("data doesn't match with json format")
        }
    });
}

function validateData(jsonCall){
    if(!jsonCall.timestamp){
      var d = new Date();
      jsonCall["timestamp"]= d.getTime();
    }
    clientRedis.get(jsonCall.type, function(err, reply) {
        // reply is null when the key is missing
        console.log("topics type "+reply);
        if(reply){
            var topics = reply.split(',');
            for(var topic in topics){
                console.log("topic "+topics[topic]);
                getStructureDataTopic(topics[topic], jsonCall)
            }
        }
    });
}

function getStructureDataTopic(topic, jsonCall){
    clientRedis.get(topic, function(err, reply) {
         console.log("topic structure "+reply+" for "+topic);
         if(reply){
             var structure = reply.split(',');
             var chain = {}
             chain["id"]=jsonCall.id
             for(var item in structure){
                 var key = structure[item]
                 var value = jsonCall[key]
                 if(value){
                    chain[key]=value
                 }else{
                    console.log("no published, "+key+" no present");
                    return;
                 }
             }
             publishKafka(topic,chain)
         }
    });
}

function publishKafka(topic, message){
    producer.init().then(function(){
        var strMessage = JSON.stringify(message)
        console.log('sent message to kafka '+strMessage+' in topic '+topic);
        return producer.send({
            connectionString: '127.0.0.1:9092',
            topic: topic,
            partition: 0,
            message: {
                value: strMessage
            }
        });
    });
}

function startRedis(){
    console.log("save data in redis")
    clientRedis.set("collar", "gps,temperature,batch");
    clientRedis.set("gps", "lat,log,timestamp");
    clientRedis.set("temperature", "grados,timestamp");
    clientRedis.set("batch", "lat,log,grados,timestamp");
}
