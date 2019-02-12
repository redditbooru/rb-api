import { App } from './src/app';
import { IAppConfig } from './src/interfaces/config';
import { Controller } from './src/lib/controller';
import { MysqlDb } from './src/lib/mysql-db';

import config from './config';

type ControllerPrototype = typeof Controller;

const ACTIVE_CONTROLLERS: Array<ControllerPrototype> = [

];

async function boot(appConfig: IAppConfig) {
  const db = new MysqlDb();
  await db.connect(appConfig.mysql);
  console.log('Connected to database: ', appConfig.mysql.database);

  const app = new App(appConfig.http);
  const activeControllers = ACTIVE_CONTROLLERS.forEach(
    <T extends ControllerPrototype>(ControllerClass: T) => {
      console.log('Adding controller', ControllerClass.name);
      const controller: Controller = ControllerClass.create(db);
      app.addController(controller);
    }
  );

  await app.start();

  console.log('Listening on', appConfig.http.port);
}

boot(config);