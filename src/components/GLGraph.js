import React from 'react';
import ScrollBar from './ScrollBar';

class GLGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.gridCanvasRef = React.createRef();
        this.gridContext = null;
        this.scrollBarRef = null;
        this.isPlaying = false;
        this.count = 1000;
        this.deltaTime = 0;
        this.prevTime = 0;
        this.textWidth = 100;
        this.timelineHeight = 50;
        this.verticalScrollPos = 0;

        //WebGL
        this.glContext = null;
        this.vertexBuffer = null;
        this.shaderProgram = null;
        this.vertexShader = null;
        this.fragShader = null;
        this.coordAttr = null;
        this.resolutionUniform = null;

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
        this.gridContext = this.gridCanvasRef.current.getContext('2d');
        this.gridContext.fillStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.shadowBlur = 0;
        this.gridContext.font = (16) + 'px malgun gothic';

        var canvas = this.canvasRef.current;

        try{
            this.glContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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

    componentDidUpdate() {
        this.draw(true);
    }

    componentWillUnmount() {
        this.stop();
    }

    initWebGL (gl){
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
        if (this.peakOffset === this.peakMaxOffset){
            this.peakOffset = this.peakMinOffset;
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
        this.draw(true);
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
            
        this.drawGrid();
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

    draw (isUpdateGrid){
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
        
        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        this.glContext.viewport(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

        //Draw Graphs
        var currentIdx = 0;
        var x = 0;
        var y = 0;
        
        var vertices = [];
        var c = 0;
        var i = 0;
        var drawnChannels = 0;
        
        for (c = 0; c < this.peakArray.length; c++){
            if (!this.channelEnabled[c])
                continue;
            
            startY = halfHeight * (drawnChannels * 2 + 1) + (this.props.margin * drawnChannels) + topMargin + this.timelineHeight - this.verticalScrollPos;
            
            if (startY < -1 * currentHeight - this.props.margin)
            {
                drawnChannels++;
                continue;
            }
            else if (startY > this.props.height)
                break;
                        
            //Push GL Vertex
            vertices.push(startX);
            vertices.push((this.peakArray[c][Math.max(this.peakOffset, 0)] * halfHeight) + startY);

            //Draw graph
            for(i = 1; i < len + 1; i++){
                currentIdx = Math.floor(Math.max(i + this.peakOffset, i));
                if (currentIdx > this.peakArray[c].length)
                    continue;

                x = Math.floor((widthStep * i) + startX);
                y = Math.floor((this.peakArray[c][currentIdx] * halfHeight) + startY);
                vertices.push(x);
                vertices.push(y);
                //this.canvasContext.lineTo(x, y);
            }
            
            vertices.push(this.props.width);
            vertices.push(NaN);

            drawnChannels++;
        }

        this.glContext.enableVertexAttribArray(this.coordAttr);
        this.glContext.vertexAttribPointer(this.coordAttr, 2, this.glContext.FLOAT, false, 0, 0);
        this.glContext.uniform2f(this.resolutionUniform, this.canvasRef.current.width, this.canvasRef.current.height);
        
        // Pass the vertex data to the buffer
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.vertexBuffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(vertices), this.glContext.STATIC_DRAW);
        this.glContext.drawArrays(this.glContext.LINE_STRIP, 0, Math.floor(vertices.length / 2));
    
        if (isUpdateGrid)
            this.drawGrid();
    }

    drawGrid(){
        var channelCount = this.props.channels > this.peakArray.length ? this.peakArray.length : this.props.channels;

        var width = this.props.width - this.textWidth;
        var widthStep = width / this.count;
        var currentHeight = Math.max(50, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount); //Math.max(50, Math.min(150, (this.props.height - this.timelineHeight - (this.props.margin * channelCount)) / channelCount));
        var halfHeight = currentHeight / 2;

        var startX = widthStep * Math.min(this.peakOffset, 0) * -1 + this.textWidth;
        var startY = 0;
        var topMargin = Math.max(this.props.height - this.timelineHeight - ((currentHeight + this.props.margin) * channelCount), 0) / 2;
        
        var c = 0;
        var drawnChannels = 0;

        this.gridContext.fillStyle = 'white';
        this.gridContext.clearRect(0, 0, this.props.width, this.props.height);

        for (c = 0; c < this.peakArray.length; c++){
            if (!this.channelEnabled[c])
                continue;
            
            startY = halfHeight * (drawnChannels * 2 + 1) + (this.props.margin * drawnChannels) + topMargin + this.timelineHeight - this.verticalScrollPos;
            
            if (startY < -1 * currentHeight - this.props.margin)
            {
                drawnChannels++;
                continue;
            }
            else if (startY > this.props.height)
                break;
            
            //Draw canvas channel text
            this.gridContext.fillText(this.channelNames[c], 0, startY);
            this.gridContext.moveTo(startX, (this.peakArray[c][Math.max(this.peakOffset, 0)] * halfHeight) + startY);

            drawnChannels++;
        }

        //Draw Canvas Grids
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'red';
        this.gridContext.lineWidth = 0.5;
        this.gridContext.moveTo(width / 2 + this.textWidth, this.timelineHeight);
        this.gridContext.lineTo (width / 2 + this.textWidth, this.props.height);
        for (c = 0; c < channelCount; c++){
            this.gridContext.moveTo(this.textWidth, c * (currentHeight + this.props.margin) + this.timelineHeight + topMargin - this.verticalScrollPos);
            this.gridContext.lineTo(this.textWidth + width, c * (currentHeight + this.props.margin) + this.timelineHeight + topMargin - this.verticalScrollPos);
            
            this.gridContext.moveTo(this.textWidth, c * (currentHeight + this.props.margin) + currentHeight + this.timelineHeight + topMargin - this.verticalScrollPos);
            this.gridContext.lineTo(this.textWidth + width, c * (currentHeight + this.props.margin) + currentHeight + this.timelineHeight + topMargin - this.verticalScrollPos);
        }
        this.gridContext.stroke();
    }

    //etc
    getCanvas(){
        return this.canvasRef.current;
    }

    render(){
        var style={
            display: 'flex',
            flexDirection: 'column',
        };
        var graphStyle={
            display: 'flex',
            zIndex: '1'
        }
        var gridStyle={
            display: 'flex',
            position: 'absolute',
            zIndex: '2'
        };
        var scrollStyle={
            display: 'flex',
            position: 'relative',
            zIndex: '3'
        }
        
        this.peakMaxOffset = this.peakArray[0].length - this.count / 2;
        this.peakMinOffset = this.count / -2;

        return (
        <div style={style}>
            <div style={style}>
                <canvas ref={this.gridCanvasRef} style={gridStyle} id='gridCanvas'
                width={this.props.width} height={this.props.height}/>
                <canvas ref={this.canvasRef} style={graphStyle} id='graphCanvas'
                width={this.props.width} height={this.props.height/*this.props.channels * (this.props.height + this.props.margin) + this.timelineHeight*/}/>
            </div>
            <ScrollBar ref={ref=>{this.scrollBarRef = ref;}} style={scrollStyle}
            width={this.props.width} height='20'
            handleWidth={this.count / (this.peakArray[0].length + this.count / 2)}
            onDragStart={this.stop}
            onDrag={this.setoffset}/>
        </div>);
    }
}

export default GLGraph;