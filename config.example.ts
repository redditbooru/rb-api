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
  }
};

export default APP_CONFIG;