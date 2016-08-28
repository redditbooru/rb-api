const Client = require('mc').Client;
const Singleton = require('molecule-singleton');

const config = require('../config');

function handleConnect(err) {
  if (!err) {
    console.log('Memcache connection established');
  }
}

module.exports = Singleton('cache', {
  client: null,

  // Expriation constants
  NO_EXPIRE: 0,
  SHORT: 60,          // One minute
  MEDIUM: 300,        // Five minutes (default)
  LONG: 3600,         // One hour
  VERY_LONG: 86400,   // One day
  INSANE: 86400 * 30, // One month

  __construct() {
    const client = new Client(config.cachePool);
    client.connect(handleConnect);
    this.client = client;
  },

  /**
   * Retrieves a piece of data from cache
   * @public
   *
   * @param {String} key The key to fetch
   * @return {Promise} A promise that resolves with the data or null on miss
   */
  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (data && data[key]) {
          resolve(data[key]);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Sets a value in cache
   * @public
   *
   * @param {String} key The key to save to
   * @param {Object} value The value to store
   * @param {Number} exp The expiration time in seconds
   */
  set(key, value, exp = this.MEDIUM) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, { exptime: exp }, (err, status) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  },

  /**
   * Returns `key` when it exists, otherwise runs `fn`, caches that result, and returns it
   * @public
   *
   * @param {String} key The cache key
   * @param {Function} fn The function to run on a cache miss
   * @param {Number} exp The expiration time in seconds
   */
  fetch(key, fn, exp = this.MEDIUM) {
    return new Promise((resolve, reject) => {
      this.get(key).then(result => {
        if (null !== result) {
          resolve(result);
        } else {
          // Get the value from the method passed
          const value = fn();

          // If it's a promise, wait for resolution
          if (value instanceof Promise) {
            value.then(result => {
              this.set(key, result, exp).then(resolve).catch(reject);
            }).catch(reject);
          } else {
            this.set(key, value, exp).then(resolve).catch(reject);
          }
        }
      });
    });
  }
});