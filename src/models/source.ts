import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';

const TABLE_NAME = 'sources';

const FIELD_MAP: Dictionary<ColumnDescriptor> = {
  id: { name: 'source_id', type: ColumnTypes.Number },
  name: { name: 'source_name', type: ColumnTypes.String },
  enabled: { name: 'source_enabled', type: ColumnTypes.Boolean },
  subdomain: { name: 'source_subdomain', type: ColumnTypes.String }
};

@tableName(TABLE_NAME)
@fieldMap(FIELD_MAP)
@primaryKey('id')
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
