import { Dictionary } from 'dxmp-common';
import * as express from 'express';

export type RouteHandler = (req: express.Request, res?: express.Response) => any;

export type RouteMap = Dictionary<RouteHandler>;