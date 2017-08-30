/* 
  GoatFS Client - Main App
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import cookie from 'react-cookie';
import Menu from '../menu/Menu';
import LoginForm from './LoginForm';
import store from '../store/Store'
import { setCSRFToken } from './Actions';

@autobind
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      csrfToken : '',
      log : {}
    }
  }

  componentWillMount() {
    setCSRFToken()
  }


  fetchLog() {
    console.log('Fetching Log from server')
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://localhost:6543/hello', {
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': csrfToken
      }
    }).then(r => r.json())
      .then(data => this.setState({
          log : data
      }, console.log(data)))
      .catch(e => console.log("Error"))
    }

  render() {
    return (
      <div>
        <Menu/>
      </div>
    )
  }
};

export default App    
