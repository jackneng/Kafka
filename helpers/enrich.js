/**
 * Helper Enrich functions
 */
const { logger } = require("./logger.js");

/**
 * Gather raw data and data from db to enrich Kafka data
 * @param {Object} raw raw data from ves topics
 * @param {Object} dbdata site data from database
 * @returns Enriched Kafka data
 */
const enrich = async (raw, dbdata) => {
    try {
        let enrichedData = {};
        Object.assign(enrichedData, raw);
        enrichedData.newData = dbdata;
        let res = JSON.stringify(enrichedData);
        logger.debug(res)
        return res;
    } catch (error) {
        logger.error(error);
        return raw;
    }
}

module.exports = {
	enrich,
};
