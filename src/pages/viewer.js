import React from 'react';
import logo from '.././logo.svg';
import './viewer.css';
import CanvasGraph from './CanvasGraph';
import GLGraph from './GLGraph'
import RHSFile from './RHSFile'

class WaveGraphPlayer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            timescale: 1000,
            channels: 32,
            speed: 1.0,
            canvasWidth: 1600,
            canvasHeight: 800,
            isPlaying: false
        };

        this.graphRef = React.createRef();
        this.currentFile = null;

        this.onPlayStateChanged = this.onPlayStateChanged.bind(this);
        this.onOffsetChanged = this.onOffsetChanged.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
        this.onResize = this.onResize.bind(this);

        this.applyFile = this.applyFile.bind(this);
    }

    componentDidMount(){
        this.setState({isPlaying: this.graphRef.isPlaying});
        //fetch('http://localhost:3000/api');
        window.addEventListener("resize", this.onResize);
        window.addEventListener("keydown", this.onKeyDown);
        document.getElementById("gridCanvas").addEventListener("wheel", this.onWheel);

        this.timeLabel = document.getElementById('timeLabel');

        this.onResize();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("keydown", this.onKeyDown);
        document.getElementById("gridCanvas").removeEventListener("wheel", this.onWheel);
    }

    applyFile (file){
        //apply to CanvasGraph
        var ampData = file.getNormalizedAmpData();
        this.setState({channels: ampData.length});
        this.currentFile = file;
        this.graphRef.setfile(file);
    }

    onPlayStateChanged(){
        if (this.graphRef === null)
            return;

        this.setState({isPlaying: this.graphRef.isPlaying});
    }

    onOffsetChanged(p){
        if (this.currentFile === null)
            return;
        
        var current = Math.floor(p * this.currentFile.recordLength);
        var recordMin = (Math.floor(this.currentFile.recordLength / 60)).toString().padStart(2, '0');
        var recordSec = (this.currentFile.recordLength % 60).toString().padStart(2, '0');

        var currentMin = (Math.floor(current / 60)).toString().padStart(2, '0');
        var currentSec = (current % 60).toString().padStart(2, '0');

        this.timeLabel.innerHTML = currentMin + ':' + currentSec + '/' + recordMin + ':' + recordSec;
    }

    onPlayButtonClicked(e){
        this.graphRef.togglePlay();
    }

    onKeyDown(e){
        if (e.keyCode === 32)
            this.graphRef.togglePlay();
        else if (e.keyCode === 37)
            this.graphRef.prev();
        else if (e.keyCode === 39)
            this.graphRef.next();
    }

    onWheel(e){
          this.graphRef.addverticalscroll(e.deltaY);
    }

    onResize(){
        var rt = this.graphRef.getCanvas().getBoundingClientRect();
        this.setState({
            canvasWidth: rt.width,
            canvasHeight: rt.height
        });
    }

    setChannelCount (c){
        this.setState({channels: c});
    }

    setTimeScale (v){
        this.setState({timescale: v});
    }

    setSpeed(s){
        this.setState({speed: s * 1.0});
    }

    setChannelSelection(selection){
        this.graphRef.setchannelsenabled(selection);
        this.setState({channels: selection.length});
    }

    render(){
        /*
        var btnStyle={
            height: '50px',
            width: '50px'
        }
        */
        var divStyle={
            height: '100%'
        }

        var labelStyle={
            fontSize: '18px',
            display: 'flex',
            alignSelf: 'start'
        }

        return(
        <div style={divStyle}>
            <GLGraph ref={ref=>{this.graphRef = ref;}}
            width={this.state.canvasWidth} height={this.state.canvasHeight} margin={10}
            channels={this.state.channels} timescale={this.state.timescale} speed={this.state.speed} 
            strokeColor="#FFFFFF"
            onPlayStateChanged={this.onPlayStateChanged}
            onOffsetChanged={this.onOffsetChanged}/>
            <div>
                <label id='timeLabel' style={labelStyle}>00:00/00:00</label>
            </div>
        </div>);

        /*
        <button onClick={this.onPlayButtonClicked} style={btnStyle}>
                    {this.state.isPlaying ? "stop" : "play"}
                </button>
         */
    }
}

