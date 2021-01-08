import React from 'react'
import './loginpage.css'

function LoginPage (){
    return (
        <div className='loginpage'>
            <form action="/login_process" method="POST">
                <div className='loginInputs'>
                        <input type="text" name="id" autoComplete="id"/>
                        <input type="password" name="pw" autoComplete="password"/>
                </div>
                <div className='loginButton'>
                    <button>sign up</button>
                    <input type="submit" value="login"/>
                </div>
            </form>
        </div>);
}

export default LoginPage;