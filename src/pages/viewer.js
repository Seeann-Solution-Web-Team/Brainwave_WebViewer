import React from 'react';
import logo from '.././logo.svg';
import './viewer.css';
import CanvasGraph from './CanvasGraph';

class WaveGraphViewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            canvasWidth: 1600,
            isPlaying: false
        };

        this.graphRef = null;

        this.onPlayStateChanged = this.onPlayStateChanged.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount(){
        this.setState({isPlaying: this.graphRef.isPlaying});
        this.onResize();
        //fetch('http://localhost:3000/api');
        window.addEventListener("resize", this.onResize);
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onPlayStateChanged(){
        if (this.graphRef === null)
            return;

        this.setState({isPlaying: this.graphRef.isPlaying});
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

    render(){
        var btnStyle={
            height: '50px',
            width: '50px'
        }
        return(
        <div>
            <CanvasGraph ref={ref=>{this.graphRef = ref;}}
            width={this.state.canvasWidth} height='50'
            channels='16' invertal='10' count='5000'
            strokeColor="#FFFFFF"
            onPlayStateChanged={this.onPlayStateChanged}/>
            <button onClick={this.onPlayButtonClicked} style={btnStyle}>
                {this.state.isPlaying ? "stop" : "play"}
            </button>
        </div>);
    }
}

function Viewer() {
    return ( 
        <div className="Viewer">
            <div className="Viewer_Menu">
                아아아ㅏㅏ아아아메뉴우우ㅜ우ㅡ
            </div>
            <div className="Viewer_Graph">
                <img src={logo} className="logo" alt="logo" width='100px' height='100px'/>
                <WaveGraphViewer />
            </div> 
        </div>
    );
}

export default Viewer;