/*
  LoginForm
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';


@autobind
class LoginForm extends React.Component {


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

    console.log(this.state)
    console.log('putting login')
    fetch('http://localhost:6543/sign_in', {
      method: "PUT",
      body: JSON.stringify(login),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    }).then(r => this.props.setCSRFToken())
    .catch(e => console.log("Error "+e))
  }


  render() {
    return (
      <div>
        {console.log('Entered LoginForm')}
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

};

export default LoginForm
