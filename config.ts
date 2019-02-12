import { IAppConfig } from './src/interfaces/config';

const APP_CONFIG: IAppConfig = {
  mysql: {
    host: 'localhost',
    user: 'root',
    password: 'FARuIq~M',
    database: 'redditbooru2',
    socketPath: '/var/run/mysqld/mysqld.sock'
  },
  http: {
    port: 4141
  }
};

export default APP_CONFIG;
