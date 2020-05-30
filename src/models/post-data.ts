import { Dictionary } from '../interfaces/common';

import { ImageType } from './image';
import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey,
  ColumnDescriptor,
  ColumnTypes,
} from '../lib/mysql-model';

const TABLE_NAME = 'post_data';

const FIELD_MAP: Dictionary<ColumnDescriptor> = {
  id: { name: 'pd_id', type: ColumnTypes.Number },
  imageId: { name: 'image_id', type: ColumnTypes.Number },
  postId: { name: 'post_id', type: ColumnTypes.Number },
  width: { name: 'image_width', type: ColumnTypes.Number },
  height: { name: 'image_height', type: ColumnTypes.Number },
  caption: { name: 'image_caption', type: ColumnTypes.String },
  sourceUrl: { name: 'image_source', type: ColumnTypes.String },
  type: { name: 'image_type', type: ColumnTypes.String },
  sourceId: { name: 'source_id', type: ColumnTypes.Number },
  sourceName: { name: 'source_name', type: ColumnTypes.String },
  title: { name: 'post_title', type: ColumnTypes.String },
  keywords: { name: 'post_keywords', type: ColumnTypes.String },
  nsfw: { name: 'post_nsfw', type: ColumnTypes.Boolean },
  dateCreated: { name: 'post_date', type: ColumnTypes.Number },
  externalId: { name: 'post_external_id', type: ColumnTypes.String },
  score: { name: 'post_score', type: ColumnTypes.Number },
  visible: { name: 'post_visible', type: ColumnTypes.Boolean },
  userId: { name: 'user_id', type: ColumnTypes.Number },
  userName: { name: 'user_name', type: ColumnTypes.String },
};

export interface IPostData {
  id: number;
  imageId: number;
  postId: number;
  width: number;
  height: number;
  caption: string;
  sourceUrl: string;
  type: ImageType;
  sourceId: number;
  sourceName: string;
  title: string;
  keywords: string;
  nsfw: boolean;
  dateCreated: number;
  externalId: string;
  score: number;
  visible: boolean;
  userId: number;
  userName: string;
}

@tableName(TABLE_NAME)
@fieldMap(FIELD_MAP)
@primaryKey('id')
export class PostDataModel extends MysqlModel {
  public id: number;
  public imageId: number;
  public postId: number;
  public width: number;
  public height: number;
  public caption: string;
  public sourceUrl: string;
  public type: ImageType;
  public sourceId: number;
  public sourceName: string;
  public title: string;
  public keywords: string;
  public nsfw: boolean;
  public dateCreated: number;
  public externalId: string;
  public score: number;
  public visible: boolean;
  public userId: number;
  public userName: string;

  constructor() {
    super();
  }

  public static create() {
    return new PostDataModel();
  }
}
