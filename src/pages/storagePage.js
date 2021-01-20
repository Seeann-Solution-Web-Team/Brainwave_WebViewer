import React from 'react';
import { Table, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
// import DeleteButton from '../components/Button/DeleteButton';
// import ReviseButton from '../components/Button/ReviseButton';
// import UploadButton from '../components/Button/UploadButton';
import UploadModal from '../components/UploadModal';

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
        // let datalist_JSON = [];
        // res.map((result) => {
        //   datalist_JSON.append(JSON.parse(result));
        // });

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
      const formData = new FormData();
      formData.append('title', this.state.uploadFileTitle);
      formData.append('rhs_file', this.state.uploadFile);
      const upload = {
        method: 'POST',
        body: formData,
      };
      fetch('/api/storage/userfile', upload).then((result) => {
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
      <div>
        <DataTable
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
        <Button
          variant='outline-primary'
          onClick={() => this.setModalShow(true)}
        >
          Upload
        </Button>
        <Button variant='outline-primary'>Revise</Button>
        <Button variant='outline-primary'>Delete</Button>
        {/* <UploadButton onClick={this.handleUpload} />
        <ReviseButton />
        <DeleteButton /> */}
      </div>
    );
  }
}

export default StoragePage;
