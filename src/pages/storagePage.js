import React from 'react';
import { Table, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CustomModal from '../components/CustomModal';
import './storagePage.css';

class StoragePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: true,
      modalType: null,
      selectedFileId: null,
      selectedFileTitle: null,
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

  getSelectedFileTitle = (title) => {
    this.setState(
      {
        selectedFileTitle: title,
      },
      () => {
        console.log(this.state.selectedFileTitle);
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

  handleFileRename = (e) => {
    console.log('handle fi');
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

  handleFileOpen = (e) => {
    if (this.state.selectedFileId !== null) {
      this.props.history.push({
        pathname: '/',
        state: { fileId: this.state.selectedFileId },
      });
    } else {
      console.log('file not selected');
      return;
    }
  };

  getDataList(e) {}

  setModalShow = (show, type) => {
    this.setState({
      modalShow: show,
      modalType: type,
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
        <CustomModal
          show={this.state.modalShow}
          onHide={() => this.setModalShow(false)}
          type={this.state.modalType}
          handleUpload={() => this.handleUpload()}
          handleFileInput={this.handleFileInput}
          handleFileTitle={this.handleFileTitle}
        />
        <div className='storage_button'>
          <Button
            variant='outline-primary'
            onClick={() => this.setModalShow(true, 'upload')}
          >
            Upload
          </Button>
          <Button
            variant='outline-primary'
            onClick={() => this.setModalShow(true, 'rename')}
            selectedFileTitle={this.state.selectedFileTitle}
          >
            Rename
          </Button>
          <Button variant='outline-primary' onClick={this.handleFileRemove}>
            Delete
          </Button>
          <Button variant='outline-primary' onClick={this.handleFileOpen}>
            Open
          </Button>
        </div>
      </div>
    );
  }
}

export default StoragePage;
