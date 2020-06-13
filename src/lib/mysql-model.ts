import { Dictionary, GenericObject } from '../interfaces/common';
import { MysqlDb } from './mysql-db';

export enum ColumnTypes {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean'
}

export interface ColumnDescriptor {
  /**
   * The name of the column in the database
   */
  name: string;

  /**
   * The column's data type
   */
  type: ColumnTypes;

  /**
   * If this column can have a null value
   */
  nullable?: Boolean;

  /**
   * If this column is a primary key
   */
  primaryKey?: boolean;
}

export abstract class MysqlModel {
  // Makes TS happy with the freeform keys in `mysqlCopyFromRow`
  [key:string]: any;

  /**
   * The name of the database table
   */
  private static _mysqlTable: string;

  /**
   * A mapping of object properties to their respective database fields
   */
  private static _mysqlFields: Dictionary<ColumnDescriptor>;

  /**
   * The name of the object property that is the primary key in the database
   */
  private static _mysqlPrimaryKey?: string;

  /**
   * To be implemented by the extended class so that instances of
   * that can be instantiated from within this abstract class.
   */
  public static create(): MysqlModel {
    throw new Error('[MysqlModel] "create" method must be overridden by the extending class');
  }

  /**
   * Copies database information into the instantiated object
   *
   * @param row The row object returned from a database query
   * @param fieldMap The object -> database field map
   */
  public mysqlCopyFromRow(row: Dictionary<any>) {
    const constructor = <typeof MysqlModel>this.constructor;
    const { _mysqlFields } = constructor;
    Object.keys(_mysqlFields).forEach((key: string) => {
      const mysqlField = _mysqlFields[key].name;
      this[key] = row[mysqlField];
    });
  }

  /**
   * Creates an instance of this model from a plain object with
   * property and type validation
   *
   * @param {GenericObject} obj The object to create the instance from
   * @return {MysqlModel} The model instance
   */
  public static createFromObject(obj: GenericObject): MysqlModel {
    const retObj = <MysqlModel>this.create();
    const { _mysqlFields } = <typeof MysqlModel>retObj.constructor;
    const errors = Object.keys(_mysqlFields).reduce((errs: Array<string>, key: string) => {
      const schema = _mysqlFields[key];
      let valid = true;
      if (obj.hasOwnProperty(key) && !schema.nullable) {
        switch (schema.type) {
          case ColumnTypes.Number:
            valid = !Number.isNaN(obj[key] - 0);
            break;
          case ColumnTypes.Boolean:
            valid = obj[key] === true || obj[key] === false;
            break;
        }

        if (!valid) {
          errs.push(`Expected type ${schema.type} for column "${key}". Got: ${obj[key]}`);
        }
      } else if (!obj.hasOwnProperty(key) && !schema.nullable && key !== this._mysqlPrimaryKey) {
        errs.push(`Expected value for column "${key}"`);
      }

      return errs;
    }, []);

    if (errors.length) {
      console.error(errors);
      return null;
    }

    // Copy all the properties over to the new instance
    Object.keys(_mysqlFields).forEach(key => retObj[key] = obj[key]);
    return retObj;
  }

  /**
   * Saves the current model to database. Will INSERT if no ID is present (as defined
   * by the `primaryKey` and UPDATE if it is. On INSERT, will update the object's ID
   * as defined by `primaryKey`.
   *
   * @param db The database connection
   * @return {boolean} If the operation was successful
   */
  public async sync(db: MysqlDb): Promise<void> {
    const constructor = <typeof MysqlModel>this.constructor;

    if (!this[constructor._mysqlPrimaryKey]) {
      return this._insert(db);
    }

    return this._update(db);
  }

  /**
   * INSERTs the object into the database
   *
   * @param db
   */
  private async _insert(db: MysqlDb): Promise<void> {
    const constructor = <typeof MysqlModel>this.constructor;

    constructor._verifyFields();

    const { _mysqlFields, _mysqlPrimaryKey } = constructor;
    const insertableFields: Array<string> = Object.keys(_mysqlFields)
      .filter(field => field !== _mysqlPrimaryKey);

    let query = `INSERT INTO \`${constructor._mysqlTable}\` `;
    query += `(\`${insertableFields.map(field => _mysqlFields[field].name).join('`, `')}\`) VALUES `;
    query += `(${insertableFields.map(field => `:${field}`).join(', ')})`;

    const result = await db.query(query, this);

    if (_mysqlPrimaryKey) {
      this[_mysqlPrimaryKey] = result.insertId;
    }
  }

