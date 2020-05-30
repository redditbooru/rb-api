import { Dictionary } from '../interfaces/common';

import {
  MysqlModel,
  tableName,
  fieldMap,
  primaryKey
} from '../lib/mysql-model';

export enum ImageType {
  PNG = 'png',
  JPEG = 'jpg',
  GIF = 'gif'
}

const TABLE_NAME = 'post_data';

const FIELD_MAP: Dictionary<string> = {
  id: 'image_id',
  url: 'image_url',
  caption: 'image_caption',
  sourceUrl: 'image_source',
  width: 'image_width',
  height: 'image_height',
  histR1: 'image_hist_r1',
  histR2: 'image_hist_r2',
  histR3: 'image_hist_r3',
  histR4: 'image_hist_r4',
  histG1: 'image_hist_g1',
  histG2: 'image_hist_g2',
  histG3: 'image_hist_g3',
  histG4: 'image_hist_g4',
  histB1: 'image_hist_b1',
  histB2: 'image_hist_b2',
  histB3: 'image_hist_b3',
  histB4: 'image_hist_b4',
  dHashR: 'image_dhashr',
  dHashG: 'image_dhashg',
  dHashB: 'image_dhashb',
  type: 'image_type'
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
