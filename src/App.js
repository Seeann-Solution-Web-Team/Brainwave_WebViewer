import React from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasGraph from './CanvasGraph';

class WaveGraphViewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {isPlaying: false};
        this.graphRef = null;

        this.onPlayStateChanged = this.onPlayStateChanged.bind(this);
        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
    }

    componentDidMount(){
        this.setState({isPlaying: this.graphRef.isPlaying});
        //fetch('http://localhost:3000/api');
    }

    onPlayStateChanged(){
        if (this.graphRef === null)
            return;

        this.setState({isPlaying: this.graphRef.isPlaying});
    }

    onPlayButtonClicked(e){
        this.graphRef.togglePlay();
    }

    render(){
        var btnStyle={
            height: '50px',
            width: '50px'
        }
        return(
        <div>
            <CanvasGraph ref={ref=>{this.graphRef = ref;}}
            width='600' strokeColor="#FFFFFF"
            channels='64' invertal='10' count='1000'
            onPlayStateChanged={this.onPlayStateChanged}/>
            <button onClick={this.onPlayButtonClicked} style={btnStyle}>
                {this.state.isPlaying ? "stop" : "play"}
            </button>
        </div>);
    }
}

function App() {
    return ( 
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <WaveGraphViewer  />
            </header> 
        </div>
    );
}

export default App;