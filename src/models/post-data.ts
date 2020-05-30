import { Dictionary } from '../interfaces/common';

import { ImageType } from './image';
import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey
} from '../lib/mysql-model';

const TABLE_NAME = 'post_data';

const FIELD_MAP: Dictionary<string> = {
  id: 'pd_id',
  imageId: 'image_id',
  postId: 'post_id',
  width: 'image_width',
  height: 'image_height',
  caption: 'image_caption',
  sourceUrl: 'image_source',
  type: 'image_type',
  sourceId: 'source_id',
  sourceName: 'source_name',
  title: 'post_title',
  keywords: 'post_keywords',
  nsfw: 'post_nsfw',
  dateCreated: 'post_date',
  externalId: 'post_external_id',
  score: 'post_score',
  visible: 'post_visible',
  userId: 'user_id',
  userName: 'user_name',
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
