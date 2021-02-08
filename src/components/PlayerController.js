import React from 'react';

class PlayerController extends React.Component {
  constructor(props) {
    super(props);

    this.play_onclick = this.play_onclick.bind(this);
    this.stop_onclick = this.stop_onclick.bind(this);
    this.replay_onclick = this.replay_onclick.bind(this);

    this.timescale_select_onchange = this.timescale_select_onchange.bind(this);
    this.channel_select_onchange = this.channel_select_onchange.bind(this);
    this.speed_select_onchange = this.speed_select_onchange.bind(this);
    this.filter_select_onchange = this.filter_select_onchange.bind(this);
  }

  play_onclick(e) {
    if (this.props.onPlayButtonClicked !== undefined)
      this.props.onPlayButtonClicked();
  }

  stop_onclick(e) {
    if (this.props.onPlayButtonClicked !== undefined)
      this.props.onStopButtonClicked();
  }

  replay_onclick(e) {
    if (this.props.onPlayButtonClicked !== undefined)
      this.props.onReplayButtonClicked();
  }

  timescale_select_onchange (){
    if (this.props.onTimeScaleChanged !== undefined)
        this.props.onTimeScaleChanged(document.getElementById("timescale_select").value);
  }

  channel_select_onchange() {
    if (this.props.onChannelChanged !== undefined)
      this.props.onChannelChanged(
        document.getElementById('channel_select').value
      );
  }

  speed_select_onchange() {
    if (this.props.onSpeedChanged !== undefined)
      this.props.onSpeedChanged(document.getElementById('speed_select').value);
  }

  filter_select_onchange(){
    if (this.props.onFilterChanged !== undefined)
        this.props.onFilterChanged( parseInt(document.getElementById("notch_freq_select").value), 
                                    parseInt(document.getElementById("highpass_cutoff_select").value));
}

  render() {
    let playerStyle = {
      display: 'flex',
      flexDirection: 'column'
    }

    let margin={
      margin: '0px 0px 12px 0px'
    }

    let padding={
      padding: '5px'
    }

    return (
      <div className='player_Controller' style={padding}>
        <div>
          <button className='btn btn-secondary' onClick={this.play_onclick}>
            Play
          </button>
          <button className='btn btn-secondary' onClick={this.stop_onclick}>
            Stop
          </button>
          <button className='btn btn-secondary' onClick={this.replay_onclick}>
            Rewind
          </button>
        </div>
        <br/>
        <span>timescale</span><br/>
        <select id="timescale_select" 
                defaultValue='3000' 
                onChange={this.timescale_select_onchange}
                style={margin}>
          <option value='1000'>1000ms</option>
          <option value='2000'>2000ms</option>
          <option value='3000'>3000ms</option>
          <option value='4000'>4000ms</option>
          <option value='5000'>5000ms</option>
        </select>

        <br/>
        <span>재생 속도</span><br/>
        <select id="speed_select" 
                defaultValue='1.0' 
                onChange={this.speed_select_onchange}
                style={margin}>
          <option value='0.1'>x0.1</option>
          <option value='0.25'>x0.25</option>
          <option value='0.5'>x0.5</option>
          <option value='1.0'>x1.0</option>
          <option value='1.25'>x1.25</option>
          <option value='1.5'>x1.5</option>
          <option value='2.0'>x2.0</option>
        </select>
            
        <br/>
        <span>Notch filter</span><br/>
        <select id="notch_freq_select" 
                defaultValue={0} 
                onChange={this.filter_select_onchange}
                style={margin}>
          <option value={0}>None</option>
          <option value={50}>50Hz</option>
          <option value={60}>60Hz</option>
        </select>

        <br/>
        <span>Highpass cutoff</span><br/>
        <select id="highpass_cutoff_select" 
                defaultValue={0} 
                onChange={this.filter_select_onchange}>
          <option value={0}>None</option>
          <option value={100}>100Hz</option>
          <option value={150}>150Hz</option>
          <option value={200}>200Hz</option>
          <option value={250}>250Hz</option>
          <option value={300}>300Hz</option>
          <option value={350}>350Hz</option>
          <option value={400}>400Hz</option>
          <option value={450}>450Hz</option>
          <option value={500}>500Hz</option>
        </select>
      </div>
    );
  }
}

export default PlayerController;
