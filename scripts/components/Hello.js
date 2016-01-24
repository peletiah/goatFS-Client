/*
  Hello
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';

@autobind
class Hello extends React.Component {

    constructor() {
      super()

      this.state = {
        log : {}
      }
    }

    renderHello() {
      fetch('http://localhost:6543/hello', {
        credentials: 'include'
      }).then(r => r.json())
        .then(data => this.setState({
            log : data
        }, console.log(data)))
        .catch(e => console.log("Error"))
      }

    renderLog(key) {
      return <Log key={key} index={key} details={this.state.log} />
    }

 
    render() {
      return (
        <div>
          <button onClick={this.renderHello.bind(this,'hello')}>Fetch JSON</button>
          <div>
            <Log details={this.state.log} />
          </div>
        </div>
      )
    }

};

export default Hello
