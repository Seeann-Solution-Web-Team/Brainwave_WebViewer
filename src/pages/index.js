import React from 'react';
import './index.css';
import { Navbar } from 'react-bootstrap';
import { Component } from 'react';

class mainPage extends React.Component {
  render() {
    return (
      <div className='main'>
        <Navbar bg='dark' variant='dark'>
          <Navbar.Brand href='/'>
            <img
              alt=''
              src='/logo.svg'
              width='30'
              height='30'
              className='d-inline-block align-top'
            />{' '}
            Brain - WEB
          </Navbar.Brand>
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
