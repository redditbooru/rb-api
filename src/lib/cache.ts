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
  private client: Memcached;

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
      this.client.get(cacheKey, (err: any, data: any) => {
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

   */
  async set(cacheKey: string, value: any, duration: CacheDuration = CacheDuration.MEDIUM): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.set(cacheKey, value, duration, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

// Set up the default export as a singleton
const cacheObj = new Cache();
Object.freeze(cacheObj);
export default cacheObj;

/**
 * Function decorator that checks for a cached value before
 * executing the method. If the method is executed, that output
 * will be cached.
 *
 * @param {string} cacheKey The name of the database table
 * @param {CacheDuration} exp Optional expiration time in seconds
 * @param {Array<string>} dynamicCacheKeys Keys to pull off of the parameters passed to add to the cache key.
 *                                         This requires the first parameter passed to be an object.
 */
export function cache(
  cacheKey: string,
  duration: CacheDuration = CacheDuration.MEDIUM,
  dynamicCacheKeys: Array<string> = []
): Function {
  return function cacheMethodDecorator(target: Object, key: any, descriptor: TypedPropertyDescriptor<any>) {
    const fn = descriptor.value;
    descriptor.value = async function(...args: Array<any>) {
      // If dynamic keys were passed, attempt to pull together the dynamic cache key
      const hasDynamicKeys = dynamicCacheKeys.length;
      const firstArg = args.length > 0 && args[0];
      if (hasDynamicKeys && typeof firstArg === 'object') {
        cacheKey = dynamicCacheKeys.reduce((acc, keyName) => (
          `${cacheKey}_${firstArg.hasOwnProperty(keyName) ? firstArg[keyName].toString() : 'null'}`
        ), cacheKey);
      } else if (hasDynamicKeys) {
        // We won't error out, but throw some debugger info
        console.warn(
          `Dynamic keys array was passed to cache decorator, but first argument wasn't an object`, cacheKey
        );
      }

      let result = await cacheObj.get(cacheKey);
      if (typeof result === 'undefined') {
        result = await fn.apply(this, args);
        await cacheObj.set(cacheKey, result, duration);
      }

      return result;
    }
    return descriptor;
  }
}
