import React from 'react';
import ScrollBar from './ScrollBar';

class CanvasGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
        this.scrollBarRef = null;
        this.isPlaying = false;

        //Bind Functions
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.setoffset = this.setoffset.bind(this);
        this.setpeaks = this.setpeaks.bind(this);

        var channelCount = props.channels;
        this.peakArray = [];
        this.peakOffset = [];

        //Create Test Samples
        var c;
        var i;
        for (c = 0; c < channelCount; c++){
            this.peakArray.push([]);
            this.peakOffset.push(0);

            for (i = 0; i < 100000; i++){
                this.peakArray[c].push(0);
            }
        }
    }

    componentDidMount() {
        this.canvasContext = this.canvasRef.current.getContext('2d', {alpha: false});
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.lineWidth = 1;
        this.canvasContext.shadowBlur = 0;
        this.play();
    }

    componentWillUnmount() {
        this.stop();
    }

    //Play
    play (){
        //Rewind
        if (this.peakOffset[0] === this.peakArray[0].length - this.props.count - 1){
            for(var i = 0; i < this.props.channels; i++){
                this.peakOffset[i] = 0; 
            }
        }
        
        this.timer = setInterval(()=>{this.update(); this.draw();}, 5);
        this.isPlaying = true;

        if (this.props.onPlayStateChanged !== undefined)
            this.props.onPlayStateChanged();
    }

    stop(){
        if (this.timer == null)
            return;

        clearInterval(this.timer);
        this.timer = null;
        this.isPlaying = false;

        if (this.props.onPlayStateChanged !== undefined)
            this.props.onPlayStateChanged();
    }

    togglePlay (){
        if (this.isPlaying)
            this.stop();
        else
            this.play();
    }
    
    //Controls
    setpeaks(arr){
        this.peakArray = arr;
        for (var i = 0; i < arr.length; i++){
            if (this.peakOffset.length - 1 < i)
                this.peakOffset.push(0);
            else
                this.peakOffset[i] = 0;
        }

        this.scrollBarRef.setHandlePosition(0);
        this.draw();

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(0);
    }

    setoffset(pos){
        for (var i = 0; i < this.peakArray.length; i++){
            this.peakOffset[i] = Math.floor((this.peakArray[i].length - this.props.count - 1) * pos);
        }

        this.draw();

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    //Play Loop
    update (){
        for (var i = 0; i < this.peakArray.length; i++){
            this.peakOffset[i] += this.props.speed;
        }

        if (this.peakOffset[0] > this.peakArray[0].length - this.props.count - 1){
            for (i = 0; i < this.peakArray.length; i++){
                this.peakOffset[i] = this.peakArray[i].length - this.props.count - 1;
            }
            this.stop();
        }

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(this.peakOffset[0] / (this.peakArray[0].length - this.props.count - 1));

        if (this.scrollBarRef != null)
            this.scrollBarRef.setHandlePosition(this.peakOffset[0] / (this.peakArray[0].length - this.props.count - 1));
    }

    draw (){
        if (this.peakArray[0].length < 2)
            return;
        
        var channelCount = this.props.channels > this.peakArray.length ? this.peakArray.length : this.props.channels;

        var len = this.props.count < this.peakArray[0].length ? this.props.count : this.peakArray[0].length;
        var width = this.canvasRef.current.offsetWidth;
        var height = this.canvasRef.current.offsetHeight;
        var halfHeight = height / 2 / channelCount;
        var widthStep = width / this.props.count;

        var startX = width - (len * widthStep) + 0.5;
        
        this.canvasContext.strokeStyle = this.props.strokeColor;
        this.canvasContext.fillRect(0, 0, width, height);
        //this.canvasContext.clearRect(0, 0, width, height);

        var currentIdx = 0;
        this.canvasContext.beginPath();
        for (var c = 0; c < channelCount; c++){
            this.canvasContext.moveTo(startX, (this.peakArray[c][0] * halfHeight) + (halfHeight * (c * 2 + 1)));

            for(var i = 1; i < len; i++){
                currentIdx = (i + this.peakOffset[c]) % this.peakArray[c].length;
                this.canvasContext.lineTo(startX + (widthStep * i), (this.peakArray[c][currentIdx] * halfHeight) + (halfHeight * (c * 2 + 1)));
            }
        }
        this.canvasContext.stroke();
    }

    getCanvas(){
        return this.canvasRef.current;
    }

    render(){
        var style={
            display: 'flex',
            flexDirection: 'column'
        };

        if (this.canvasRef.current != null)
            this.draw();

        return (
        <div style={style}>
            <canvas ref={this.canvasRef} 
            width={this.props.width} height={this.props.channels * this.props.height}/>
            <ScrollBar ref={ref=>{this.scrollBarRef = ref;}}
            width={this.props.width} height='20'
            handleWidth={this.props.count / this.peakArray[0].length}
            onDragStart={this.stop}
            onDrag={this.setoffset}/>
        </div>);
    }
}

export default CanvasGraph;