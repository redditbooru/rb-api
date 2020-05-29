import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey
} from '../lib/mysql-model';

const TABLE_NAME = 'service_tokens';

const FIELD_MAP: Dictionary<string> = {
  id: 'token_id',
  secret: 'token_secret',
};

@tableName(TABLE_NAME)
@fieldMap(FIELD_MAP)
@primaryKey('id')
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
