import React from 'react';
import { Button } from 'react-bootstrap';

class ReviseButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <Button variant='outline-primary'>Revise</Button>
      </>
    );
  }
}

export default ReviseButton;
