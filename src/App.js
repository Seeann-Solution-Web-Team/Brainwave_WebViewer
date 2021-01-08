import React from 'react';
import './App.css';

import Viewer from './pages/viewer';
import LoginPage from './pages/loginpage'

function App() {
    if (true)
        return <div>{Viewer}</div>;
    else
        return <div>{LoginPage}</div>;
}

export default App;