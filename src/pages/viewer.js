import React from 'react';
import logo from '.././logo.svg';
import './viewer.css';
import CanvasGraph from './CanvasGraph';
import RHSFile from './RHSFile'

class WaveGraphPlayer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            channels: 32,
            count: 1000,
            speed: 20,
            canvasWidth: 1600,
            isPlaying: false
        };

        this.graphRef = React.createRef();
        this.currentFile = null;

        this.onPlayStateChanged = this.onPlayStateChanged.bind(this);
        this.onOffsetChanged = this.onOffsetChanged.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
        this.onResize = this.onResize.bind(this);

        this.apply = this.apply.bind(this);
    }

    componentDidMount(){
        this.setState({isPlaying: this.graphRef.isPlaying});
        this.onResize();
        //fetch('http://localhost:3000/api');
        window.addEventListener("resize", this.onResize);
        window.addEventListener("keydown", this.onKeyDown);

        this.timeLabel = document.getElementById('timeLabel');
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("keydown", this.onKeyDown);
    }

    apply (file){
        //apply to CanvasGraph
        var ampData = file.getNormalizedAmpData();
        this.setState({channels: ampData.length});
        this.currentFile = file;
        this.graphRef.setpeaks(ampData);
    }

    onPlayStateChanged(){
        if (this.graphRef === null)
            return;

        this.setState({isPlaying: this.graphRef.isPlaying});
    }

    onOffsetChanged(p){
        if (this.currentFile === null)
            return;
        
        var current = Math.round(p * this.currentFile.recordLength);
        var recordMin = (Math.round(this.currentFile.recordLength / 60)).toString().padStart(2, '0');
        var recordSec = (this.currentFile.recordLength % 60).toString().padStart(2, '0');

        var currentMin = (Math.round(current / 60)).toString().padStart(2, '0');
        var currentSec = (current % 60).toString().padStart(2, '0');

        this.timeLabel.innerHTML = currentMin + ':' + currentSec + '/' + recordMin + ':' + recordSec;
    }

    onPlayButtonClicked(e){
        this.graphRef.togglePlay();
    }

    onKeyDown(e){
        if (e.keyCode === 32)
            this.graphRef.togglePlay();
    }

    onResize(){
        this.setState({
            canvasWidth: this.graphRef.getCanvas().getBoundingClientRect().width
        });
    }

    setChannelCount (c){
        this.setState({channels: c});
    }

    setPeakCount (c){
        this.setState({count: c});
    }

    setSpeed(s){
        this.setState({speed: s * 1});
    }

    render(){
        var btnStyle={
            height: '50px',
            width: '50px'
        }
        var labelStyle={
            fontSize: '18px',
            display: 'flex',
            alignSelf: 'start'
        }

        return(
        <div>
            <CanvasGraph ref={ref=>{this.graphRef = ref;}}
            height='25' width={this.state.canvasWidth}
            channels={this.state.channels} count={this.state.count} speed={this.state.speed} 
            strokeColor="#FFFFFF"
            onPlayStateChanged={this.onPlayStateChanged}
            onOffsetChanged={this.onOffsetChanged}/>
            <div>
                <label id='timeLabel' style={labelStyle}>00:00/00:00</label>
                <button onClick={this.onPlayButtonClicked} style={btnStyle}>
                    {this.state.isPlaying ? "stop" : "play"}
                </button>
            </div>
        </div>);
    }
}

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

class PlayerController extends React.Component{

    constructor(props){
        super(props);
        
        this.count_select_onchange = this.count_select_onchange.bind(this);
        this.channel_select_onchange = this.channel_select_onchange.bind(this);
        this.speed_select_onchange = this.speed_select_onchange.bind(this);
    }

    count_select_onchange (){
        if (this.props.onCountChanged !== undefined)
            this.props.onCountChanged(document.getElementById("count_select").value);
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
            <span>확대</span>
            <select id="count_select" defaultValue='1000' onChange={this.count_select_onchange}>
                <option value='500'>500</option>
                <option value='1000'>1000</option>
                <option value='2000'>2000</option>
                <option value='3000'>3000</option>
                <option value='4000'>4000</option>
                <option value='5000'>5000</option>
            </select>

            <br/>
            <span>채널</span>
            <select id="channel_select" defaultValue='32' onChange={this.channel_select_onchange}>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='4'>4</option>
                <option value='8'>8</option>
                <option value='16'>16</option>
                <option value='32'>32</option>
            </select>

            <br/>
            <span>재생 속도</span>
            <select id="speed_select" defaultValue='20' onChange={this.speed_select_onchange}>
                <option value='1'>1</option>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
                <option value='40'>40</option>
                <option value='50'>50</option>
            </select>

            <br/><br/><br/>
            <span>대충 메모 들어갈자리</span>
            <br/><br/>
            <span>대충 메모 들어갈자리2</span>
            <br/><br/>
            <span>대충 메모 들어갈자리3</span>
        </div>);
    }
}

class Viewer extends React.Component {
    constructor(props){
        super(props);
        this.playerRef = React.createRef();

        this.onCountChanged = this.onCountChanged.bind(this);
        this.onChannelChanged = this.onChannelChanged.bind(this);
        this.onSpeedChanged = this.onSpeedChanged.bind(this);

        this.onFileLoadStart = this.onFileLoadStart.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);
    }
    
    onCountChanged (v){
        this.playerRef.setPeakCount(v);
    }

    onChannelChanged(v){
        this.playerRef.setChannelCount(v);
    }

    onSpeedChanged(v){
        this.playerRef.setSpeed(v);
    }

    onFileLoadStart(){
        this.playerRef.currentFile = null;
        this.playerRef.graphRef.stop();
    }

    onFileLoaded(file){
        this.playerRef.graphRef.stop();
        this.playerRef.apply(file);
    }

    render(){
        return (
        <div className="Viewer">
            <div className="Viewer_Menu">
                <PlayerController
                onCountChanged={this.onCountChanged}
                onChannelChanged={this.onChannelChanged}
                onSpeedChanged={this.onSpeedChanged}/>
                <FileList 
                onFileLoadStart={this.onFileLoadStart} 
                onFileLoaded={this.onFileLoaded}/>
            </div>
            <div className="Viewer_Graph">
                <img src={logo} className="logo" alt="logo" 
                width='100px' height='100px'/>
                <WaveGraphPlayer ref={ref=>{this.playerRef = ref;}} />
            </div> 
        </div>);
    }
}

export default Viewer;