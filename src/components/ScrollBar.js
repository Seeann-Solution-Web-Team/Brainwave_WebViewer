import React from 'react'

class ScrollBar extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;

        this.ondragstart = this.ondragstart.bind(this);
        this.ondrag = this.ondrag.bind(this);
        this.ondragover = this.ondragover.bind(this);

        this.isDragging = false;
        this.isHoldingHandle = false;
        this.handlePosition = 0.0;
    }

    componentDidMount (){
        this.canvasContext = this.canvasRef.current.getContext('2d');
        this.canvasContext.shadowBlur = 0;

        this.renderCanvas();

        var c = document.getElementById("scrollBarCanvas");
        c.addEventListener("touchstart", this.touchHandler, true);
        c.addEventListener("touchmove", this.touchHandler, true);
        c.addEventListener("touchend", this.touchHandler, true);
        c.addEventListener("touchcancel", this.touchHandler, true);
    }

    componentWillUnmount(){
        var c = document.getElementById("scrollBarCanvas");
        c.removeEventListener("touchstart", this.touchHandler, true);
        c.removeEventListener("touchmove", this.touchHandler, true);
        c.removeEventListener("touchend", this.touchHandler, true);
        c.removeEventListener("touchcancel", this.touchHandler, true);
    }

    //Touch event to mouse event
    touchHandler(event)
    {
        var touches = event.changedTouches;
        var first = touches[0];
        var type = "";
    
        switch(event.type)
        {
            case "touchstart": type = "mousedown"; break;
            case "touchmove":  type="mousemove"; break;       
            case "touchend":   type="mouseup"; break;
            default: return;
        }
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY,
                                first.clientX, first.clientY, false,
                                false, false, false, 0/*left*/, null);
    
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }

    //Events
    ondragstart (e) {
        var handleWidthPx = this.props.width * this.props.handleWidth;
        var handlePosPx = (this.props.width - handleWidthPx) * this.handlePosition;
        var pos = this.getMousePos(this.canvasRef.current, e);

        this.isDragging = true;
        //console.log('==Drag Start==');

        if (Math.abs(pos.x - handlePosPx) < handleWidthPx)
            this.isHoldingHandle = true;
        if (this.props.onDragStart !== undefined)
            this.props.onDragStart();
        this.ondrag(e);
    }

    ondrag(e){
        if (this.isDragging === false)
            return;
        
        var handleWidthPx = this.props.width * this.props.handleWidth;
        var pos = this.getMousePos(this.canvasRef.current, e);

        this.handlePosition = (pos.x - (this.props.width / 2)) / (this.props.width - handleWidthPx);
        this.handlePosition = this.clamp(this.handlePosition, -0.5, 0.5) + 0.5;
        //console.log('Dragging, Pos : ' + pos.x);

        if (this.props.onDrag !== undefined)
            this.props.onDrag(this.handlePosition);
        
        this.renderCanvas();
    }

    ondragover (e){
        if (this.isDragging === false)
            return;

        this.isDragging = false;
        this.isHoldingHandle = false;
        //console.log('==Drag Over==');

        if (this.props.onDragEnd !== undefined)
            this.props.onDragEnd();

        this.renderCanvas();
    }

    setHandlePosition (p){
        this.handlePosition = p;
        this.renderCanvas();
    }

    //Render
    renderCanvas(){
        var width = this.canvasRef.current.offsetWidth;
        var height = this.canvasRef.current.offsetHeight;
        
        this.canvasContext.clearRect(0, 0, width, height);
        this.canvasContext.fillStyle = 'rgba(0,0,0,.5)';
        this.canvasContext.fillRect(0, 0, width, height);

        //Draw handle
        var handleWidthPx = this.props.width * this.props.handleWidth;
        var handlePosPx = (this.props.width - handleWidthPx) * this.handlePosition;
        handlePosPx = this.clamp(handlePosPx, 0, width - handleWidthPx);

        this.canvasContext.fillStyle = this.isHoldingHandle ? 'rgba(180.0,180.0,180.0)' : 'white';
        this.canvasContext.fillRect(handlePosPx, 0, handleWidthPx, this.props.height);
    }

    render(){
        if (this.canvasRef.current)
            this.renderCanvas();

        return <canvas id="scrollBarCanvas"
                ref={this.canvasRef}
                width={this.props.width} height={this.props.height}
                onMouseDown={this.ondragstart} 
                onMouseMove={this.ondrag}
                onMouseUp={this.ondragover}
                onMouseOut={this.ondragover}/>
    }

    //etc
    getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    clamp(v, min, max){
        if (v < min)
            return min;
        else if (v > max)
            return max;

        return v;
    }
}

export default ScrollBar;