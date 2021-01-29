import React from 'react';

class FileManagement extends React.Component{
    constructor(props){
        super(props);

        this.openFile = this.openFile.bind(this);
        this.renameFile = this.renameFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);

        //Request file list to back-end
        //fetch("/files");

        this.state = {
            fileList: [
                "intan_save_210107_151441.rhs",
                "sample_0.rhs",
                "sample_1.rhs",
                "sample_2.rhs",
                "sample_3.rhs"],
        };
    }

    componentDidMount() {
    }

    openFile (){
        var selected = document.getElementById("fileList").value;
        if (selected.length < 1)
            return;
        
        this.props.history.push('/viewer/' + selected);
    }

    renameFile(){

    }

    uploadFile(){

    }

    deleteFile(){

    }

    render(){
        var containerStyle={
            width: '50vw'
        }

        var parentStyle={
            minWidth: '100vw',
            minHeight: '100vh',
            backgroundColor: '#282c34'
        }

        var selectStyle={
            width: '50vw',
            height: '80vh',
            backgroundColor: '#323741'
        }

        var options = [];
        for (var i = 0; i < this.state.fileList.length; i++){
             options.push(
                 <option key={i} value={this.state.fileList[i]}>{this.state.fileList[i]}</option>
             )
        }

        return (
        <div style={parentStyle}>
            <div className="container" style={containerStyle}>
                <div className='d-flex justify-content-end'>
                    <div className='d-flex flex-column'>
                        <span>대충 이쯤에 로그인 정보</span>
                        <button className='btn btn-secondary'>Logout</button>
                    </div>
                </div>
                <br/>
                <br/>
                <span>여기도 뭐 하나 적어놔야 할것같은데 뭘 적어야 잘 적었다고 소문이 날까</span>
                <div className='d-flex justify-content-center'>
                </div>

                <div className='d-flex justify-content-center'>
                    <select id="fileList" className="form-select" style={selectStyle} onDoubleClick={this.onFileSelected} multiple>
                        {options}
                    </select>
                </div>

                <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary' onClick={this.openFile}>Open</button>
                    <button className='btn btn-secondary' onClick={this.renameFile}>Rename</button>
                    <button className='btn btn-secondary' onClick={this.uploadFile}>Upload</button>
                    <button className='btn btn-secondary' onClick={this.deleteFile}>Delete</button>
                </div>
            </div>
        </div>);
    }
}

export default FileManagement;