import * as express from 'express';

import { Controller } from '../lib/controller';
import { RouteMap } from '../interfaces/route';
import { MysqlDb } from '../lib/mysql-db';
import { SourceModel } from '../models/source';
import { cache, CacheDuration } from '../lib/cache';

export class SourceController extends Controller {
  public static create(db: MysqlDb): SourceController {
    return new SourceController(db);
  }

  @cache('allSources')
  public async getSources(req: express.Request): Promise<any> {
    return await SourceModel.selectAll(this.db);
  }

  @cache('sourceById', CacheDuration.LONG, [ 'sourceId' ])
  public async getSourceById({ sourceId }: { sourceId: number }): Promise<any> {
    return await SourceModel.selectById(this.db, sourceId);
  }

  public getRouteMap(): RouteMap {
    return {
      'get:/sources': this.getSources.bind(this),
      'get:/sources/:sourceId': async (req: express.Request) => (
        this.getSourceById({ sourceId: parseInt(req.params.sourceId, 10) })
      ),
    };
  }
}
