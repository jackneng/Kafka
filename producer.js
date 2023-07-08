const KafkaJS = require("kafkajs");
const { Kafka, Partitioners } = KafkaJS;
const config = require("./config/" + (process.env.NODE_ENV || "dev") + ".js");
const fs = require('fs');
const data = {
    eventId: "eventId",
    someData: "someData",
};

const kafka = new Kafka({
    clientId: "test-producer",
    brokers: config.kafka.bootstrapEndpoint,
})

const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
})

const produce = async () => {
    await producer.connect()
    let topics = Object.values(config.kafka.topics.raw);
    const topic = topics[Math.floor(Math.random()*topics.length)]
    console.log("topic: " + topic);
    await producer.send({
        topic: topic,
        messages: [
            {
                value: JSON.stringify(data),
            },
        ],
    })
}

// produce after every 3 seconds
setInterval(() => {
    produce()
        .then(() => console.log("Message Produced!"))
        .catch(console.error)
}, 3000)