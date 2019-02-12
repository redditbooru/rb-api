import * as mysql from 'mysql';

export interface IHttpConfig {
  port: number;
}

export interface IAppConfig {
  mysql?: mysql.ConnectionConfig;
  http?: IHttpConfig;
  aws?: IAWSConfig;
}
