/*
  Home
*/

import React from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

@autobind
class Home extends React.Component {

   render() {
     return (
      <b>Hello World!</b>
     )
   }
}

reactMixin.onClass(Home, History)

export default Home;
