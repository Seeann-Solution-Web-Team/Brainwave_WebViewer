import React from 'react';
import './loginpage.css';

import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
} from 'react-bootstrap';

function LoginPage() {
  return (
    <Form
      className='login-form'
      action='http://localhost:3001/auth/login_process'
      method='POST'
    >
      <h1>
        <a className='font-weight-bold text-decoration-none' href='/'>
          Brainwave WEB
        </a>
      </h1>
      <h2 className='text-center'>Sign In</h2>

      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormControl type='email' name='email' placeholder='email' />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl type='password' name='password' placeholder='password' />
      </FormGroup>
      <Button type='submit' className='btn-lg btn-dark btn-block'>
        Log In
      </Button>
      <div className='p-2'>
        Don't have an account? <a href='/signup'>Sign up</a>
      </div>
    </Form>
  );
}

export default LoginPage;
