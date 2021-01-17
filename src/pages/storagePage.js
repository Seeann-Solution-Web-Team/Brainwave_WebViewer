import React from 'react';
import { Table, Button } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import DeleteButton from '../components/Button/DeleteButton';
import ReviseButton from '../components/Button/ReviseButton';
import UploadButton from '../components/Button/UploadButton';

class StoragePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFileId: null,
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

  componentDidMount = () => {
    fetch('/api/storage')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
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

  handleUpload(e) {}

  getDataList(e) {}

  render() {
    return (
      <div>
        <DataTable
          dataList={this.state.dataList}
          getSelectedFileId={this.getSelectedFileId}
        />
        <UploadButton onClick={this.handleUpload} />
        <ReviseButton />
        <DeleteButton />
      </div>
    );
  }
}

export default StoragePage;
