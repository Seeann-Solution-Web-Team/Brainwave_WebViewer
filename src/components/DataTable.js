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

  toggleActive = (id, title) => {
    if (id === this.state.isActive) {
      this.setState({
        isActive: null,
      });
      this.props.getSelectedFileId(null);
      this.props.getSelectedFileTitle(null);
    } else {
      this.setState({
        isActive: id,
      });
      this.props.getSelectedFileId(id);
      this.props.getSelectedFileTitle(title);
    }
  };

  render() {
    let TableRow;
    if (this.props.dataList === null) {
      TableRow = <tbody></tbody>;
    } else {
      TableRow = (
        <tbody>
          {Object.keys(this.props.dataList).map((item, i) => {
            let list = this.props.dataList;
            let length = Object.keys(this.props.dataList).length;
            let num = length - i;
            return (
              <tr
                style={
                  this.state.isActive === list[item].id
                    ? { background: 'grey' }
                    : { background: '' }
                }
                key={list[item].id}
                onClick={() =>
                  this.toggleActive(list[item].id, list[item].user_title)
                }
              >
                <td>{num}</td>
                <td>{list[item].user_title}</td>
                <td>{list[item].name}</td>
                <td>{list[item].date}</td>
              </tr>
            );
          })}
        </tbody>
      );
    }

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
          {TableRow}
        </Table>
      </>
    );
  }
}

export default DataTable;
