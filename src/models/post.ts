import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  tableSchema,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';
import { MysqlDb } from '../lib/mysql-db';

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

@tableName('posts')
@tableSchema({
  id: { name: 'post_id', type: ColumnTypes.Number, primaryKey: true },
  sourceId: { name: 'source_id', type: ColumnTypes.String },
  externalId: { name: 'post_external_id', type: ColumnTypes.String },
  dateCreated: { name: 'post_date', type: ColumnTypes.Number },
  dateUpdated: { name: 'post_updated', type: ColumnTypes.Number, nullable: true },
  title: { name: 'post_title', type: ColumnTypes.String },
  link: { name: 'post_link', type: ColumnTypes.String },
  userId: { name: 'user_id', type: ColumnTypes.Number },
  keywords: { name: 'post_keywords', type: ColumnTypes.String },
  score: { name: 'post_score', type: ColumnTypes.Number },
  visible: { name: 'post_visible', type: ColumnTypes.Boolean },
  nsfw: { name: 'post_nsfw', type: ColumnTypes.Boolean },
})
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

  public sync(db: MysqlDb): Promise<void> {
    this.dateUpdated = Math.round(Date.now() / 1000);
    return super.sync(db);
  }
}
