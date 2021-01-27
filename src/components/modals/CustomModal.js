import React from 'react';
import UpdateModal from './UpdateModal';
import RenameModal from './RenameModal';

class CustomModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let modal = <div></div>;
    if (this.props.type === 'upload') {
      modal = (
        <UpdateModal
          show={this.props.show}
          onHide={this.props.onHide}
          handleUploadFileTitle={this.props.handleUploadFileTitle}
          handleUploadFileInput={this.props.handleUploadFileInput}
          handleUpload={this.props.handleUpload}
        />
      );
    } else if (this.props.type === 'rename') {
      modal = (
        <RenameModal
          show={this.props.show}
          onHide={this.props.onHide}
          handleRenameFileTitle={this.props.handleRenameFileTitle}
          handleRename={this.props.handleRename}
          selectedFileTitle={this.props.selectedFileTitle}
        />
      );
    }
    return modal;
  }
}

export default CustomModal;
{
  /* <div>
        {this.props.type == 'upload' ? (
          <UpdateModal
            show={this.props.show}
            onHide={this.props.onHide}
            handleFileTitle={this.props.handleFileTitle}
            handleFileInput={this.props.handleFileInput}
            handleUpload={this.props.handleUpload}
          />
        ) : (
          <div></div>
        )}
      </div> */
}
