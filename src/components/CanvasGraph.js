import React from 'react';
import ScrollBar from './ScrollBar';

class CanvasGraph extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.canvasContext = null;
    this.scrollBarRef = null;
    this.isPlaying = false;
    this.deltaTime = 0;
    this.prevTime = 0;
    this.textWidth = 100;
    this.timelineHeight = 50;

    //Bind Functions
    this.loop = this.loop.bind(this);

    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setoffset = this.setoffset.bind(this);

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
    for (c = 0; c < channelCount; c++) {
      this.peakArray.push([]);
      this.channelEnabled.push(true);
      this.channelNames.push(c.toString().padStart(4, '0'));

      for (i = 0; i < 100000; i++) {
        this.peakArray[c].push(0);
      }
    }

    this.peakMaxOffset = this.peakArray[0].length - this.props.count / 2;
  }

  componentDidMount() {
    this.canvasContext = this.canvasRef.current.getContext('2d', {
      alpha: false,
    });
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.lineWidth = 1;
    this.canvasContext.shadowBlur = 0;

    this.canvasContext.font = this.props.height / 2 + 'px malgun gothic';
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    this.stop();
  }

  //Play
  play() {
    if (this.isPlaying) return;

    //Rewind
    if (this.peakOffset === this.peakMaxOffset) {
      this.peakOffset = this.peakMinOffset;
    }

    this.prevTime = new Date().getTime();
    this.isPlaying = true;
    requestAnimationFrame(this.loop);

    if (this.props.onPlayStateChanged !== undefined)
      this.props.onPlayStateChanged();
  }

  stop() {
    if (!this.isPlaying) return;

    this.isPlaying = false;

    if (this.props.onPlayStateChanged !== undefined)
      this.props.onPlayStateChanged();
  }

  togglePlay() {
    if (this.isPlaying) this.stop();
    else this.play();
  }

  //Controls
  setfile(file) {
    this.currentFile = file;
    this.peakArray = file.getNormalizedAmpData();
    this.peakOffset = this.peakMinOffset;
    this.peakMaxOffset = this.peakArray[0].length - this.props.count / 2;

    var i = 0;
    this.channelEnabled = [];
    for (i = 0; i < this.peakArray.length; i++) {
      this.channelEnabled.push(true);
    }

    var channelData = file.getChannelData();
    this.channelNames = [];
    for (i = 0; i < channelData.length; i++) {
      this.channelNames.push(channelData[i].customName);
    }

    this.scrollBarRef.setHandlePosition(0);
    this.draw();

    if (this.props.onOffsetChanged !== undefined) this.props.onOffsetChanged(0);
  }

  setchannelsenabled(arr) {
    var j = 0;
    for (var i = 0; i < this.channelEnabled.length; i++) {
      if (arr[j] === i) {
        this.channelEnabled[i] = true;
        if (j < arr.length - 1) {
          j++;
        }
      } else {
        this.channelEnabled[i] = false;
      }
    }

    this.draw();
  }

  setoffset(pos) {
    this.peakOffset =
      Math.floor((this.peakMaxOffset + this.props.count / 2) * pos) -
      this.props.count / 2;
    this.draw();

    if (this.props.onOffsetChanged !== undefined)
      this.props.onOffsetChanged(pos);
  }

  next() {
    this.peakOffset += Math.round(
      (this.currentFile === undefined ? 100 : this.currentFile.sampleRate) *
        this.props.speed
    );
    this.peakOffset = Math.min(this.peakOffset, this.peakMaxOffset);
    this.peakOffset = Math.max(this.peakOffset, this.peakMinOffset);

    this.draw();
    var pos =
      (this.peakOffset + this.props.count / 2) /
      (this.peakMaxOffset + this.props.count / 2);
    this.scrollBarRef.setHandlePosition(pos);

    if (this.props.onOffsetChanged !== undefined)
      this.props.onOffsetChanged(pos);
  }

  prev() {
    this.peakOffset -= Math.round(
      (this.currentFile === undefined ? 100 : this.currentFile.sampleRate) *
        this.props.speed
    );
    this.peakOffset = Math.min(this.peakOffset, this.peakMaxOffset);
    this.peakOffset = Math.max(this.peakOffset, this.peakMinOffset);

    this.draw();
    var pos =
      (this.peakOffset + this.props.count / 2) /
      (this.peakMaxOffset + this.props.count / 2);
    this.scrollBarRef.setHandlePosition(pos);

    if (this.props.onOffsetChanged !== undefined)
      this.props.onOffsetChanged(pos);
  }

  //Play Loop
  loop() {
    if (!this.isPlaying) return;

    var now = new Date().getTime();
    this.deltaTime = now - this.prevTime;
    this.prevTime = now;
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }

  update() {
    this.peakOffset += Math.round(
      (this.currentFile === undefined ? 100 : this.currentFile.sampleRate) *
        (this.deltaTime * 0.001) *
        this.props.speed
    );

    if (this.peakOffset > this.peakMaxOffset) {
      this.peakOffset = this.peakMaxOffset;
      this.stop();
    }

    if (this.props.onOffsetChanged !== undefined)
      this.props.onOffsetChanged(
        (this.peakOffset + this.props.count / 2) / this.peakMaxOffset
      );

    if (this.scrollBarRef != null)
      this.scrollBarRef.setHandlePosition(
        (this.peakOffset + this.props.count / 2) /
          (this.peakMaxOffset + this.props.count / 2)
      );
  }

  draw() {
    if (this.peakArray[0].length < 2) return;

    var channelCount =
      this.props.channels > this.peakArray.length
        ? this.peakArray.length
        : this.props.channels;

    var len =
      this.props.count < this.peakArray[0].length
        ? this.props.count
        : this.peakArray[0].length;
    var width = this.canvasRef.current.offsetWidth - this.textWidth;
    var height = this.canvasRef.current.offsetHeight;
    var halfHeight = this.props.height / 2;
    var widthStep = width / this.props.count;

    var startX = widthStep * Math.min(this.peakOffset, 0) * -1 + this.textWidth;
    var startY = 0;

    this.canvasContext.strokeStyle = this.props.strokeColor;
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.fillRect(0, 0, width + this.textWidth, height);
    //this.canvasContext.clearRect(0, 0, width, height);

    var currentIdx = 0;
    var x = 0;
    var y = 0;

    this.canvasContext.fillStyle = 'white';
    this.canvasContext.lineWidth = 1;

    this.canvasContext.beginPath();

    //Draw timeline text
    var currentTime = 0;
    var i = 0;

    if (this.currentFile) {
      for (i = 0; i < len; i++) {
        currentIdx = Math.max(i + this.peakOffset, i);
        currentTime = currentIdx / this.currentFile.sampleRate;
        currentTime = Math.floor(currentTime * 100) * 0.01;

        if (currentIdx % Math.floor(this.currentFile.sampleRate / 100) === 0) {
          this.canvasContext.fillText(
            currentTime.toString(),
            startX + i * widthStep,
            this.timelineHeight * 0.5
          );
        }
      }
    }

    var c = 0;
    var drawnChannels = 0;
    for (c = 0; c < this.peakArray.length; c++) {
      if (!this.channelEnabled[c]) continue;

      startY =
        halfHeight * (drawnChannels * 2 + 1) +
        this.props.margin * drawnChannels +
        this.timelineHeight;

      //Draw channel text
      this.canvasContext.fillText(
        this.channelNames[c],
        0,
        startY + halfHeight / 2
      );
      this.canvasContext.moveTo(
        startX,
        this.peakArray[c][Math.max(this.peakOffset, 0)] * halfHeight + startY
      );

      //Draw graph
      for (i = 1; i < len; i++) {
        currentIdx = Math.max(i + this.peakOffset, i);
        if (currentIdx > this.peakArray[c].length) continue;

        x = widthStep * i + startX + 0.1;
        y = this.peakArray[c][currentIdx] * halfHeight + startY + 0.1;
        this.canvasContext.lineTo(x, y);
      }

      drawnChannels++;
    }
    this.canvasContext.stroke();

    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = 'red';
    this.canvasContext.lineWidth = 0.5;
    this.canvasContext.moveTo(width / 2 + this.textWidth, this.timelineHeight);
    this.canvasContext.lineTo(width / 2 + this.textWidth, height);
    for (c = 0; c < channelCount; c++) {
      this.canvasContext.moveTo(
        this.textWidth,
        c * (this.props.height + this.props.margin) + this.timelineHeight
      );
      this.canvasContext.lineTo(
        this.textWidth + width,
        c * (this.props.height + this.props.margin) + this.timelineHeight
      );

      this.canvasContext.moveTo(
        this.textWidth,
        c * (this.props.height + this.props.margin) +
          this.props.height +
          this.timelineHeight
      );
      this.canvasContext.lineTo(
        this.textWidth + width,
        c * (this.props.height + this.props.margin) +
          this.props.height +
          this.timelineHeight
      );
    }
    this.canvasContext.stroke();
  }

  getCanvas() {
    return this.canvasRef.current;
  }

  render() {
    var style = {
      display: 'flex',
      flexDirection: 'column',
    };

    this.peakMaxOffset = this.peakArray[0].length - this.props.count / 2;
    this.peakMinOffset = this.props.count / -2;

    return (
      <div style={style}>
        <canvas
          ref={this.canvasRef}
          width={this.props.width}
          height={
            this.props.channels * (this.props.height + this.props.margin) +
            this.timelineHeight
          }
        />
        <ScrollBar
          ref={(ref) => {
            this.scrollBarRef = ref;
          }}
          width={this.props.width}
          height='20'
          handleWidth={
            this.props.count / (this.peakArray[0].length + this.props.count / 2)
          }
          onDragStart={this.stop}
          onDrag={this.setoffset}
        />
      </div>
    );
  }
}

export default CanvasGraph;