/*
class FileList extends React.Component{
    constructor(props){
        super(props);
        this.onFileSelected = this.onFileSelected.bind(this);
        this.onProgressChanged = this.onProgressChanged.bind(this);

        //Request file list to back-end
        //fetch("/files");

        this.state = {
            fileList: ["intan_save_210107_151441.rhs"],
            selectedFile: ""
        };
    }

    componentDidMount() {
        this.timeLabel = document.getElementById('timeLabel');
    }

    onFileSelected (){
        var selected = document.getElementById("fileList").value;

        if (selected === this.state.selectedFile)
            return;

        this.setState({selectedFile: selected});
        if (this.props.onFileLoadStart !== undefined)
            this.props.onFileLoadStart();
        
        //Load File
        var rhs = new RHSFile();
        rhs.load(selected, this.props.onFileLoaded, this.onProgressChanged);
    }

    onProgressChanged (file, prog){
        this.timeLabel.innerHTML = file.path + ' (' + Math.floor(prog) + ')%'
    }

    render(){
        var options = [];
        for (var i = 0; i < this.state.fileList.length; i++){
             options.push(
                 <option key={i} value={this.state.fileList[i]}>{this.state.fileList[i]}</option>
             )
        }

        return (
        <select id="fileList" className="files"  onDoubleClick={this.onFileSelected} multiple>
            {options}
        </select>);
    }
}
*/

class ChannelList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            channelNameList: []
        }

        this.channelNameList_onchange = this.channelNameList_onchange.bind(this);
    }

    setChannelList(arr){
        var nameArr = [];
        var i = 0;
        for (i = 0; i < arr.length; i++){
            nameArr.push(arr[i].customName);
        }

        this.setState({
            channelNameList: nameArr
        });

        //Deselect All
        var elements = document.getElementById("channelNameList").options;

        for (i = 0; i < elements.length; i++){
            elements[i].selected = false;
        }
    }

    channelNameList_onchange(){
        var select = document.getElementById("channelNameList");
        var selectedIdx = [];
        var len = select.options.length;

        for (var i = 0; i < len; i++){
            if (select.options[i].selected){
                selectedIdx.push(i);
            }
        }

        this.props.onSelectionChanged(selectedIdx);
    }

    render(){
        var options = [];
        for (var i = 0; i < this.state.channelNameList.length; i++){
            options.push(
                <option key={i} value={this.state.channelNameList[i]}>
                    {this.state.channelNameList[i]}
                </option>);
        }

        return (
        <select id="channelNameList" className="files" onChange={this.channelNameList_onchange} multiple>
            {options}
        </select>);
    }
}

class PlayerController extends React.Component{

    constructor(props){
        super(props);
        
        this.play_onclick = this.play_onclick.bind(this);
        this.stop_onclick = this.stop_onclick.bind(this);
        this.replay_onclick = this.replay_onclick.bind(this);

        this.timescale_select_onchange = this.timescale_select_onchange.bind(this);
        this.channel_select_onchange = this.channel_select_onchange.bind(this);
        this.speed_select_onchange = this.speed_select_onchange.bind(this);
    }

    play_onclick(e){
        if (this.props.onPlayButtonClicked !== undefined)
            this.props.onPlayButtonClicked();
    }

    stop_onclick(e){
        if (this.props.onPlayButtonClicked !== undefined)
            this.props.onStopButtonClicked();
    }

    replay_onclick(e){
        if (this.props.onPlayButtonClicked !== undefined)
            this.props.onReplayButtonClicked();
    }

    timescale_select_onchange (){
        if (this.props.onTimeScaleChanged !== undefined)
            this.props.onTimeScaleChanged(document.getElementById("timescale_select").value);
    }

    channel_select_onchange (){
        if (this.props.onChannelChanged !== undefined)
            this.props.onChannelChanged(document.getElementById("channel_select").value);
    }

    speed_select_onchange(){
        if (this.props.onSpeedChanged !== undefined)
            this.props.onSpeedChanged(document.getElementById("speed_select").value);
    }

    render(){
        var st = {
            fontSize: '24px',
        }

        return (
        <div className="player_Controller">
            <span style={st}>아아아ㅏㅏ아아아메뉴우우ㅜ우ㅡ</span>
            <br/>
            <br/>
            <div>
                <button className='btn btn-secondary' onClick={this.play_onclick}>Play</button>
                <button className='btn btn-secondary' onClick={this.stop_onclick}>Stop</button>
                <button className='btn btn-secondary' onClick={this.replay_onclick}>Rewind</button>
            </div>
            <br/>
            <span>timescale</span>
            <select id="timescale_select" defaultValue='1000' onChange={this.timescale_select_onchange}>
                <option value='1'>1ms</option>
                <option value='50'>50ms</option>
                <option value='250'>250ms</option>
                <option value='500'>500ms</option>
                <option value='1000'>1000ms</option>
                <option value='2500'>2500ms</option>
                <option value='5000'>5000ms</option>
            </select>

            <br/>
            <br/>
            <span>재생 속도</span>
            <select id="speed_select" defaultValue='1.0' onChange={this.speed_select_onchange}>
                <option value='0.1'>x0.1</option>
                <option value='0.25'>x0.25</option>
                <option value='0.5'>x0.5</option>
                <option value='1.0'>x1.0</option>
                <option value='1.25'>x1.25</option>
                <option value='1.5'>x1.5</option>
                <option value='2.0'>x2.0</option>
            </select>

            <br/><br/><br/>
            <span>대충 메모 들어갈자리</span>
            <br/><br/>
            <span>대충 메모 들어갈자리2</span>
            <br/><br/>
            <span>대충 메모 들어갈자리3</span>
        </div>);

        /*
        <span>채널</span>
        <select id="channel_select" defaultValue='32' onChange={this.channel_select_onchange}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='4'>4</option>
            <option value='8'>8</option>
            <option value='16'>16</option>
            <option value='32'>32</option>
        </select>
        */
    }
}

