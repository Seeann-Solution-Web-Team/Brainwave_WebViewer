import { Modal, Button, Form } from 'react-bootstrap';
import React from 'react';

const RenameModal = (props) => {
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
        <Modal.Title>Rename Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='Title'
              onChange={props.handleRenameFileTitle}
              defaultValue={props.selectedFileTitle}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onHide}>
          Close
        </Button>
        <Button variant='primary' onClick={props.handleRename} type='submit'>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RenameModal;
