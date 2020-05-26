import * as Memcached from 'memcached';

import config from '../../config';

/**
 * Cache expiration times in seconds
 */
export enum CacheDuration {
  // No expiration
  NO_EXPIRE = 0,

  // One minute
  SHORT = 60,

  // Five minutes
  MEDIUM = 300,

  // One hour
  LONG = 3600,

  // One day
  VERY_LONG = 86400,

  // One month (more or less)
  INSANE = 86400 * 30,
}

class Cache {
  private client;

  constructor() {
    this.client = new Memcached(config.cachePool);
  }

  /**
   * Retrieves a piece of data from cache
   * @public
   *
   * @param {string} cacheKey The key to fetch
   * @return {Promise<any>} A promise that resolves with the data
   */
  async get(cacheKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(cacheKey, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  /**
   * Sets a value in cache
   * @public
   *
   * @param {string} cacheKey The key to save to
   * @param {any} value The value to store
   * @param {CacheDuration} exp Optional expiration time in seconds
   */
  async set(
    cacheKey: string,
    value: any,
    duration: CacheDuration = CacheDuration.MEDIUM
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.set(cacheKey, value, duration, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

    /**
   * Returns `key` when it exists, otherwise runs `fn`, caches that result, and returns it
   * @public
   *
   * @param {string} key The cache key
   * @param {Function} fn The function to run on a cache miss
   * @param {CacheDuration} duration The expiration time in seconds
   */
  async fetch(
    cacheKey: string,
    fn: Function,
    duration: CacheDuration = CacheDuration.MEDIUM
  ) {
    let result = await this.get(cacheKey);
    if (typeof result === 'undefined') {
      result = await fn();
      await this.set(cacheKey, result, duration);
    }
    return result;
  }
}
