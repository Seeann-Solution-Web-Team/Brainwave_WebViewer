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

  render() {
    var st = {
      fontSize: '24px',
    };
    
    return (
      <div className='player_Controller'>
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
        <br />
        <span>timescale</span>
        <select id="timescale_select" defaultValue='1000' onChange={this.timescale_select_onchange}>
          <option value='1'>1ms</option>
          <option value='50'>50ms</option>
          <option value='250'>250ms</option>
          <option value='500'>500ms</option>
          <option value='1000'>1000ms</option>
          <option value='2500'>2500ms</option>
          <option value='5000'>5000ms</option>
        </select>

        <br />
        <br />
        <span>재생 속도</span>
        <select
          id='speed_select'
          defaultValue='1.0'
          onChange={this.speed_select_onchange}
        >
          <option value='0.1'>x0.1</option>
          <option value='0.25'>x0.25</option>
          <option value='0.5'>x0.5</option>
          <option value='1.0'>x1.0</option>
          <option value='1.25'>x1.25</option>
          <option value='1.5'>x1.5</option>
          <option value='2.0'>x2.0</option>
        </select>

        <br />
        <br />
        <br />
        <span>대충 메모 들어갈자리</span>
        <br />
        <br />
        <span>대충 메모 들어갈자리2</span>
        <br />
        <br />
        <span>대충 메모 들어갈자리3</span>
      </div>
    );
  }
}

export default PlayerController;
