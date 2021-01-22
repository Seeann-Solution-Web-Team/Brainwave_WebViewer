//import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
//import App from './App';
import reportWebVitals from './reportWebVitals';

import routes from './routes'

/*
const app = <React.StrictMode>
                <App/>
            </React.StrictMode>;
*/

ReactDOM.render(routes, document.getElementById('root'));
reportWebVitals();