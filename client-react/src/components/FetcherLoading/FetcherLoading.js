import React from 'react';
import PropTypes from 'prop-types';
import { subscribe } from 'lib/core';
import { Fetcher } from 'subjects/Fetcher';

@subscribe
export class FetcherLoading extends React.Component {

  static propTypes = {
    fetcher: PropTypes.instanceOf(Fetcher)
  }

  render() {
    if (this.props.fetcher.loading) {
      return (
        <div>Loading</div>
      );
    } else {
      return this.props.children;
    }
  }
}

