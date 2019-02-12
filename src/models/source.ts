import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey
} from '../lib/mysql-model';

const TABLE_NAME = 'sources';

const FIELD_MAP: Dictionary<string> = {
  id: 'source_id',
  name: 'source_name',
  enabled: 'source_enabled',
  subdomain: 'source_subdomain'
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
