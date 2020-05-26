import { IAppConfig } from './src/interfaces/config';

const APP_CONFIG: IAppConfig = {
  mysql: {
    host: 'localhost',
    user: 'rb-server',
    password: 'rb-server-password',
    database: 'redditbooru'
  },
  http: {
    port: 4141
  },
  cachePool: [
    '127.0.0.1:11211',
  ]
};

export default APP_CONFIG;
