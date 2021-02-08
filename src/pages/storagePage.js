import React from 'react';
import { Table, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CustomModal from '../components/modals/CustomModal';
import './storagePage.css';
import axios from 'axios';

class StoragePage extends React.Component {
  constructor(props) {
    super(props);

    this.getSelectedFileTitle = this.getSelectedFileTitle.bind(this);
    this.state = {
      modalShow: false,
      modalType: '',
      selectedFileId: null,
      selectedFileTitle: null,
      uploadFile: null,
      uploadFileTitle: null,
      renameFileTitle: null,
      dataList: null,
    };
  }

  componentDidMount = (e) => {
    if (!window.localStorage.getItem('loggedIn')) {
      window.location.href = '/login';
    } else {
      this.getUserFileList();
    }
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

  setModalShow = (show, type) => {
    this.setState({
      modalType: type,
      modalShow: show,
    });
  };

  getUserFileList = () => {
    axios
      .get('/api/storage/filelist')
      .then((res) => {
        console.log(res.data);
        this.setState({
          dataList: res.data,
        });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error.response.status);
          axios
            .get('/api/auth/accessToken')
            .then(() => {
              this.getUserFileList();
            })
            .catch((error2) => {
              if (error2.response.status === 401) {
                window.localStorage.clear();
                this.props.history.push('/login');
              }
            });
        }
      });
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
      const upload_datas = {
        title: this.state.uploadFileTitle,
        rhs_file: this.state.uploadFile,
      };

      axios
        .post('/api/storage/userfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((result) => {
          console.log('handleUpload result:', result);
          this.setModalShow(false);
          this.setState({
            uploadFileTitle: null,
            uploadFile: null,
          });
          this.getUserFileList();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log(error.response.status);
            axios
              .get('/api/auth/accessToken')
              .then(() => {
                this.handleUpload();
              })
              .catch((error2) => {
                if (error2.response.status === 401) {
                  window.localStorage.clear();
                  this.props.history.push('/login');
                }
              });
          }
        });
    }
  };

  handleRename = (e) => {
    console.log('handle rename file', this.state.renameFileTitle);
    const renameData = {
      filename: this.state.renameFileTitle,
      fileId: this.state.selectedFileId,
    };
    axios
      .put('/api/storage/userfile', renameData)
      .then((result) => {
        console.log('handleRename result:', result);
        this.setModalShow(false);
        this.setState({
          renameFileTitle: null,
        });
        this.getUserFileList();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log(error.response.status);
          axios
            .get('/api/auth/accessToken')
            .then(() => {
              this.handleRename();
            })
            .catch((error2) => {
              if (error2.response.status === 401) {
                window.localStorage.clear();
                this.props.history.push('/login');
              }
            });
        }
      });
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
      fetch(`/api/storage/userfile`, delete_options)
        .then((res) => {
          console.log('handle delete: ', res);
          this.setState({
            selectedFileId: null,
          });
          this.getUserFileList();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log(error.response.status);
            axios
              .get('/api/auth/accessToken')
              .then(() => {
                this.handleFileRemove();
              })
              .catch((error2) => {
                if (error2.response.status === 401) {
                  window.localStorage.clear();
                  this.props.history.push('/login');
                }
              });
          }
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

  handleUploadFileInput = (e) => {
    let files = e.target.files;
    console.log('fileinput: ', files);

    if (files && files.length > 0) {
      this.setState({ uploadFile: files[0] });
    } else {
      console.log('no files selected');
    }
  };

  handleUploadFileTitle = (e) => {
    this.setState({
      uploadFileTitle: e.target.value,
    });
  };

  handleRenameFileTitle = (e) => {
    this.setState({
      renameFileTitle: e.target.value,
    });
  };

  render() {
    return (
      <div className='storage_container'>
        <DataTable
          className='storage_list'
          dataList={this.state.dataList}
          getSelectedFileId={this.getSelectedFileId}
          getSelectedFileTitle={this.getSelectedFileTitle}
        />
        <CustomModal
          show={this.state.modalShow}
          onHide={() => this.setModalShow(false)}
          type={this.state.modalType}
          handleUpload={() => this.handleUpload()}
          handleUploadFileInput={this.handleUploadFileInput}
          handleUploadFileTitle={this.handleUploadFileTitle}
          handleRename={this.handleRename}
          handleRenameFileTitle={this.handleRenameFileTitle}
          selectedFileTitle={this.state.selectedFileTitle}
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
