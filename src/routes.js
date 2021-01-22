import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';

import Viewer from './pages/viewer';
import LoginPage from './pages/loginpage';
import FileManagement from './pages/FileManagement';

export default(
    <BrowserRouter>
        <Route exact path='/viewer/:filePath' component={Viewer}/>
        <Route path='/loginpage' component={LoginPage}/>
        <Route path='/file_management' component={FileManagement}/>
    </BrowserRouter>
);