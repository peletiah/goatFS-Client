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

    renderLog(key) {
      return <Log key={key} index={key} details={this.props.log} />
    }

 
    render() {
      return (
        <div>
          {console.log('Entered Hello')}
          {console.log(this.props)}
          <button onClick={this.props.fetchLog}>Fetch JSON</button>
          <div>
            <Log details={this.props.log} />
          </div>
        </div>
      )
    }

};

export default Hello
