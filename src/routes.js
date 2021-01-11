import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';

import Viewer from './pages/viewer';
import LoginPage from './pages/loginpage';
import index from './pages/index';
import SignUpPage from './pages/signUpPage';

export default (
  <BrowserRouter>
    <Route exact path='/' component={index} />
    <Route path='/login' component={LoginPage} />
    <Route path='/signup' component={SignUpPage} />
  </BrowserRouter>
);
