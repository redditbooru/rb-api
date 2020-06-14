import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  tableSchema,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';

@tableName('sources')
@tableSchema({
  id: { name: 'source_id', type: ColumnTypes.Number, primaryKey: true },
  name: { name: 'source_name', type: ColumnTypes.String },
  enabled: { name: 'source_enabled', type: ColumnTypes.Boolean },
  subdomain: { name: 'source_subdomain', type: ColumnTypes.String }
})
export class SourceModel extends MysqlModel {
  public id: number;
  public name: string;
  public enabled: boolean;
  public subdomain: string;

  constructor() {
    super();
  }

  public static create() {
    return new SourceModel();
  }
}
