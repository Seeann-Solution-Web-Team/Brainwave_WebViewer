import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';

import Viewer from './pages/viewer';
import LoginPage from './pages/loginpage'

export default(
    <BrowserRouter>
        <Route exact path="/" component={Viewer}/>
        <Route path='/login' component={LoginPage}/>
    </BrowserRouter>
);