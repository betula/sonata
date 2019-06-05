import React from "react";
import { subscribe, provide } from "@lib/core";
import { Account } from "@services/Account";
import { FetcherLoader } from "./FetcherLoader";
import { Feed } from "./Feed";

@subscribe
export class App extends React.PureComponent {
  @provide public account: Account;

  constructor(props: any) {
    super(props);
    this.account.fetcher.exec();
  }

  public render() {
    return <FetcherLoader fetcher={this.account.fetcher} ok={() => <Feed />} />;
  }
}
