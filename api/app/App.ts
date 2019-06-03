import { provide } from "@lib/core";
import { Db } from "@services/Db";
import { Server } from "@services/Server";
import { AccountRouter } from "@routers/AccountRouter";
import { FeedRouter } from "@routers/FeedRouter";

export class App {
  @provide public db: Db;
  @provide public server: Server;
  @provide public accountRouter: AccountRouter;
  @provide public feedRouter: FeedRouter;

  public async start(config: any) {
    this._configure(config);
    await this._init();
    this._run();
  }

  private _configure({ db, server }: { db: any, server: any }) {
    this.db.configure(db);
    this.server.configure(server);
  }

  private async _init() {
    await this.db.init();
    this.accountRouter.init();
    this.feedRouter.init();
  }

  private _run() {
    this.server.run();
  }
}
