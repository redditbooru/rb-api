const Singleton = require('molecule-singleton');

module.exports = Singleton('db', {

  /**
   * The Sequalize object
   * @public
   */
  db: null,

  __construct() {
    const Sequelize = require('sequelize');
    const dbConfig = require('../config').db;

    if (!dbConfig) {
      throw new Error('No database configuration preset');
    }

    this.db = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      dialect: 'mysql',
      dialectOptions: {
        socketPath: '/var/run/mysqld/mysqld.sock'
      },
      define: {
        // This is some Ember level bullshit
        timestamps: false
      }
    });
  }
});