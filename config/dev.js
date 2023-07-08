module.exports = {
    psql: {
        user: 'pguser',
        password: 'db-password',
        host: '127.0.0.1',
        port: 5432,
    },
    kafka: {
        bootstrapEndpoint: ["localhost:9092"],
        ssl: {
            rejectUnauthorized: false,
        },
        sasl: {
            mechanism: '',
            username: '',
            password: ''
        },
        topics: {
            raw: {
                a: "topic-a",
                b:  "topic-b",
                c:  "topic-c",
                d:  "topic-d",
            },
        }
    },
    debezium: {
        bootstrapEndpoint: ["localhost:9092"],
        ssl: {
            rejectUnauthorized: false,
        },
        sasl: {
            mechanism: '',
            username: '',
            password: ''
        },
        topics: {
            enriched: {
                a: "topic-a.enriched",
                b:  "topic-b.enriched",
                c:  "topic-c.enriched",
                d:  "topic-d.enriched"
            }
        }
    }
}
