import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './App';
import LoginPage from './pages/loginpage'
import MainPage from './pages/mainpage'

export default(
    <div>
        <Route exact path="/" component={App}/>
        <Route path='/login' component={LoginPage}/>
    </div>
);