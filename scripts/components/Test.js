/*
  Test
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';

class Test extends React.Component {

  constructor() {
    super();
    this.state = {
      sequences: [],
    };
  }
  
  componentWillMount() {
    console.log('Loading Route Sequences from server')
    fetch('http://localhost:6543/route/1/1', {
      credentials: 'include',
      headers: {'X-CSRF-TOKEN': this.props.csrfToken
    }})
    .then(r => r.json())
    .then(data => this.setState(data))
    .then(console.log(this.state.sequences))
    .catch(e => console.log('Error fetching Route Sequences'),
          this.setState({sequence : []}))
  };


  render() {
    function renderItem(sequence, index) {
      return (
        <div key={index}>
          {console.log(sequence)}
          <li>{sequence.command}</li>
        </div>
      );
    }
  
    return (
      <div>
          {console.log('Entered TEST')}
          {this.state.sequences.map(renderItem, this)}
      </div>
    );
  }
};

export default Test;
