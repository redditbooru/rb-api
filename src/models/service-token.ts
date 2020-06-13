import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  tableSchema,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';

const TABLE_NAME = 'service_tokens';

const FIELD_MAP: Dictionary<ColumnDescriptor> = {
  id: { name: 'token_id', type: ColumnTypes.String, primaryKey: true },
  secret: { name: 'token_secret', type: ColumnTypes.String },
};

@tableName(TABLE_NAME)
@tableSchema(FIELD_MAP)
export class ServiceTokenModel extends MysqlModel {
  public id: string;
  public secret: string;

  constructor() {
    super();
  }

  public static create() {
    return new ServiceTokenModel();
  }
}
