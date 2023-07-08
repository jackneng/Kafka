const { connectDB, getDbData } = require('./helpers/db.js');
const { enrich } = require("./helpers/enrich.js");
const { consumer, producer } = require("./helpers/kafka.js");
const config = require("./config/" + (process.env.NODE_ENV || "dev") + ".js");
const REGEX = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gm;

const produce = async (topic, data) => {
    let ppType = Object.keys(config.kafka.topics.raw).find(key => config.kafka.topics.raw[key] === topic);
    await producer.connect()
    await producer.send({
        topic: config.debezium.topics.enriched[ppType],
        messages: [
            {
                value: data,
            },
        ],
    })
}

const enrichment = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: config.kafka.topics.raw.a, fromBeginning: true })
    await consumer.subscribe({ topic: config.kafka.topics.raw.b, fromBeginning: true })
    await consumer.subscribe({ topic: config.kafka.topics.raw.c, fromBeginning: true })
    await consumer.subscribe({ topic: config.kafka.topics.raw.d, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let value = JSON.parse(message.value);
            let dbData = await getDbData();
            enrichedData = await enrich(value, dbData)
            produce(topic, enrichedData)
                .then(() => console.log("Message Enriched!"))
                .catch(console.error)
        },
    })
}

// start consuming
enrichment().catch(console.error)