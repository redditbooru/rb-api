import { Dictionary } from '../interfaces/common';
import * as mysql from 'mysql';

export interface IQueryResult {
  rows?: Array<Dictionary<any>>;
  hasContent?: boolean;
  insertId?: number;
  fields?: Array<mysql.FieldInfo>;
}

export type TransactionMethod = () => Promise<boolean>;

export class MysqlDb {
  private _conn: mysql.Pool;

  public async connect(options: mysql.ConnectionConfig) {
    this._conn = mysql.createPool({
      ...options,
      typeCast: this._typeCast,
      queryFormat: this._queryFormat.bind(this)
    });

    return new Promise((resolve, reject) => {
      this._conn.getConnection(err => {
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

  /**
   * Wraps a callback of transactions in a MySQL transaction with automatic COMMIT/ROLLBACK
   *
   * @param transactionMethod The method that will be executed between the beginning of the transaction
   *                          and committing the results. Do INSERTs/UPDATEs here.
   */
  public async transaction(transactionMethod: TransactionMethod): Promise<boolean> {
    let retVal = false;

    await this.query('BEGIN TRANSACTION');
    try {
      const result = await transactionMethod();
      if (result) {
        await this.query('COMMIT');
        retVal = true;
      } else {
        console.error('mysql-db error: transaction callback failed');
        await this.query('ROLLBACK');
      }
    } catch (err) {
      console.error('mysql-db error: ', err);
      await this.query('ROLLBACK');
    }

    return retVal;
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

  /**
   * Performs special type casting for single bit fields
   *
   * @param field The field info
   * @param defaultTypeCasting The default type casting method
   */
  private _typeCast(field: any, defaultTypeCasting: Function) {
    let retVal;
    if (field.type === 'BIT' && field.length === 1) {
      retVal = field.buffer()[0] === 1;
    }
    return retVal || defaultTypeCasting();
  }
}
