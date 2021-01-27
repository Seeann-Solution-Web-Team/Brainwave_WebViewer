import React from 'react';
import { Navbar } from 'react-bootstrap';
import Logout from '../components/Logout';

function MainNavbar(props) {
  let navbar_text;
  console.log(props.loggedIn, props.username);
  if (props.loggedIn) {
    navbar_text = (
      <Navbar.Text>
        <a href='/storage' className='p-3'>
          {props.username}'s Storage
        </a>
        <Logout />
      </Navbar.Text>
    );
  } else {
    navbar_text = (
      <Navbar.Text>
        <a href='/login' className='p-3'>
          Sign in
        </a>
        <a href='/signup' className='p-3'>
          Sign up
        </a>
      </Navbar.Text>
    );
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Brand href='/'>Brain - WEB</Navbar.Brand>
      <Navbar.Collapse className='justify-content-end'>
        {navbar_text}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;
