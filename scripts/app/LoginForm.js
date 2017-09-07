/*
  LoginForm
*/

import React from 'react';
import autobind from 'autobind-decorator';
import { setCSRFToken } from './Actions';
import { Redirect } from 'react-router-dom';

@autobind
class LoginForm extends React.Component {

  constructor() {
    super();
    this.state =  {
      redirectToReferrer: false
    }
  }

  createLogin(event) {
    event.preventDefault()
    var login = {
        login : this.refs.login.value,
        password : this.refs.password.value
    }
    this.props.authenticate(login);
    this.refs.loginForm.reset()
  }

 authenticate(event) {
    event.preventDefault()
    var login = {
        login : this.refs.login.value,
        password : this.refs.password.value
    }

    console.log('putting login')
    fetch('http://api.goatfs.org:6543/sign_in', {
      method: "PUT",
      body: JSON.stringify(login),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    }).then(r => {
      localStorage.loggedin = true
      this.setState({ redirectToReferrer: true })
      setCSRFToken()
    })
    .catch(e => console.log("Error "+e))
  }


  render() {

    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div>
        <form ref="loginForm" onSubmit={this.authenticate}>
          <p>
            <label>Login</label><br/>
            <input type="text" ref="login" name="login"/>
          </p>
          <p>
            <label>Password</label><br/>
            <input type="password" ref="password" name="password"/>
          </p>
          <input type="hidden" name="came_from" value="http://localhost:3000/hello"/>
          <input type="submit" value="Sign In" name="submit" id="submit"/>
        </form>
      </div>
    )
  }

}

export default LoginForm
