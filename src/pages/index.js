import React from 'react';
import './index.css';
import { Navbar, Image } from 'react-bootstrap';
import { Component } from 'react';

class mainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: '',
    };
  }

  componentDidMount() {
    console.log('index get');
    // const index_GET = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // };
    fetch('/index')
      // .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  render() {
    return (
      <div className='main'>
        <Navbar bg='dark' variant='dark'>
          <Navbar.Brand href='/'>Brain - WEB</Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text>
              <a href='/login'>Sign in</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <div className='main__contents'>
          <div className='menu'>
            <div className='menu__controls'></div>
            <div className='menu__data'></div>
          </div>
          <div className='graphs'>b</div>
        </div>
      </div>
    );
  }
}

export default mainPage;
