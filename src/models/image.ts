import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey,
  ColumnDescriptor,
  ColumnTypes
} from '../lib/mysql-model';

export enum ImageType {
  PNG = 'png',
  JPEG = 'jpg',
  GIF = 'gif'
}

const TABLE_NAME = 'post_data';

const FIELD_MAP: Dictionary<ColumnDescriptor> = {
  id: { name: 'image_id', type: ColumnTypes.Number },
  url: { name: 'image_url', type: ColumnTypes.String },
  caption: { name: 'image_caption', type: ColumnTypes.String },
  sourceUrl: { name: 'image_source', type: ColumnTypes.String },
  width: { name: 'image_width', type: ColumnTypes.Number },
  height: { name: 'image_height', type: ColumnTypes.Number },
  histR1: { name: 'image_hist_r1', type: ColumnTypes.Number },
  histR2: { name: 'image_hist_r2', type: ColumnTypes.Number },
  histR3: { name: 'image_hist_r3', type: ColumnTypes.Number },
  histR4: { name: 'image_hist_r4', type: ColumnTypes.Number },
  histG1: { name: 'image_hist_g1', type: ColumnTypes.Number },
  histG2: { name: 'image_hist_g2', type: ColumnTypes.Number },
  histG3: { name: 'image_hist_g3', type: ColumnTypes.Number },
  histG4: { name: 'image_hist_g4', type: ColumnTypes.Number },
  histB1: { name: 'image_hist_b1', type: ColumnTypes.Number },
  histB2: { name: 'image_hist_b2', type: ColumnTypes.Number },
  histB3: { name: 'image_hist_b3', type: ColumnTypes.Number },
  histB4: { name: 'image_hist_b4', type: ColumnTypes.Number },
  dHashR: { name: 'image_dhashr', type: ColumnTypes.Number },
  dHashG: { name: 'image_dhashg', type: ColumnTypes.Number },
  dHashB: { name: 'image_dhashb', type: ColumnTypes.Number },
  type: { name: 'image_type', type: ColumnTypes.String }
};

export interface IPostData {
  id: number,
  url: string,
  caption: string,
  sourceUrl: string,
  width: number,
  height: number,
  histR1: number,
  histR2: number,
  histR3: number,
  histR4: number,
  histG1: number,
  histG2: number,
  histG3: number,
  histG4: number,
  histB1: number,
  histB2: number,
  histB3: number,
  histB4: number,
  dHashR: number,
  dHashG: number,
  dHashB: number,
  type: ImageType
}

@tableName(TABLE_NAME)
@fieldMap(FIELD_MAP)
@primaryKey('id')
export class ImageModel extends MysqlModel {
  public id: number;
  public url: string;
  public caption: string;
  public sourceUrl: string;
  public width: number;
  public height: number;
  public histR1: number;
  public histR2: number;
  public histR3: number;
  public histR4: number;
  public histG1: number;
  public histG2: number;
  public histG3: number;
  public histG4: number;
  public histB1: number;
  public histB2: number;
  public histB3: number;
  public histB4: number;
  public dHashR: number;
  public dHashG: number;
  public dHashB: number;
  public type: ImageType;

  constructor() {
    super();
  }

  public static create() {
    return new ImageModel();
  }
}
