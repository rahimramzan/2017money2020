
import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App/App.js';
import Stores from './components/Stores/Stores.js';
import Dash from './components/Dash/Dash.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/stores" component={Stores} />
    <Route path="/dash" component={Dash} />    
  </Router>
);

export default Routes;