import CanvasGraph from './CanvasGraph';
import React from 'react';

class WaveGraphPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: 32,
      count: 1000,
      speed: 1.0,
      canvasWidth: 1600,
      isPlaying: false,
    };

    this.graphRef = React.createRef();
    this.currentFile = null;

    this.onPlayStateChanged = this.onPlayStateChanged.bind(this);
    this.onOffsetChanged = this.onOffsetChanged.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
    this.onResize = this.onResize.bind(this);

    this.applyFile = this.applyFile.bind(this);
  }

  componentDidMount() {
    this.setState({ isPlaying: this.graphRef.isPlaying });
    this.onResize();
    //fetch('http://localhost:3000/api');
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);

    this.timeLabel = document.getElementById('timeLabel');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  applyFile(file) {
    //apply to CanvasGraph
    var ampData = file.getNormalizedAmpData();
    this.setState({ channels: ampData.length });
    this.currentFile = file;
    this.graphRef.setfile(file);
  }

  onPlayStateChanged() {
    if (this.graphRef === null) return;

    this.setState({ isPlaying: this.graphRef.isPlaying });
  }

  onOffsetChanged(p) {
    if (this.currentFile === null) return;

    var current = Math.floor(p * this.currentFile.recordLength);
    var recordMin = Math.floor(this.currentFile.recordLength / 60)
      .toString()
      .padStart(2, '0');
    var recordSec = (this.currentFile.recordLength % 60)
      .toString()
      .padStart(2, '0');

    var currentMin = Math.floor(current / 60)
      .toString()
      .padStart(2, '0');
    var currentSec = (current % 60).toString().padStart(2, '0');

    this.timeLabel.innerHTML =
      currentMin + ':' + currentSec + '/' + recordMin + ':' + recordSec;
  }

  onPlayButtonClicked(e) {
    this.graphRef.togglePlay();
  }

  onKeyDown(e) {
    if (e.keyCode === 32) this.graphRef.togglePlay();
    else if (e.keyCode === 37) this.graphRef.prev();
    else if (e.keyCode === 39) this.graphRef.next();
  }

  onResize() {
    this.setState({
      canvasWidth: this.graphRef.getCanvas().getBoundingClientRect().width,
    });
  }

  setChannelCount(c) {
    this.setState({ channels: c });
  }

  setPeakCount(c) {
    this.setState({ count: c });
  }

  setSpeed(s) {
    this.setState({ speed: s * 1.0 });
  }

  setChannelSelection(selection) {
    this.graphRef.setchannelsenabled(selection);
    this.setState({ channels: selection.length });
  }

  render() {
    /*
        var btnStyle={
            height: '50px',
            width: '50px'
        }
        */
    var labelStyle = {
      fontSize: '18px',
      display: 'flex',
      alignSelf: 'start',
    };

    return (
      <div>
        <CanvasGraph
          ref={(ref) => {
            this.graphRef = ref;
          }}
          height={25}
          width={this.state.canvasWidth}
          margin={10}
          channels={this.state.channels}
          count={this.state.count}
          speed={this.state.speed}
          strokeColor='#FFFFFF'
          onPlayStateChanged={this.onPlayStateChanged}
          onOffsetChanged={this.onOffsetChanged}
        />
        <div>
          <label id='timeLabel' style={labelStyle}>
            00:00/00:00
          </label>
        </div>
      </div>
    );

    /*
        <button onClick={this.onPlayButtonClicked} style={btnStyle}>
                    {this.state.isPlaying ? "stop" : "play"}
                </button>
         */
  }
}

export default WaveGraphPlayer;
