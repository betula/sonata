import React from 'react';
import { subscribe, inject } from 'lib/core';
import { Account } from 'subjects/Account';
import { FetcherLoader } from './FetcherLoader';
import { Feed } from './Feed';

@subscribe
export class App extends React.PureComponent {

  @inject(Account) account;

  constructor() {
    super();
    this.account.fetcher.fetch();
  }

  render() {
    return (
      <FetcherLoader
        fetcher={this.account.fetcher}
        ok={() => <Feed />}
        />
    );
  }
}