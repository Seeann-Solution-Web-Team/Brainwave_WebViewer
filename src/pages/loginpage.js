import React from 'react';
import './auth.css';
import axios from 'axios';

import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
} from 'react-bootstrap';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePWChange = this.handlePWChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    if (window.localStorage.getItem('loggedIn')) {
      this.props.history.push('/storage');
    }
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePWChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const loginInfo = {
      email: this.state.email,
      password: this.state.password,
    };

    axios.post('/api/auth/login', loginInfo).then((res) => {
      if (res.status == 401) {
        console.log('token expired');
      } else {
        alert('로그인 되었습니다');
        window.localStorage.setItem('loggedIn', true);
        window.localStorage.setItem('username', res.data.username);
        window.location.href = '/storage';
      }
    });
  }

  render() {
    return (
      <Form className='login-form '>
        <h1>
          <a className='font-weight-bold text-decoration-none' href='/'>
            Brainwave WEB
          </a>
        </h1>
        <h2 className='text-center'>Sign In</h2>

        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl
            type='text'
            onChange={this.handleEmailChange}
            name='email'
            placeholder='email'
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl
            type='password'
            onChange={this.handlePWChange}
            name='password'
            placeholder='password'
          />
        </FormGroup>
        <Button
          type='submit'
          onClick={this.handleSubmit}
          className='btn-lg btn-dark btn-block'
        >
          Log In
        </Button>
        <div className='p-2'>
          Don't have an account? <a href='/signup'>Sign up</a>
        </div>
      </Form>
    );
  }
}

export default LoginPage;
