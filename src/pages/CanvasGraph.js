import React from 'react';
import ScrollBar from './ScrollBar';

class CanvasGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
        this.scrollBarRef = null;
        this.isPlaying = false;
        this.count = 1000;
        this.deltaTime = 0;
        this.prevTime = 0;
        this.textWidth = 100;
        this.timelineHeight = 50;
        this.verticalScrollPos = 0;

        //Bind Functions
        this.loop = this.loop.bind(this);

        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.setoffset = this.setoffset.bind(this);
        this.updatecount = this.updatecount.bind(this);

        var channelCount = props.channels;
        this.peakArray = [];
        this.channelEnabled = [];
        this.channelNames = [];
        this.peakOffset = props.count / -2;
        this.peakMaxOffset = 0;
        this.peakMinOffset = props.count / -2;

        //Create Test Samples
        var c;
        var i;
        for (c = 0; c < channelCount; c++){
            this.peakArray.push([]);
            this.channelEnabled.push(true);
            this.channelNames.push(c.toString().padStart(4, '0'));

            for (i = 0; i < 100000; i++){
                this.peakArray[c].push(0);
            }
        }

        this.peakMaxOffset = this.peakArray[0].length - this.count / 2;
    }

    componentDidMount() {
        this.canvasContext = this.canvasRef.current.getContext('2d', {alpha: false});
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.lineWidth = 1;
        this.canvasContext.shadowBlur = 0;

        this.canvasContext.font = (16) + 'px malgun gothic';
    }

    componentDidUpdate() {
        this.draw();
    }

    componentWillUnmount() {
        this.stop();
    }

    //Play
    play (){
        if (this.isPlaying)
            return;

        //Rewind
        if (this.peakOffset === this.peakMaxOffset){
            this.peakOffset = this.peakMinOffset;
        }
        
        this.prevTime = new Date().getTime();
        this.isPlaying = true;
        requestAnimationFrame(this.loop);

        if (this.props.onPlayStateChanged !== undefined)
            this.props.onPlayStateChanged();
    }
    
    stop(){
        if (!this.isPlaying)
            return;

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
    setfile(file){
        this.currentFile = file;

        //file.getFilteredAmpData(60, 10, file.sampleRate);
        
        if (file.notchFilterMode === 0){
            this.peakArray = file.getNormalizedAmpData();
        }
        else {
            var notchFreq = file.notchFilterMode === 1 ? 50 : 60;
            this.peakArray = file.getFilteredAmpData(notchFreq, 10, file.sampleRate);
        }

        this.updatecount();
        this.peakMaxOffset = this.peakArray[0].length - this.count / 2;
        this.peakMinOffset = this.count / -2;
        this.peakOffset = this.peakMinOffset;
        
        var i = 0;
        this.channelEnabled = [];
        for (i = 0; i < this.peakArray.length; i++){
            this.channelEnabled.push(true);
        }

        var channelData = file.getChannelData();
        this.channelNames = [];
        for (i = 0; i < channelData.length; i++){
            this.channelNames.push(channelData[i].customName);
        }

        this.scrollBarRef.setHandlePosition(0);
        this.draw();

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(0);
    }

    setchannelsenabled(arr){
        var j = 0;
        for (var i = 0; i < this.channelEnabled.length; i++){
            if (arr[j] === i){
                this.channelEnabled[i] = true;
                if(j < arr.length - 1){
                    j++;
                }
            }
            else{
                this.channelEnabled[i] = false;
            }
        }

        this.verticalScrollPos = 0;
        this.draw();
    }

    setoffset(pos){
        this.peakOffset = Math.floor((this.peakMaxOffset + (this.count / 2)) * pos) - (this.count / 2);
        
        if (!this.isPlaying)
            this.draw();

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    updatecount(){
        if (this.currentFile === undefined)
            this.count = 1000;
        else
            this.count = this.currentFile.sampleRate / 1000 * this.props.timescale;
    }

    addverticalscroll(v){
        var maxPos = 0;

        for (var i = 0; i < this.channelEnabled.length; i++){
            if (this.channelEnabled[i])
                maxPos++;
        }
        
        var currentHeight = Math.max(50, Math.min(150, (this.props.height - this.timelineHeight - (this.props.margin * maxPos)) / maxPos));
        maxPos = Math.max(0, ((currentHeight + this.props.margin) * maxPos) - (this.props.height - this.timelineHeight));

        this.verticalScrollPos = Math.max(0, Math.min(maxPos, this.verticalScrollPos + v));
        
        if (!this.isPlaying)
            this.draw();
    }

    next(){
        if (this.isPlaying)
            this.peakOffset += Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * this.props.speed);
        else
            this.peakOffset += this.count;
        this.peakOffset = Math.min(this.peakOffset, this.peakMaxOffset);
        this.peakOffset = Math.max(this.peakOffset, this.peakMinOffset);

        if (!this.isPlaying)
            this.draw();

        var pos = (this.peakOffset + (this.count / 2)) / (this.peakMaxOffset + (this.count / 2));
        this.scrollBarRef.setHandlePosition(pos);

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    prev(){
        if (this.isPlaying)
            this.peakOffset -= Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * this.props.speed);
        else
            this.peakOffset -= this.count;
        this.peakOffset = Math.min(this.peakOffset, this.peakMaxOffset);
        this.peakOffset = Math.max(this.peakOffset, this.peakMinOffset);

        if (!this.isPlaying)
            this.draw();

        var pos = (this.peakOffset + (this.count / 2)) / (this.peakMaxOffset + (this.count / 2));
        this.scrollBarRef.setHandlePosition(pos);

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    //Play Loop
    loop(){
        if (!this.isPlaying)
            return;
        
        var now = new Date().getTime();
        this.deltaTime = now - this.prevTime;
        this.prevTime = now;
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    }

    update (){
        this.updatecount();
        this.peakOffset += Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * (this.deltaTime * 0.001) * this.props.speed);

        if (this.peakOffset > this.peakMaxOffset){
            this.peakOffset = this.peakMaxOffset;
            this.stop();
        }

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged((this.peakOffset + (this.count / 2)) / this.peakMaxOffset);

        if (this.scrollBarRef != null)
            this.scrollBarRef.setHandlePosition((this.peakOffset + (this.count / 2)) / (this.peakMaxOffset + (this.count / 2)));
    }

    draw (){
        if (this.peakArray[0].length < 2)
            return;
        
        this.updatecount();
            
        var channelCount = this.props.channels > this.peakArray.length ? this.peakArray.length : this.props.channels;

        var len = this.count < this.peakArray[0].length ? this.count : this.peakArray[0].length;
        var width = this.props.width - this.textWidth;
        var widthStep = width / this.count;
        var currentHeight = Math.max(50, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount); //Math.max(50, Math.min(150, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount));
        var halfHeight = currentHeight / 2;

        var startX = widthStep * Math.min(this.peakOffset, 0) * -1 + this.textWidth;
        var startY = 0;
        var topMargin = Math.max(this.props.height - this.timelineHeight - ((currentHeight + this.props.margin) * channelCount), 0) / 2;
        
        this.canvasContext.strokeStyle = this.props.strokeColor;
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fillRect(0, 0, width + this.textWidth, this.props.height);

        //Draw Graphs
        var currentIdx = 0;
        var x = 0;
        var y = 0;
        var i = 0;

        this.canvasContext.fillStyle = 'white';
        this.canvasContext.lineWidth = 1;
        this.canvasContext.beginPath();

        var c = 0;
        var drawnChannels = 0;
        for (c = 0; c < this.peakArray.length; c++){
            if (!this.channelEnabled[c])
                continue;
            
            startY = halfHeight * (drawnChannels * 2 + 1) + (this.props.margin * drawnChannels) + topMargin + this.timelineHeight - this.verticalScrollPos;
            if (startY > this.props.height)
                break;

            //Draw channel text
            this.canvasContext.fillText(this.channelNames[c], 0, startY);
            this.canvasContext.moveTo(startX, (this.peakArray[c][Math.max(this.peakOffset, 0)] * halfHeight) + startY);

            //Draw graph
            for(i = 1; i < len + 1; i++){
                currentIdx = Math.floor(Math.max(i + this.peakOffset, i));
                if (currentIdx > this.peakArray[c].length)
                    continue;

                x = Math.floor((widthStep * i) + startX);
                y = Math.floor((this.peakArray[c][currentIdx] * halfHeight) + startY);
                this.canvasContext.lineTo(x, y);
            }

            drawnChannels++;
        }
        this.canvasContext.stroke();
        
        //Draw Grids
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = 'red';
        this.canvasContext.lineWidth = 0.5;
        this.canvasContext.moveTo(width / 2 + this.textWidth, this.timelineHeight);
        this.canvasContext.lineTo (width / 2 + this.textWidth, this.props.height);
        for (c = 0; c < channelCount; c++){
            this.canvasContext.moveTo(this.textWidth, c * (currentHeight + this.props.margin) + this.timelineHeight + topMargin - this.verticalScrollPos);
            this.canvasContext.lineTo(this.textWidth + width, c * (currentHeight + this.props.margin) + this.timelineHeight + topMargin - this.verticalScrollPos);
            
            this.canvasContext.moveTo(this.textWidth, c * (currentHeight + this.props.margin) + currentHeight + this.timelineHeight + topMargin - this.verticalScrollPos);
            this.canvasContext.lineTo(this.textWidth + width, c * (currentHeight + this.props.margin) + currentHeight + this.timelineHeight + topMargin - this.verticalScrollPos);
        }
        this.canvasContext.stroke();

        //Draw timeline
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fillRect(0, 0, width + this.textWidth, this.timelineHeight);
        this.canvasContext.fillStyle = 'white';

        var currentTime = 0;

        if (this.currentFile){
            for (i = 0; i < len; i++){
                currentIdx = Math.max(i + this.peakOffset, i);
                currentTime = currentIdx / this.currentFile.sampleRate;
                currentTime = Math.floor(currentTime * 100) * 0.01;

                if (currentIdx % Math.floor(this.currentFile.sampleRate / 10) === 0){
                    this.canvasContext.fillText(currentTime.toString(), startX + (i * widthStep), this.timelineHeight * 0.5);
                }
            }
        }
    }

    //etc
    getCanvas(){
        return this.canvasRef.current;
    }

    render(){
        var style={
            display: 'flex',
            flexDirection: 'column',
            height: '95%'
        };
        
        this.updatecount();
        this.peakMaxOffset = this.peakArray[0].length - this.count / 2;
        this.peakMinOffset = this.count / -2;

        return (
        <div style={style}>
            <canvas ref={this.canvasRef} style={style} id='graphCanvas'
            width={this.props.width} height={this.props.height/*this.props.channels * (this.props.height + this.props.margin) + this.timelineHeight*/}/>
            <ScrollBar ref={ref=>{this.scrollBarRef = ref;}}
            width={this.props.width} height='20'
            handleWidth={this.count / (this.peakArray[0].length + this.count / 2)}
            onDragStart={this.stop}
            onDrag={this.setoffset}/>
        </div>);
    }
}

export default CanvasGraph;