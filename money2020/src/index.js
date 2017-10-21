// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// import App from './components/App/App.js';
import './index.css';

injectTapEventPlugin();
const browserHistory = useRouterHistory(createHistory)({ basename: '/' })

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Routes history={browserHistory} />
  </MuiThemeProvider>,
  document.getElementById('root')
);