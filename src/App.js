import React from 'react';
import './App.css';

import Viewer from './pages/viewer';
import LoginPage from './pages/loginpage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api')
      .then((res) => res.json())
      .then((data) => this.setState({ username: data.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div className='App'>
        <header className='App-header'>
          {username ? `Hello ${username}` : 'Hello World'}
        </header>
      </div>
    );
  }
}

export default App;
