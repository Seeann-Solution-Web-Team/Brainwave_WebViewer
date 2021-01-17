import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginPage from '../pages/loginPage';
import index from '../pages/index';
import SignUpPage from '../pages/signUpPage';
import StoragePage from '../pages/storagePage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={index} />
          <Route path='/login' component={LoginPage} />
          <Route path='/signup' component={SignUpPage} />
          <Route path='/storage' component={StoragePage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
