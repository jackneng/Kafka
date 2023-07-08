const KafkaJS = require("kafkajs");
const { Kafka } = KafkaJS;
const config = require("./config/" + (process.env.NODE_ENV || "dev") + ".js");

const kafka = new Kafka({
    clientId: "test-consumer",
    brokers: config.debezium.bootstrapEndpoint,
})

const consumer = kafka.consumer({ groupId: "test-consumer-group" })

const consume = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: config.debezium.topics.enriched.a, fromBeginning: true })
    await consumer.subscribe({ topic: config.debezium.topics.enriched.b, fromBeginning: true })
    await consumer.subscribe({ topic: config.debezium.topics.enriched.c, fromBeginning: true })
    await consumer.subscribe({ topic: config.debezium.topics.enriched.d, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic: topic,
                value: message.value.toString(),
            })
        },
    })
}

// start consuming
consume().catch(console.error)