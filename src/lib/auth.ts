import * as express from 'express';

import cache, { CacheDuration } from './cache';
import { ServiceTokenModel } from '../models/service-token';
import { MysqlDb } from './mysql-db';

enum AccessLevel {
  NotVerified = 1,
  ClientIdVerified = 2,
  FullyVerified = 3
}

const CLIENT_ID_LENGTH = 8;
const CLIENT_SECRET_LENGTH = 36;
const DEFAULT_SECRET = 'nullnullnullnullnullnullnullnullnull';

class Auth {
  private db: MysqlDb;
  private initialized: boolean;

  init(db: MysqlDb) {
    if (!this.initialized) {
      this.db = db;
      this.initialized = true;
    }
  }

  /**
   * Given an incoming request, returns what level of verification it's good for
   */
  async getAccessLevelFromRequest(req: express.Request): Promise<AccessLevel> {
    if (!this.initialized) {
      return AccessLevel.NotVerified;
    }

    const clientId = req.headers['client-id'] || req.query.clientId;
    const clientSecret = req.headers['client-secret'] || DEFAULT_SECRET;

    // Few quick safegaurd checks
    if (
      (!clientId || clientId.length !== CLIENT_ID_LENGTH) ||
      (clientSecret && clientSecret.length !== CLIENT_SECRET_LENGTH)
    ) {
      return AccessLevel.NotVerified;
    }

    const cacheKey = `getAccessLevelFromRequest_${clientId}_${clientSecret}`;
    let retVal = null; //await cache.get(cacheKey);
    if (!retVal) {
      const serviceToken = <ServiceTokenModel> await ServiceTokenModel.selectById(this.db, clientId);

      if (!serviceToken) {
        return AccessLevel.NotVerified;
      }

      retVal = serviceToken.secret === clientSecret ? AccessLevel.FullyVerified : AccessLevel.ClientIdVerified;
      await cache.set(cacheKey, retVal, CacheDuration.VERY_LONG);
    }

    return retVal;
  }
}

// Export this class as a singlton so we can inject some dependencies
const auth = new Auth();
export default auth;

/**
 * Method decorator for endpoints that require an authorized client but
 * not client secret. Used for browser accessable API endpoints that
 * provide read-only data.
 */
export function authReadOnly() {
  return function cacheMethodDecorator(target: Object, key: any, descriptor: TypedPropertyDescriptor<any>) {
    const originalFn = descriptor.value;
    descriptor.value = async function(req: express.Request, res: express.Response, ...args: Array<any>) {
      const accessLevel = await auth.getAccessLevelFromRequest(req);

      // Read only requires a minimum of having a valid client I
      // If we couldn't do that much, 403 right here and now.
      if (accessLevel === AccessLevel.NotVerified) {
        res.status(403);
      } else {
        await originalFn.apply(this, [ req, res, ...args ]);
      }
    };
  }
}

/**
 * Method decorator for endpoints that require a fully authorized client
 * that can retrieve sensitive data and make writes. Used for server-side
 * requests that have protected credentials.
 */
export function authFullAccess() {
  return function cacheMethodDecorator(target: Object, key: any, descriptor: TypedPropertyDescriptor<any>) {
    const originalFn = descriptor.value;
    descriptor.value = async function(req: express.Request, res: express.Response, ...args: Array<any>) {
      const accessLevel = await auth.getAccessLevelFromRequest(req);

      // Read only requires a minimum of having a valid client I
      // If we couldn't do that much, 403 right here and now.
      if (accessLevel !== AccessLevel.FullyVerified) {
        res.status(403);
      } else {
        await originalFn.apply(this, [ req, res, ...args ]);
      }
    };
  }
}
