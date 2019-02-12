import * as express from 'express';
import * as http from 'http';

import { IHttpConfig } from './interfaces/config';
import { RouteMap, RouteHandler } from './interfaces/route';
import { Controller } from './lib/controller';

const AVAILABLE_ROUTE_METHODS: Array<string> = [
  'all', 'get', 'post', 'update', 'delete'
];

const DEFAULT_OPTIONS: IHttpConfig = {
  port: 4141
};

export class App {
  private app: express.Express;
  private server: http.Server;
  private options: IHttpConfig;

  constructor(options: IHttpConfig = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.server = http.createServer(this.app);
  }

  /**
   * Adds the routes defined in the controller to the express app
   *
   * @param controller The controller to add routes for
   */
  public addController(controller: Controller) {
    const routeMap: RouteMap = controller.getRouteMap();
    Object.keys(routeMap).forEach((routePath: string) => {
      const { app } = this;
      const routeTokens: Array<string> = routePath.split(':');
      const routeMethod: string = routeTokens.length === 1 ? 'all' : routeTokens.shift();
      const routeUrl: string = routeTokens.join(':');
      const routeHandler: express.RequestHandler = this._handleRequest(routeMap[routePath]);

      if (!AVAILABLE_ROUTE_METHODS.includes(routeMethod)) {
        throw new Error(`Invalid route method: ${routePath}`);
      }

      console.log('Setting up handler for: ', routeMethod.toUpperCase(), routeUrl);

      // Would prefer to: app[routeMethod](routeUrl, routeHandler);
      // Need to figure out how to TS that...
      switch (routeMethod) {
        case 'get':
          app.get(routeUrl, routeHandler);
          break;
        case 'post':
          app.post(routeUrl, routeHandler);
          break;
        case 'update':
          app.post(routeUrl, routeHandler);
          break;
        case 'delete':
          app.post(routeUrl, routeHandler);
          break;
        default:
          app.all(routeUrl, routeHandler);
          break;
      }
    });
  }

  /**
   * Starts the HTTP server
   */
  public async start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.options.port, (err: any) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  /**
   * Curries a route handler with an express request handler. The
   * route handler's output is sent as JSON.
   *
   * @param handler The route handler to invoke
   */
  private _handleRequest(handler: RouteHandler): express.RequestHandler {
    return async (req: express.Request, res: express.Response): Promise<void> => {
      let data = null;
      try {
        data = await handler(req, res);
      } catch (error) {
        data = { error };
        console.error(error);
        console.trace();
      }
      res.json(data);
    };
  }
}
