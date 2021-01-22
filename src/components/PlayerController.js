import React from 'react';

class PlayerController extends React.Component {
  constructor(props) {
    super(props);

    this.play_onclick = this.play_onclick.bind(this);
    this.stop_onclick = this.stop_onclick.bind(this);
    this.replay_onclick = this.replay_onclick.bind(this);

    this.count_select_onchange = this.count_select_onchange.bind(this);
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

  count_select_onchange() {
    if (this.props.onCountChanged !== undefined)
      this.props.onCountChanged(document.getElementById('count_select').value);
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
    var btnStyle = {
      height: '50px',
      width: '50px',
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
        <span>확대</span>
        <select
          id='count_select'
          defaultValue='1000'
          onChange={this.count_select_onchange}
        >
          <option value='500'>500</option>
          <option value='1000'>1000</option>
          <option value='2000'>2000</option>
          <option value='3000'>3000</option>
          <option value='4000'>4000</option>
          <option value='5000'>5000</option>
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
