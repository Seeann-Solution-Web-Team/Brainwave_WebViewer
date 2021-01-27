import React from 'react';
import { Button } from 'react-bootstrap';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }
  handleLogout = (e) => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(window.localStorage.clear())
      .then((window.location.href = '/login'));
  };

  render() {
    return <Button onClick={this.handleLogout}>Log out </Button>;
  }
}

export default Logout;
