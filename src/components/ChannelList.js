import React from 'react';

class ChannelList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelNameList: [],
    };

    this.channelNameList_onchange = this.channelNameList_onchange.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  setChannelList(arr) {
    var nameArr = [];
    var i = 0;
    for (i = 0; i < arr.length; i++) {
      nameArr.push(arr[i].customName);
    }

    this.setState({
      channelNameList: nameArr,
    });

    //Deselect All
    var elements = document.getElementById('channelNameList').options;

    for (i = 0; i < elements.length; i++) {
      elements[i].selected = false;
    }
  }

  channelNameList_onchange() {
    var select = document.getElementById('channelNameList');
    var selectedIdx = [];
    var len = select.options.length;

    for (var i = 0; i < len; i++) {
      if (select.options[i].selected) {
        selectedIdx.push(i);
      }
    }

    this.props.onSelectionChanged(selectedIdx);
  }

  selectAll(){
    //Select All
    var selectedIdx = [];
    var elements = document.getElementById('channelNameList').options;
    for (var i = 0; i < elements.length; i++) {
      elements[i].selected = true;
      selectedIdx.push(i);
    }

    this.props.onSelectionChanged(selectedIdx);
  }

  render() {
    const divStyle={
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }
    const style = {
      height: '100%',
    };
    var options = [];
    for (var i = 0; i < this.state.channelNameList.length; i++) {
      options.push(
        <option key={i} value={this.state.channelNameList[i]}>
          {this.state.channelNameList[i]}
        </option>
      );
    }

    return (
      <div style={divStyle}>
        <button className='btn btn-secondary' onClick={this.selectAll}>Select All</button>
        <select
          id='channelNameList'
          className='files'
          onChange={this.channelNameList_onchange}
          multiple
          style={style}>
          {options}
        </select>
      </div>
    );
  }
}

export default ChannelList;
