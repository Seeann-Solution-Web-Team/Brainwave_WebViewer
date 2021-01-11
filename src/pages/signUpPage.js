import React from 'react';

import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
} from 'react-bootstrap';

function SignUpPage() {
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
      <h2 className='text-center'>Sign Up</h2>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <FormControl type='text' name='username' placeholder='name' />
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormControl type='email' name='email' placeholder='email' />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl type='password' name='password' placeholder='password' />
      </FormGroup>
      <Button type='submit' className='btn-lg btn-dark btn-block'>
        CREATE ACCOUNT
      </Button>
      <div className='p-2'>
        Already have an account? <a href='/login'>Sign in</a>
      </div>
    </Form>
  );
}

export default SignUpPage;
