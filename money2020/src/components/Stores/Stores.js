// src/components/About/index.js
import React, { PropTypes, Component } from 'react';

import './Stores.css';

export default class About extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { props } = this.props;
    return (
      <div className="Stores">
        <h1>
          Stores are dumb
        </h1>
      </div>
    );
  }
}