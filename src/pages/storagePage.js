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
      dataList: {
        item1: {
          num: 1,
          id: '1225262-12352',
          title: '123',
          fileName: 'asd.rhs',
          date: 'Nov. 13',
        },
        item2: {
          num: 2,
          id: '12521621-213214',
          title: '456',
          fileName: 'asd.rhs',
          date: 'Nov. 13',
        },
        item3: {
          num: 3,
          id: '1231232-1254121',
          title: '245',
          fileName: 'asd.rhs',
          date: 'Nov. 13',
        },
      },
    };
  }

  componentDidMount = (e) => {
    console.log('storage/filelist');
    fetch('/api/storage/filelist')
      .then((res) => res.json())
      .then((res) => console.log(res));
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
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', this.state.uploadFileTitle);
    formData.append('uploadFile', this.state.uploadFile);
    const upload = {
      method: 'POST',
      body: formData,
    };
    fetch('/api/storage/userfile', upload).then((result) => {
      console.log('Success:', result);
    });
  };

  getDataList(e) {}

  setModalShow = (show) => {
    this.setState({
      modalShow: show,
    });
  };

  handleFileInput = (e) => {
    e.preventDefault();
    let files = e.target.files;

    if (files && files.length > 0) {
      this.setState({ uploadFile: files[0] });
    } else {
      console.log('no files selected');
    }
  };

  handleFileTitle = (e) => {
    e.preventDefault();
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
          handlFileInput={() => this.handlFileInput()}
          handleFileTitle={() => this.handleFileTitle()}
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
