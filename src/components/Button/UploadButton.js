import React from 'react';
import { Button } from 'react-bootstrap';

class UploadButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <Button variant='outline-primary'>Upload</Button>
      </>
    );
  }
}

export default UploadButton;
