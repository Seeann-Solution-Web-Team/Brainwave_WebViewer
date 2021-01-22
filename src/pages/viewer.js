import React from 'react';
import './viewer.css';
import { Navbar, Image } from 'react-bootstrap';
import WaveGraphPlayer from '../components/WaveGraphPlayer';
import PlayerController from '../components/PlayerController';
import ChannelList from '../components/ChannelList';
import RHSFile from '../components/RHSFile';

class viewer extends React.Component {
  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
    this.channelListRef = React.createRef();

    this.state = {
      isLogin: '',
      isLoading: false,
    };

    this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
    this.onStopButtonClicked = this.onStopButtonClicked.bind(this);
    this.onReplayButtonClicked = this.onReplayButtonClicked.bind(this);

    this.onCountChanged = this.onCountChanged.bind(this);
    this.onChannelChanged = this.onChannelChanged.bind(this);
    this.onSpeedChanged = this.onSpeedChanged.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);

    this.onFileLoadStart = this.onFileLoadStart.bind(this);
    this.onLoadingProgressChanged = this.onLoadingProgressChanged.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state.fileId === undefined) return;

    //Load File
    var rhs = new RHSFile();
    this.setState({ isLoading: true });
    rhs.load(
      this.props.location.state.fileId,
      this.onFileLoaded,
      this.onLoadingProgressChanged
    );
  }

  onPlayButtonClicked() {
    this.playerRef.graphRef.play();
  }

  onStopButtonClicked() {
    this.playerRef.graphRef.stop();
  }

  onReplayButtonClicked() {
    this.playerRef.graphRef.setoffset(0.0);
  }

  onCountChanged(v) {
    this.playerRef.setPeakCount(v);
  }

  onChannelChanged(v) {
    this.playerRef.setChannelCount(v);
  }

  onSpeedChanged(v) {
    this.playerRef.setSpeed(v);
  }

  onSelectionChanged(arr) {
    console.log(arr);
    this.playerRef.setChannelSelection(arr);
  }

  onFileLoadStart() {
    this.playerRef.currentFile = null;
    this.playerRef.graphRef.stop();
    this.setState({ isLoading: true });
  }

  onLoadingProgressChanged(file, prog) {
    console.log(prog + '%');

    var loadingTxt = document.getElementById('loadingTxt');

    if (loadingTxt !== undefined) {
      loadingTxt.innerHTML = 'LOADING (' + Math.floor(prog * 10) * 0.1 + '%)';
    }
  }

  onFileLoaded(file) {
    if (file.isInitialized) {
      this.playerRef.graphRef.stop();
      this.playerRef.applyFile(file);

      this.channelListRef.current.setChannelList(file.getChannelData());
    } else {
      alert('Failed to get file ' + file.id);
    }

    this.setState({ isLoading: false });
  }

  render() {
    const loadingScreenStyle = {
      margin: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#282c3480',
      zIndex: '2',
      position: 'absolute',
    };

    const loadingTxtStyle = {
      top: '50%',
      fontSize: '24px',
      transform: 'translateY(-50%)',
      position: 'absolute',
    };

    return (
      <div className='main_container'>
        <div className='main_nav'>
          <Navbar bg='dark' variant='dark'>
            <Navbar.Brand href='/'>Brain - WEB</Navbar.Brand>
            <Navbar.Collapse className='justify-content-end'>
              <Navbar.Text>
                <a href='/login'>Sign in</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div className='main__contents'>
          <div className='menu'>
            <div className='menu__controls'>
              <PlayerController
                onPlayButtonClicked={this.onPlayButtonClicked}
                onStopButtonClicked={this.onStopButtonClicked}
                onReplayButtonClicked={this.onReplayButtonClicked}
                onCountChanged={this.onCountChanged}
                onChannelChanged={this.onChannelChanged}
                onSpeedChanged={this.onSpeedChanged}
              />
            </div>
            <div className='menu__channel_list'>
              <ChannelList
                ref={this.channelListRef}
                onFileLoadStart={this.onFileLoadStart}
                onFileLoaded={this.onFileLoaded}
                onSelectionChanged={this.onSelectionChanged}
              />
            </div>
          </div>
          <div className='graph_viewer'>
            <WaveGraphPlayer
              ref={(ref) => {
                this.playerRef = ref;
              }}
            />
          </div>
          {this.state.isLoading ? (
            <div style={loadingScreenStyle}>
              <span id='loadingTxt' style={loadingTxtStyle}>
                LOADING
              </span>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

export default viewer;
