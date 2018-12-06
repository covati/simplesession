const redis = require('redis');

/** 
 * Sets a value for the cache
 * @param {redis_client}
 * @param {string} key to set to value
 * @param {string} value to set key to
 */
module.exports.set_value = async function(client, key, value) {
    return new Promise(function (resolve, reject) {
        client.set(key, value, function(err, reply){
            if(err) {
                reject ("Failed to SET value in cache, "+ err)
            } else {
                client.quit();
                resolve(reply)
            }
        });
    });
}

/** 
 * Gets a value from the cache
 * @param {redis_client}
 * @param {string} value to retrieve
 */
module.exports.get_value = async function(client, key) {
    return new Promise(function (resolve, reject) {
        // console.log("in promise")
        client.get(key, function(err, reply){
            if(err) {
                reject ("Failed to GET from cache, "+ err)
            } else {
                client.quit();
                resolve(reply);
            }
        });
    });
}

/**
 * Creates the connection to the data store
 */
module.exports.client_setup = function(config){    // to be set via process.env later
    const redisOptions = {
        host: config.host,
        port: config.port
    }

    return redis.createClient(redisOptions);
}