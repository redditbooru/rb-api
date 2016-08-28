const expect = require('expect.js');
const mock = require('mock-require');
const sinon = require('sinon');

const config = require('../config');

// A mocked out version of the mc package
const Client = function(pools) {};
Client.prototype = {
  connect() {},
  get() {},
  set() {}
};
const mcMock = { Client };

const CODE_PATH = '../src/cache';

describe('cache tests', function() {
  var sandbox;
  var cache;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    mock('mc', mcMock);
  });

  afterEach(function() {
    sandbox.restore();
    mock.stop('mc');
  });

  it('should instantiate an mc.Client object and connect', function() {
    const clientSpy = sandbox.spy(mcMock, 'Client');
    const connectSpy = sandbox.spy(mcMock.Client.prototype, 'connect');

    // Because the cache module registers as a singleton, this is the one
    // time we'll include this code. It's backwards and raises implementation
    // questions, but I'll allow it.
    cache = require(CODE_PATH);
    sinon.assert.calledWithNew(clientSpy);
    sinon.assert.calledWith(clientSpy, config.cachePool);
    sinon.assert.calledWith(connectSpy, sinon.match.func);
  });

  describe('get', function() {
    it('should retrieve the key and resolve on a successful result', function() {
      const value = 'dude';
      const getStub = sandbox.stub(mcMock.Client.prototype, 'get', function(key, cb) {
        const ret = {};
        ret[key] = value;
        cb(null, ret);
      });
      const key = 'myKey';
      return cache.get(key).then(data => {
        sinon.assert.calledWith(getStub, key);
        expect(data).to.be(value);
      });
    });

    it('should return null when mc returns cache miss', function() {
      sandbox.stub(mcMock.Client.prototype, 'get', function(key, cb) {
        const ret = {};
        cb(null, ret);
      });
      return cache.get('myKey').then(data => {
        expect(data).to.be(null);
      });
    });
  });

  describe('set', function() {
    it('should make set calls to mc with default expiration and resolve successfully', function() {
      const setStub = sandbox.stub(mcMock.Client.prototype, 'set', function(key, value, options, cb) {
        cb(null);
      });
      const key = 'myKey';
      const value = 'value';
      return cache.set(key, value).then(data => {
        sinon.assert.calledWith(setStub, key, value, { exptime: cache.MEDIUM }, sinon.match.func);
      });
    });

    it('should use expiration time when passed', function() {
      const setStub = sandbox.stub(mcMock.Client.prototype, 'set', function(key, value, options, cb) {
        cb(null);
      });
      const key = 'myKey';
      const value = 'value';
      const exptime = 66;
      return cache.set(key, value, exptime).then(data => {
        sinon.assert.calledWith(setStub, key, value, { exptime }, sinon.match.func);
      });
    });

    it('should reject on failure with the error object', function(done) {
      const exc = 'oh no!';
      const setStub = sandbox.stub(mcMock.Client.prototype, 'set', function(key, value, options, cb) {
        cb(exc);
      });
      cache.set('thing', 'stuff').catch((err) => {
        expect(err).to.be(exc);
        done();
      });
    });
  });

});