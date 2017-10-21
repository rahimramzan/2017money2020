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
import './index.css';

const browserHistory = useRouterHistory(createHistory)({ basename: '/home' })

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);