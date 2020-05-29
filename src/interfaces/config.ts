import * as mysql from 'mysql';

export interface IHttpConfig {
  port: number;
}

export type ICachePool = Array<string>;

export interface IAppConfig {
  mysql?: mysql.ConnectionConfig;
  http?: IHttpConfig;
  cachePool?: ICachePool;
}
