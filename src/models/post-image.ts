import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  tableSchema,
  ColumnTypes,
} from '../lib/mysql-model';

export interface IPostData {
  postId: number;
  imageId: number;
}

@tableName('post_images')
@tableSchema({
  postId: { name: 'post_id', type: ColumnTypes.Number },
  imageId: { name: 'image_id', type: ColumnTypes.Number },
})
export class PostImageModel extends MysqlModel {
  public imageId: number;
  public postId: number;

  constructor() {
    super();
  }

  public static create() {
    return new PostDataModel();
  }
}
