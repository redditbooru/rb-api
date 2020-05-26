const cache = require('./cache');
const ServiceToken = require('./models/service-token');

const VERIFIED_FOR_READ  = 1;
const VERIFIED_FOR_WRITE = 2;

/**
 * Verifies a given client ID
 */
function verifyClientId(clientId, clientSecret) {
  const cacheKey = `rb-api:auth:verifyClientId-${clientId}:${clientSecret}`;
  return cache.fetch(cacheKey, () => {
    return new Promise((resolve, reject) => {
      ServiceToken.findOne({
        where: {
          id: clientId
        }
      }).then(result => {
        const secret = result !== null ? result.get('secret') : null;
        if (secret) {
          // If no client secret was passed, allow read only
          if (!clientSecret) {
            resolve(VERIFIED_FOR_READ);
          } else {
            // A secret was provided, so now the two MUST MATCH for ANY access
            if (secret === clientSecret) {
              resolve(VERIFIED_FOR_WRITE);
            } else {
              reject();
            }
          }
        } else {
          // No matching records. DENIED
          reject();
        }
      }).catch(reject);
    });
  }, cache.LONG);
}

/**
 * Verifies an incoming request with an optional check for write privileges
 */
function verify(req, needsWrite) {
  return new Promise((resolve, reject) => {
    const clientId = req.headers['client-id'] || req.query.clientId;
    const clientSecret = req.headers['client-secret'];
    if (!clientId) {
      reject();
    } else {
      verifyClientId(clientId, clientSecret).then(result => {
        if (!needsWrite || (needsWrite && result == VERIFIED_FOR_WRITE)) {
          resolve();
        } else {
          reject();
        }
      }).catch(reject);
    }
  });
}

/**
 * Returns a function to be called on failure
 */
function fail(res) {
  return function(err) {
    res.status(403).send('HTTP 403 Forbidden');
  };
}

module.exports = {
  readOnly: function(req, res, next) {
    verify(req, false).then(next).catch(fail(res));
  },

  full: function(req, res, next) {
    verify(req, true).then(next).catch(fail(res));
  }
};