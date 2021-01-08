import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Router, browserHistory as history} from 'react-router';
import routes from './routes'

const app = <React.StrictMode>
                <App/>
            </React.StrictMode>;

const r = <BrowserRouter>{routes}</BrowserRouter>;

ReactDOM.render(r, document.getElementById('root'));
reportWebVitals();