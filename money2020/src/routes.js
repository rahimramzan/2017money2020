
import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App/App.js';
import Stores from './components/Stores/Stores.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/stores" component={Stores} />
  </Router>
);

export default Routes;