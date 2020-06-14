import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  tableSchema,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';

@tableName('service_tokens')
@tableSchema({
  id: { name: 'token_id', type: ColumnTypes.String, primaryKey: true },
  secret: { name: 'token_secret', type: ColumnTypes.String },
})
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
