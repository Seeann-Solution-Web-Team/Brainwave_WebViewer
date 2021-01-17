import React from 'react';
import { Table } from 'react-bootstrap';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.toggleActive = this.toggleActive.bind(this);
    this.state = {
      isActive: null,
    };
  }

  toggleActive = (i) => {
    if (i === this.state.isActive) {
      this.setState({
        isActive: null,
      });
      this.props.getSelectedFileId(null);
    } else {
      this.setState({
        isActive: i,
      });
      this.props.getSelectedFileId(i);
    }
  };

  render() {
    return (
      <>
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>File Name</th>
              <th>Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.dataList).map((item, i) => {
              let list = this.props.dataList;
              return (
                <tr
                  style={
                    this.state.isActive === list[item].id
                      ? { background: 'red' }
                      : { background: '' }
                  }
                  key={list[item].id}
                  onClick={() => this.toggleActive(list[item].id)}
                >
                  <td>{list[item].num}</td>
                  <td>{list[item].title}</td>
                  <td>{list[item].fileName}</td>
                  <td>{list[item].date}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

export default DataTable;