  /**
   * UPDATEs the database row to reflect the object model
   *
   * @param db The database object
   */
  private async _update(db: MysqlDb): Promise<void> {
    const constructor = <typeof MysqlModel>this.constructor;

    constructor._verifyFields(true);

    const { _mysqlFields, _mysqlPrimaryKey } = constructor;
    const fields = Object.keys(_mysqlFields);
    const updateableFields: Array<string> = fields.filter(field => field !== _mysqlPrimaryKey);

    let query = `UPDATE \`${constructor._mysqlTable}\` SET `;
    query += updateableFields.map(field => {
      return `\`${_mysqlFields[field]}\` = :${field}`;
    }).join(', ');
    query += ` WHERE \`${_mysqlFields[_mysqlPrimaryKey]}\` = :${_mysqlPrimaryKey}`;

    await db.query(query, this);
  }

  /**
   * Returns all rows in the table
   *
   * @param db The database object
   */
  public static async selectAll(db: MysqlDb) {
    this._verifyFields();
    const result = await db.query(`SELECT * FROM \`${this._mysqlTable}\``);

    let retVal = null;
    if (result && result.rows && result.rows.length) {
      retVal = result.rows.map((row: Dictionary<any>) => this._createThisFromRow(row));
    }

    return retVal;
  }

  /**
   * Returns single row search by ID
   *
   * @param db The database object
   * @param id ID of the row to find
   */
  public static selectById(db: MysqlDb, id: (number | string)) {
    this._verifyFields();
    const primaryKeyField = this._mysqlFields[this._mysqlPrimaryKey].name;
    return db.query(
      `SELECT * FROM \`${this._mysqlTable}\` WHERE \`${primaryKeyField}\`=:primaryKey LIMIT 1`,
      { primaryKey: id }
    ).then(result => {
      let retVal = null;
      if (result && result.rows && result.rows.length) {
        retVal = this._createThisFromRow(result.rows[0]);
      }
      return retVal;
    });
  }

  /**
   * Instantiates the extended object and populates it with row
   * information returned from a query.
   *
   * @param row The database row information
   */
  private static _createThisFromRow(row: any) {
    const retVal = this.create();
    retVal.mysqlCopyFromRow(row);
    return retVal;
  }

  /**
   * Verifies that all fields on the extended object have been set correctly
   *
   * @param primaryKeyRequired Check that the primary key field has been set
   */
  private static _verifyFields(primaryKeyRequired = false) {
    if (!this._mysqlTable) {
      throw new Error('[MysqlModel] Table name is not set');
    }

    if (!this._mysqlFields) {
      throw new Error('[MysqlModel] Field map is not set');
    }

    if (primaryKeyRequired && !this._mysqlPrimaryKey) {
      throw new Error('[MysqlModel] Primary key is not set and required for that operation');
    }

    if (this._mysqlPrimaryKey && !this._mysqlFields[this._mysqlPrimaryKey]) {
      throw new Error(`[MysqlModel] Primary key "${this._mysqlPrimaryKey}" not found in ${this._mysqlTable}`);
    }
  }
}

interface MysqlModelPrototype {
  new(...args:Array<any>): MysqlModel;
}

/**
 * Class decorator to set the table name of an extended MysqlModel
 *
 * @param tableName The name of the database table
 */
export function tableName(tableName: string): Function {
  return function tableNameDecorator<T extends MysqlModelPrototype>(MysqlModelClass: T) {
    return class extends MysqlModelClass {
      private static _mysqlTable: string = tableName;
    }
  }
}

/**
 * Class decorator to set the table schema and mapping of columns to properties of
 * and extended MysqlModel
 *
 * @param tableSchemaObj A dictionary of class properties to column schema
 */
export function tableSchema(tableSchemaObj: Dictionary<ColumnDescriptor>): Function {
  return function fieldMapDecorator<T extends MysqlModelPrototype>(MysqlModelClass:T) {
    // See if there's a primary key in the field map
    let primaryKey: (string | undefined) = undefined;
    Object.keys(tableSchemaObj).find(key => {
      primaryKey = tableSchemaObj[key].primaryKey ? key : undefined;
      return !!primaryKey;
    });

    return class extends MysqlModelClass {
      private static _mysqlFields: Dictionary<ColumnDescriptor> = tableSchemaObj;
      private static _mysqlPrimaryKey: (string | undefined) = primaryKey;
    }
  }
}
