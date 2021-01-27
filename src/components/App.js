import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginPage from '../pages/loginpage';
import Viewer from '../pages/viewer';
import SignUpPage from '../pages/signUpPage';
import StoragePage from '../pages/storagePage';
import MainNavbar from '../components/MainNavbar';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem('loggedIn');
  });
  const [username, setUserName] = useState(() => {
    return window.localStorage.getItem('username');
  });

  return (
    <BrowserRouter>
      <div>
        <MainNavbar loggedIn={loggedIn} username={username} />
        <Switch>
          <Route exact path='/' component={Viewer} />
          <Route path='/login' component={LoginPage} />
          <Route path='/signup' component={SignUpPage} />
          <Route path='/storage' component={StoragePage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
