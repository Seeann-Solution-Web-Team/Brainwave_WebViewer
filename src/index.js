import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.render(routes, document.getElementById('root'));
reportWebVitals();