class Viewer extends React.Component {
    constructor(props){
        super(props);
        this.playerRef = React.createRef();
        this.channelListRef = React.createRef();
        this.state={isLoading: false};

        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
        this.onStopButtonClicked = this.onStopButtonClicked.bind(this);
        this.onReplayButtonClicked = this.onReplayButtonClicked.bind(this);

        this.onTimeScaleChanged = this.onTimeScaleChanged.bind(this);
        this.onChannelChanged = this.onChannelChanged.bind(this);
        this.onSpeedChanged = this.onSpeedChanged.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);

        this.onFileLoadStart = this.onFileLoadStart.bind(this);
        this.onLoadingProgressChanged = this.onLoadingProgressChanged.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);
    }

    componentDidMount(){
        if (this.props.match.params.filePath === undefined)
            return;

        //Load File
        var rhs = new RHSFile();
        this.setState({isLoading: true});
        rhs.load(this.props.match.params.filePath, this.onFileLoaded, this.onLoadingProgressChanged);
    }

    onPlayButtonClicked(){
        this.playerRef.graphRef.play();
    }

    onStopButtonClicked(){
        this.playerRef.graphRef.stop();
    }

    onReplayButtonClicked(){
        this.playerRef.graphRef.setoffset(0.0);
    }
    
    onTimeScaleChanged (v){
        this.playerRef.setTimeScale(v);
    }

    onChannelChanged(v){
        this.playerRef.setChannelCount(v);
    }

    onSpeedChanged(v){
        this.playerRef.setSpeed(v);
    }

    onSelectionChanged(arr){
        this.playerRef.setChannelSelection(arr);
    }

    onFileLoadStart(){
        this.playerRef.currentFile = null;
        this.playerRef.graphRef.stop();
        this.setState({isLoading: true});
    }

    onLoadingProgressChanged(file, prog){
        //console.log(prog + '%');

        var loadingTxt = document.getElementById("loadingTxt");

        if (loadingTxt !== undefined){
            loadingTxt.innerHTML = 'LOADING (' + (Math.floor(prog * 10) * 0.1) + '%)';
        }
    }

    onFileLoaded(file){
        if (file.isInitialized){
            this.playerRef.graphRef.stop();
            this.playerRef.applyFile(file);

            this.channelListRef.current.setChannelList(file.getChannelData());
        }
        else{
            alert('Failed to get file ' + file.path);
        }

        this.setState({isLoading: false});
    }

    render(){
        const loadingScreenStyle={
            margin: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#282c3480',
            zIndex: '2',
            position: 'absolute'
        }

        const loadingTxtStyle={
            top: '50%',
            fontSize: '24px',
            transform: 'translateY(-50%)',
            position: 'absolute'
        }

        return (
        <div className="Viewer">
            <div className="Viewer_Menu">
                <PlayerController
                onPlayButtonClicked={this.onPlayButtonClicked}
                onStopButtonClicked={this.onStopButtonClicked}
                onReplayButtonClicked={this.onReplayButtonClicked}
                onTimeScaleChanged={this.onTimeScaleChanged}
                onChannelChanged={this.onChannelChanged}
                onSpeedChanged={this.onSpeedChanged}/>
                <ChannelList 
                ref={this.channelListRef}
                onFileLoadStart={this.onFileLoadStart} 
                onFileLoaded={this.onFileLoaded}
                onSelectionChanged={this.onSelectionChanged}/>
            </div>
            <div className="Viewer_Graph">
                <img src={logo} draggable='false' className="logo" alt="logo" 
                width='50px' height='50px'/>
                <WaveGraphPlayer ref={ref=>{this.playerRef = ref;}} />
            </div> 
            {this.state.isLoading ? 
            (<div style={loadingScreenStyle}>
                <span id='loadingTxt' style={loadingTxtStyle}>LOADING</span>
            </div>) : 
            (<div/>)}
        </div>);
    }
}

export default Viewer;