import React from 'react';
import { Table, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import UploadModal from '../components/UploadModal';
import './storagePage.css';

class StoragePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: true,
      selectedFileId: null,
      uploadFile: null,
      uploadFileTitle: null,
      dataList: null,
    };
  }

  getUserFileList = () => {
    fetch('/api/storage/filelist')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          dataList: res,
        });
      });
  };
  componentDidMount = (e) => {
    this.getUserFileList();
  };

  getSelectedFileId = (Id) => {
    this.setState(
      {
        selectedFileId: Id,
      },
      () => {
        console.log(this.state.selectedFileId);
      }
    );
  };

  handleUpload = (e) => {
    console.log('handle Upload');
    console.log('title:', this.state.uploadFileTitle);
    console.log('file:', this.state.uploadFile);
    if (this.state.uploadFileTitle === null || this.state.uploadFile === null) {
      alert('Missing fields');
    } else {
      let formData = new FormData();
      formData.append('title', this.state.uploadFileTitle);
      formData.append('rhs_file', this.state.uploadFile);
      const upload_options = {
        method: 'POST',
        body: formData,
      };
      fetch('/api/storage/userfile', upload_options).then((result) => {
        console.log('handleUpload result:', result);
        this.setModalShow(false);
        this.setState({
          uploadFileTitle: null,
          uploadFile: null,
        });
        this.getUserFileList();
      });
    }
  };

  handleFileRemove = (e) => {
    console.log('handle file remove');
    if (this.state.selectedFileId !== null) {
      console.log('selected file ID:', this.state.selectedFileId);
      const delete_dto = {
        fileId: this.state.selectedFileId,
      };

      const delete_options = {
        method: 'DELETE',
        body: JSON.stringify(delete_dto),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      fetch(`/api/storage/userfile`, delete_options).then((res) => {
        console.log('handle delete: ', res);
        this.setState({
          selectedFileId: null,
        });
        this.getUserFileList();
      });
    } else {
      alert('Please select a file to delete');
    }
  };

  getDataList(e) {}

  setModalShow = (show) => {
    this.setState({
      modalShow: show,
    });
  };

  handleFileInput = (e) => {
    let files = e.target.files;
    console.log('fileinput: ', files);

    if (files && files.length > 0) {
      this.setState({ uploadFile: files[0] });
    } else {
      console.log('no files selected');
    }
  };

  handleFileTitle = (e) => {
    this.setState({
      uploadFileTitle: e.target.value,
    });
  };

  render() {
    return (
      <div className='storage_container'>
        <DataTable
          className='storage_list'
          dataList={this.state.dataList}
          getSelectedFileId={this.getSelectedFileId}
        />
        <UploadModal
          show={this.state.modalShow}
          onHide={() => this.setModalShow(false)}
          handleUpload={() => this.handleUpload()}
          handleFileInput={this.handleFileInput}
          handleFileTitle={this.handleFileTitle}
        />
        <div className='storage_button'>
          <Button
            variant='outline-primary'
            onClick={() => this.setModalShow(true)}
          >
            Upload
          </Button>
          <Button variant='outline-primary'>Revise</Button>
          <Button variant='outline-primary' onClick={this.handleFileRemove}>
            Delete
          </Button>
        </div>
      </div>
    );
  }
}

export default StoragePage;
