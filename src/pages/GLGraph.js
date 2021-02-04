import React from 'react';
import ScrollBar from './ScrollBar';

class GLGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.gridCanvasRef = React.createRef();
        this.gridContext = null;
        this.scrollBarRef = null;
        this.count = 1000;
        this.compressionRate = 5;
        this.deltaTime = 0;
        this.prevTime = 0;
        this.textWidth = 100;
        this.timelineHeight = 50;

        //Controls
        this.isPlaying = false;
        this.isDragging = false;
        this.prevMouseYPos = 0;
        this.verticalScrollPos = 0;

        //WebGL
        this.bufferCanvas = null;
        this.glContext = null;
        this.viewContext = null;
        this.vertexBuffer = null;
        this.shaderProgram = null;
        this.vertexShader = null;
        this.fragShader = null;
        this.coordAttr = null;
        this.resolutionUniform = null;

        //Graph data
        this.notchFreq = 0;
        this.highpassCutoff = 0;
        this.originPeakArray = [];
        this.compressedPeakArray = [];
        this.currentCompressionRate = 1;
        this.currentPeakArray = [];
        this.peakLength = 0;
        this.channelEnabled = [];
        this.channelNames = [];
        this.peakOffset = props.count / -2;
        this.peakPosition = 0;

        //Create Empty Samples
        var channelCount = props.channels;
        var c;
        var i;
        for (c = 0; c < channelCount; c++){
            this.originPeakArray.push([]);
            this.channelEnabled.push(true);
            this.channelNames.push(c.toString().padStart(4, '0'));

            for (i = 0; i < 100000; i++){
                this.originPeakArray[c].push(0);
            }
        }
        this.currentPeakArray = this.originPeakArray;
        this.peakLength = 100000;
        
        //Bind Functions
        this.loop = this.loop.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.setoffset = this.setoffset.bind(this);
        this.updatecount = this.updatecount.bind(this);
        this.resizebuffer = this.resizebuffer.bind(this);
        this.changeFilter = this.changeFilter.bind(this);

        this.onwheel = this.onwheel.bind(this);
        this.ondragstart = this.ondragstart.bind(this);
        this.ondrag = this.ondrag.bind(this);
        this.ondragover = this.ondragover.bind(this);
    }

    componentDidMount() {
        //Add Event
        var c = document.getElementById("gridCanvas");
        c.addEventListener("touchstart", this.touchHandler, true);
        c.addEventListener("touchmove", this.touchHandler, true);
        c.addEventListener("touchend", this.touchHandler, true);
        c.addEventListener("touchcancel", this.touchHandler, true);

        c.addEventListener("wheel", this.onwheel);
        c.addEventListener("mousedown", this.ondragstart);
        c.addEventListener("mousemove", this.ondrag);
        c.addEventListener("mouseup", this.ondragover);

        //Initialize Renderer
        //Grid
        this.gridContext = this.gridCanvasRef.current.getContext('2d');
        this.gridContext.fillStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.shadowBlur = 0;
        this.gridContext.font = (16) + 'px malgun gothic';
        //WebGL
        this.viewContext = this.canvasRef.current.getContext('2d', {alpha: false});
        this.bufferCanvas = document.createElement('canvas');
        try{
            this.glContext = this.bufferCanvas.getContext("webgl", {preserveDrawingBuffer: true}) || this.bufferCanvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
        }
        catch (e){}

        if (this.glContext){
            this.initWebGL(this.glContext);
        }
        else{
            alert("Unable to initialize WebGL. Your browser may not support it.");
            this.glContext = null;
        }

        this.draw(true);
    }

    componentWillUnmount() {
        var c = document.getElementById("gridCanvas");
        c.removeEventListener("touchstart", this.touchHandler, true);
        c.removeEventListener("touchmove", this.touchHandler, true);
        c.removeEventListener("touchend", this.touchHandler, true);
        c.removeEventListener("touchcancel", this.touchHandler, true);

        c.removeEventListener("wheel", this.onwheel);
        c.removeEventListener("mousedown", this.ondragstart);
        c.removeEventListener("mousemove", this.ondrag);
        c.removeEventListener("mouseup", this.ondragover);
        
        this.stop();
    }

    componentDidUpdate(prevProps) {
        //Use Compressed Array
        if (this.props.timescale !== prevProps.timescale){
            if (this.props.timescale > 4000){
                this.currentPeakArray = this.compressedPeakArray;
                this.currentCompressionRate = this.compressionRate;
            }
            else{
                this.currentPeakArray = this.originPeakArray;
                this.currentCompressionRate = 1;
            }

            this.updatecount();
            this.peakLength = this.currentPeakArray[0].length;
        }

        this.draw(true);
    }

    initWebGL (gl){
        //#####Set Buffer Size#####
        this.resizebuffer();
        
        //#####Vertex Buffer#####
        this.vertexBuffer = gl.createBuffer();

        //#####Shader#####
        var vsCode =
            'attribute vec2 coordinates;' +
            'uniform vec2 u_resolution;' +
            'void main(void) {' +
                'vec2 zeroToOne = coordinates / u_resolution;' +
                'vec2 zeroToTwo = zeroToOne * 2.0;' +
                'vec2 clipSpace = zeroToTwo - 1.0;' +
                'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' + 
            '}';
        
        var fsCode =
            'void main(void) {' +
               'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
            '}';

        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        
        gl.shaderSource(this.vertexShader, vsCode);
        gl.compileShader(this.vertexShader);
        gl.shaderSource(this.fragShader, fsCode);
        gl.compileShader(this.fragShader);

        var compiled = gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS);
        console.log('Shader compiled successfully: ' + compiled);
        var compilationLog = gl.getShaderInfoLog(this.vertexShader);
        console.log('Shader compiler log: ' + compilationLog);
        
        //Create shader program
        this.shaderProgram = gl.createProgram();
        
        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragShader);

        gl.linkProgram(this.shaderProgram);

        if ( !gl.getProgramParameter( this.shaderProgram, gl.LINK_STATUS) ) {
            var info = gl.getProgramInfoLog(this.shaderProgram);
            alert('Could not compile WebGL program. \n\n' + info);
        }

        this.coordAttr = gl.getAttribLocation(this.shaderProgram, 'coordinates');
        this.resolutionUniform = gl.getUniformLocation(this.shaderProgram, "u_resolution");
        this.glContext.useProgram(this.shaderProgram);

        console.log('WebGL Initialized Successfully');
    }

    //Play
    play (){
        if (this.isPlaying)
            return;

        //Rewind
        if (this.peakPosition === this.peakLength){
            this.peakPosition = 0;
            this.clearBuffer();
        }
        
        this.prevTime = new Date().getTime();
        this.isPlaying = true;
        this.drawGrid();
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
        
        this.originPeakArray = file.getNormalizedAmpData();
        this.currentPeakArray = this.originPeakArray;
        this.peakLength = this.currentFile.timestamps.length;

        //Compress Peaks
        this.compressedPeakArray = this.compressPeak(this.originPeakArray, this.compressionRate);

        //Update Properties
        this.updatecount();
        this.peakPosition = 0;

        this.channelEnabled = [];
        for (var i = 0; i < this.originPeakArray.length; i++){
            this.channelEnabled.push(true);
        }

        var channelData = file.getChannelData();
        this.channelNames = [];
        for (i = 0; i < channelData.length; i++){
            this.channelNames.push(channelData[i].customName);
        }

        this.scrollBarRef.setHandlePosition(0);
        this.resizebuffer();
        this.draw(true);

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
        this.clearBuffer();
        this.draw(true);
    }

    setoffset(pos){
        this.peakPosition = Math.floor(this.peakLength * pos);
        this.clearBuffer();

        if (!this.isPlaying)
            this.draw();

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    updatecount(){
        if (this.currentFile === undefined)
            this.count = 1000;
        else
            this.count = this.currentFile.sampleRate / 1000 * (this.props.timescale / this.currentCompressionRate);
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
            
        this.drawGrid();
    }

    resizebuffer(){
        var channelCount =  Math.min(this.props.channels, this.currentPeakArray.length);
        var currentHeight = Math.max(50, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount);
        this.glContext.canvas.width = this.props.width;
        this.glContext.canvas.height = (currentHeight * channelCount) + (this.props.margin * channelCount) + this.timelineHeight;
        this.glContext.width = this.glContext.canvas.width;
        this.glContext.height = this.glContext.canvas.height;
    }

    next(){
        if (this.isPlaying)
            this.peakPosition += Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * this.props.speed);
        else
            this.peakPosition += this.count;
        this.peakPosition = Math.min(this.peakPosition, this.peakLength);
        this.peakPosition = Math.max(this.peakPosition, 0);

        if (!this.isPlaying)
            this.draw();

        var pos = this.peakPosition / this.peakLength;
        this.scrollBarRef.setHandlePosition(pos);

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    prev(){
        if (this.isPlaying)
            this.peakPosition -= Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * this.props.speed);
        else
            this.peakPosition -= this.count;
        this.peakPosition = Math.min(this.peakPosition, this.peakLength);
        this.peakPosition = Math.max(this.peakPosition, 0);

        if (!this.isPlaying)
            this.draw();

        var pos = this.peakPosition / this.peakLength;
        this.scrollBarRef.setHandlePosition(pos);

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(pos);
    }

    clearBuffer(){
        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    }

    changeFilter(notchFreq, highpassCutoff){
        if (this.notchFreq === notchFreq && this.highpassCutoff === highpassCutoff)
            return;
        
        this.stop();

        this.originPeakArray = this.currentFile.getFilteredAmpData(notchFreq, 10, highpassCutoff, this.currentFile.sampleRate);
        
        //this.compressedPeakArray = this.originPeakArray.slice();
        //Compress Peaks
        this.compressedPeakArray = this.compressPeak(this.originPeakArray, this.compressionRate);

        //Set Compressed Array
        if (this.props.timescale > 4000){
            this.currentPeakArray = this.compressedPeakArray;
            this.currentCompressionRate = this.compressionRate;
        }
        else{
            this.currentPeakArray = this.originPeakArray;
            this.currentCompressionRate = 1;
        }

        this.notchFreq = notchFreq;
        this.highpassCutoff = highpassCutoff;
        this.peakLength = this.currentPeakArray[0].length;
        this.clearBuffer();
        this.setoffset(0);
        this.updatecount();
        this.scrollBarRef.setHandlePosition(0);
        this.play();
    }

    //Input Events
    onwheel(e){
        this.addverticalscroll(e.deltaY);
    }

    ondragstart(e){
        this.isDragging = true;
        this.prevMouseYPos = e.clientY;
    }

    ondrag(e){
        if (!this.isDragging)
            return;

        this.addverticalscroll(this.prevMouseYPos - e.clientY);
        this.prevMouseYPos = e.clientY;
    }

    ondragover(e){
        this.isDragging = false;
    }

    //Touch event to mouse event
    touchHandler(event)
    {
        var touches = event.changedTouches;
        var first = touches[0];
        var type = "";
        
        switch(event.type)
        {
            case "touchstart": 
                type = "mousedown"; 
                break;
            case "touchmove": 
                type="mousemove"; 
                break;       
            case "touchend":   
                type="mouseup"; 
                break;
            default:
                return;
        }
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY,
                                first.clientX, first.clientY, false,
                                false, false, false, 0/*left*/, null);
    
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
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
        this.peakPosition += Math.round((this.currentFile === undefined ? 100 : this.currentFile.sampleRate) * (this.deltaTime * 0.001) * this.props.speed / this.currentCompressionRate);

        if (this.peakPosition > this.peakLength){
            this.peakPosition = this.peakLength;
            this.stop();
        }

        if (this.props.onOffsetChanged !== undefined)
            this.props.onOffsetChanged(this.peakPosition / this.peakLength);

        if (this.scrollBarRef != null)
            this.scrollBarRef.setHandlePosition(this.peakPosition / this.peakLength);
    }

    draw (isUpdateGrid){
        if (this.peakLength < 2)
            return;
        
        this.updatecount();
            
        var channelCount = this.props.channels > this.currentPeakArray.length ? this.currentPeakArray.length : this.props.channels;

        var len = this.peakPosition % this.count;
        var width = this.props.width - this.textWidth;
        var widthStep = width / this.count;
        var currentHeight = Math.max(50, (this.glContext.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount); //Math.max(50, Math.min(150, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount));
        var halfHeight = currentHeight / 2;

        var startY = 0;
        var topMargin = Math.max(this.glContext.height - this.timelineHeight - ((currentHeight + this.props.margin) * channelCount), 0) / 2;
        var clearWidth = Math.floor(this.count  * this.deltaTime * Math.min(10 / this.props.timescale, 0.01));

        //Clear Rect
        this.glContext.enable(this.glContext.SCISSOR_TEST);
        this.glContext.scissor(this.textWidth + (widthStep * len) - (widthStep * clearWidth),
                            0,
                            widthStep * clearWidth,
                            this.glContext.height);

        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        this.glContext.disable(this.glContext.SCISSOR_TEST);

        //Clear Entire Canvas
        /*
        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        */

        this.glContext.viewport(0, 0, this.glContext.width, this.glContext.height);

        //Draw Graphs
        var currentIdx = 0;
        var x = 0;
        var y = 0;
        
        var vertices = [];
        var c = 0;
        var i = 0;
        var drawnChannels = 0;
        
        for (c = 0; c < this.currentPeakArray.length; c++){
            if (!this.channelEnabled[c])
                continue;
            
            startY= halfHeight * (drawnChannels * 2 + 1) + 
                    (this.props.margin * drawnChannels) + 
                    topMargin + 
                    this.timelineHeight;

            //Draw graph
            for(i = 0; i < clearWidth; i++){
                currentIdx = Math.floor((this.peakPosition - clearWidth) + i);
                if (currentIdx > this.currentPeakArray[c].length || (len - clearWidth + i < 0))
                    continue;

                x = Math.floor(widthStep * (len - clearWidth + i) + this.textWidth);
                y = Math.floor((this.currentPeakArray[c][currentIdx] * halfHeight) + startY);
                vertices.push(x);
                vertices.push(y);
            }

            vertices.push(this.props.width);
            vertices.push(NaN);

            drawnChannels++;
        }

        //Set shader attributes
        this.glContext.enableVertexAttribArray(this.coordAttr);
        this.glContext.vertexAttribPointer(this.coordAttr, 2, this.glContext.FLOAT, false, 0, 0);
        this.glContext.uniform2f(this.resolutionUniform, this.glContext.width, this.glContext.height);
        
        // Pass the vertex data to the buffer
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(vertices), this.glContext.STATIC_DRAW);
        this.glContext.drawArrays(this.glContext.LINE_STRIP, 0, Math.floor(vertices.length / 2));
    
        //Copy back buffer to front buffer
        this.viewContext.fillStyle = 'black';
        this.viewContext.fillRect(0, 0, this.props.width, this.props.height);
        this.viewContext.drawImage(this.bufferCanvas, 0, -this.verticalScrollPos);

        if (isUpdateGrid)
            this.drawGrid();
    }

    drawGrid(){
        var channelCount = this.props.channels > this.currentPeakArray.length ? this.currentPeakArray.length : this.props.channels;

        var width = this.props.width - this.textWidth;
        var currentHeight = Math.max(50, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount);
        var halfHeight = currentHeight / 2;

        var startY = 0;
        var topMargin = Math.max(this.props.height - this.timelineHeight - ((currentHeight + this.props.margin) * channelCount), 0) / 2;
        
        var c = 0;
        var drawnChannels = 0;

        this.gridContext.fillStyle = 'white';
        this.gridContext.clearRect(0, 0, this.props.width, this.props.height);

        for (c = 0; c < this.currentPeakArray.length; c++){
            if (!this.channelEnabled[c])
                continue;
            
            startY = halfHeight * (drawnChannels * 2 + 1) + (this.props.margin * drawnChannels) + topMargin + this.timelineHeight - this.verticalScrollPos;
            
            if (startY < -1 * currentHeight - this.props.margin){
                drawnChannels++;
                continue;
            }
            else if (startY > this.props.height)
                break;
            
            //Draw canvas channel text
            this.gridContext.fillText(this.channelNames[c], 0, startY);
            //this.gridContext.moveTo(startX, (this.currentPeakArray[c][Math.max(this.peakOffset, 0)] * halfHeight) + startY);

            drawnChannels++;
        }

        //Draw Canvas Grids
        var y = this.timelineHeight;

        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'red';
        this.gridContext.lineWidth = 0.5;
        for (c = 0; c < channelCount; c++){
            y = c * (currentHeight + this.props.margin) + this.timelineHeight + topMargin - this.verticalScrollPos;

            this.gridContext.moveTo(this.textWidth, y);
            this.gridContext.lineTo(this.textWidth + width, y);
            
            y += currentHeight;
            this.gridContext.moveTo(this.textWidth, y);
            this.gridContext.lineTo(this.textWidth + width, y);
        }
        this.gridContext.stroke();
    }

    //etc
    getCanvas(){
        return this.canvasRef.current;
    }

    compressPeak(peaks, compressionRate){
        var c = 0;
        var i = 0;
        var j = 0;
        var len = Math.ceil(peaks[0].length / compressionRate);
        var compressed = [];

        for (c = 0; c < peaks.length; c++){
            compressed.push([]);

            for (i = 0; i < len; i++){
                var value = 0.0;

                for (j = 0; j < compressionRate; j++){
                    var idx = i * compressionRate + j;

                    if (idx === peaks[c].length)
                        break;
                    else if (Math.abs(peaks[c][idx]) > value){
                        value = peaks[c][idx];
                    }
                }
                
                compressed[c].push(value);
            }
        }

        return compressed;
    }

    render(){
        var style={
            display: 'flex',
            flexDirection: 'column',
        };
        var graphStyle={
            display: 'flex',
            zIndex: '1',
            minHeight: Math.floor(this.props.height) + 'px'
        };
        var gridStyle={
            display: 'flex',
            position: 'absolute',
            zIndex: '2'
        };
        var scrollStyle={
            display: 'flex',
            position: 'relative',
            zIndex: '3'
        };

        if (this.glContext !== null)
            this.resizebuffer();

        return (
        <div style={style}>
            <div style={style}>
                <canvas ref={this.canvasRef} style={graphStyle} id='graphCanvas'
                width={this.props.width} height={Math.floor(this.props.height)/*this.props.channels * (this.props.height + this.props.margin) + this.timelineHeight*/}/>
                <canvas ref={this.gridCanvasRef} style={gridStyle} id='gridCanvas'
                width={this.props.width} height={Math.floor(this.props.height)}/>
            </div>
            <ScrollBar ref={ref=>{this.scrollBarRef = ref;}} style={scrollStyle}
            width={this.props.width} height='20'
            handleWidth={this.count / (this.peakLength + this.count / 2)}
            
            onDrag={this.setoffset}/>
        </div>);
    }
}

export default GLGraph;