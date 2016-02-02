/*
  Login
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import cookie from 'react-cookie';


@autobind
class Login extends React.Component {

  signIn(event) {
    event.preventDefault();
    console.log('starting signIn')
    var login = this.refs.login.value
    var password = this.refs.password.value
    fetch('http://localhost:6543/sign_in', {
      method: "PUT",
      body: JSON.stringify({'login':login,'password':password}),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    }).then(function(response) {
      console.log(response.status)
      console.log(response.ok)
    });

  }



    render() {
      return (
        <div>
          <form onSubmit={this.signIn}>
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

export default Login
