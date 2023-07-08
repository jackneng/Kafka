/**
 * Helper Kafka Connection functions
 */
const KafkaJS = require("kafkajs");
const { CompressionCodecs, CompressionTypes, Partitioners, Kafka } = KafkaJS;
const fs = require('fs');
const LZ4 = require('lz4');
const config = require("../config/" + (process.env.NODE_ENV || "dev") + ".js");


/**
 * Set up LZ4 encoder/decoder for Kafka events
 */
const LZ4Codec = {
    async compress(encoder) {
        return LZ4.encode(encoder);
    },

    async decompress(buffer) {
        return LZ4.decode(buffer);
    }
}
CompressionCodecs[CompressionTypes.LZ4] = () => LZ4Codec;

/**
 * Acquire Kafka connection to VES topics server
 */
const kafkaConsumer = new Kafka({
    clientId: "enrich-consumer",
    brokers: config.kafka.bootstrapEndpoint,
    authenticationTimeout: 10000,
    reauthenticationThreshold: 10000,
    connectionTimeout: 10000,
})
const consumer = kafkaConsumer.consumer({ groupId: "enrichment-group" })


/**
 * Acquire Kafka connection to Debezium topics server
 */
const kafkaProducer = new Kafka({
    clientId: "enrich-producer",
    brokers: config.debezium.bootstrapEndpoint,
    authenticationTimeout: 10000,
    reauthenticationThreshold: 10000,
    connectionTimeout: 10000,
})
const producer = kafkaProducer.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
})

module.exports = {
    consumer,
    producer,
}