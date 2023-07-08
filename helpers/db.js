/**
 * Helper DB functions
 */
const pgp = require('pg-promise')();
const config = require("../config/" + (process.env.NODE_ENV || "dev") + ".js");
const { logger } = require("./logger.js");


/**
 * Connects to the PostgreSQL db
 * @returns Database object
 */
async function connectDB() {
	const cn = `postgres://${config.psql.user}:${config.psql.password}@${config.psql.host}:${config.psql.port}/security`;
	const db = pgp(cn)

	return db;
}

/**
 * Retrieves a set of db data
 *
 * @param {Object} args search criteria supplied from the main script
 * @returns Array of objects from, or an empty array if an error occurs
 */
async function getDbData(args) {
  try {
    if (!global.psql) {
      global.psql = await connectDB();
    }
    const db = global.psql;
    let res = [{ enriched: true }];
    logger.debug(res)
    return res;
  } catch (error) {
    // logger.error(error);
    return [];
  }
}


module.exports = {
	connectDB,
	getDbData,
};
