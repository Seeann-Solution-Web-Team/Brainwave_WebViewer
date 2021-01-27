import { Modal, Button, Form } from 'react-bootstrap';
import React from 'react';

const UpdateModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
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
              onChange={props.handleUploadFileTitle}
            />
          </Form.Group>
          <Form.Group>
            <Form.File
              name='rhs_file'
              required
              accept='.rhs'
              onChange={props.handleUploadFileInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onHide}>
          Close
        </Button>
        <Button variant='primary' onClick={props.handleUpload} type='submit'>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
