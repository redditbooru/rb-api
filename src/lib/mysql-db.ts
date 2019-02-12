import { Dictionary } from '../interfaces/common';
import * as mysql from 'mysql';

export interface IQueryResult {
  rows?: Array<Dictionary<any>>;
  hasContent?: boolean;
  insertId?: number;
  fields?: Array<mysql.FieldInfo>;
}

export class MysqlDb {
  private _conn: mysql.Connection;

  public async connect(options: mysql.ConnectionConfig) {
    this._conn = mysql.createConnection(options);

    return new Promise((resolve, reject) => {
      this._conn.config.queryFormat = this._queryFormat.bind(this);
      this._conn.connect(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  public async query(query: string, params?: Dictionary<any>): Promise<IQueryResult> {
    const action: string = query.split(' ', 1).shift().toLowerCase();

    return new Promise<IQueryResult>((resolve, reject) => {
      this._conn.query(query, params, (err, result: any, fields: Array<mysql.FieldInfo>) => {
        const retVal: IQueryResult = {};

        if (err) {
          reject(err);
          return;
        }

        switch (action) {
          case 'select':
            retVal.rows = result;
            retVal.fields = fields;
            retVal.hasContent = result.length;
            break
          case 'insert':
            retVal.insertId = result.insertId;
            break;
        }

        resolve(retVal);
      });
    });
  }

  private _queryFormat(query: string, params?: Dictionary<any>) {
    if (!params) {
      return query;
    }

    return query.replace(/\:(\w+)/g, (token: string, key: string) => {
      if (params.hasOwnProperty(key)) {
        token = this._conn.escape(params[key]);
      } else {
        token = 'NULL';
      }
      return token;
    });
  }
}