import React from 'react';
import { Button } from 'react-bootstrap';

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <Button variant='outline-primary'>Delete</Button>
      </>
    );
  }
}

export default DeleteButton;
