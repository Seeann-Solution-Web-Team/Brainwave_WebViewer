import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class UploadModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop='static'
        keyboard={false}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Title'
                onChange={this.props.handleFileTitle}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                name='rhs_file'
                required
                accept='.rhs'
                onChange={this.props.handleFileInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.props.onHide}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={this.props.handleUpload}
            type='submit'
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UploadModal;
