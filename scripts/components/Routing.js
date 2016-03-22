/*
  Routing
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';

@autobind
class Routing extends React.Component {

 
    render() {
      return (
        <div>
          {console.log('Entered Routing')}
          Routing
        </div>
      )
    }

};

export default Routing
