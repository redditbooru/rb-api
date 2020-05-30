import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey
} from '../lib/mysql-model';

const TABLE_NAME = 'posts';

const FIELD_MAP: Dictionary<string> = {
  id: 'post_id',
  sourceId: 'source_id',
  externalId: 'post_external_id',
  dateCreated: 'post_date',
  dateUpdated: 'post_updated',
  title: 'post_title',
  link: 'post_link',
  userId: 'user_id',
  keywords: 'post_keywords',
  score: 'post_score',
  visible: 'post_visible',
  nsfw: 'post_nsfw',
};

export interface IPost {
  id: number;
  sourceId: number;
  externalId: string;
  dateCreated: number;
  dateUpdated: number;
  title: string;
  link: string;
  userId: number;
  keywords: string;
  score: number;
  visible: boolean;
  nsfw: boolean;
}

@tableName(TABLE_NAME)
@fieldMap(FIELD_MAP)
@primaryKey('id')
export class PostModel extends MysqlModel implements IPost {
  public id: number;
  public sourceId: number;
  public externalId: string;
  public dateCreated: number;
  public dateUpdated: number;
  public title: string;
  public link: string;
  public userId: number;
  public keywords: string;
  public score: number;
  public visible: boolean;
  public nsfw: boolean;

  constructor() {
    super();
  }

  public static create() {
    return new PostModel();
  }
}
