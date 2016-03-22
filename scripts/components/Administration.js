/*
  Administration
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';

@autobind
class Administration extends React.Component {

 
    render() {
      return (
        <div>
          {console.log('Entered Administration')}
          Administration
        </div>
      )
    }

};

export default Administration
