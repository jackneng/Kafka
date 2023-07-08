/**
 * Helper Enrich functions
 */

/**
 * Gather raw data and data from db to enrich Kafka data
 * @param {Object} raw raw data from ves topics
 * @param {Object} dbdata site data from database
 * @returns Enriched Kafka data
 */
const enrich = async (raw, dbdata) => {
    let enrichedData = {};
    Object.assign(enrichedData, raw);
    enrichedData.newData = dbdata;
    return JSON.stringify(enrichedData);
}

module.exports = {
	enrich,
};
