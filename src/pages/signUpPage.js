import React from 'react';

import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
} from 'react-bootstrap';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePWChange = this.handlePWChange.bind(this);
    this.handleConfirmPWChange = this.handleConfirmPWChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    };
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePWChange(e) {
    this.setState({ password: e.target.value });
  }

  handleConfirmPWChange(e) {
    this.setState({ confirm_password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password, confirm_password } = this.state;
    const signUpInfo = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    const signUp = {
      method: 'POST',
      body: JSON.stringify(signUpInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (password === confirm_password) {
      fetch('/api/auth/register', signUp)
        .then(alert('가입이 완료되었습니다.'))
        .then(this.props.history.push('/login'));
    } else {
      alert('입력값을 확인해주세요');
    }
  }

  render() {
    return (
      <Form className='login-form'>
        <h1>
          <a className='font-weight-bold text-decoration-none' href='/'>
            Brainwave WEBs
          </a>
        </h1>
        <h2 className='text-center'>Sign Up</h2>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormControl
            type='text'
            onChange={this.handleUsernameChange}
            name='username'
            placeholder='name'
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl
            type='email'
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
          <FormControl
            type='password'
            onChange={this.handleConfirmPWChange}
            name='password'
            placeholder='Confirm your password'
          />
        </FormGroup>
        <Button
          type='submit'
          onClick={this.handleSubmit}
          className='btn-lg btn-dark btn-block'
        >
          CREATE ACCOUNT
        </Button>
        <div className='p-2'>
          Already have an account? <a href='/login'>Sign in</a>
        </div>
      </Form>
    );
  }
}

export default SignUpPage;
