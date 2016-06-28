/*
  Routing
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';
import Sortable from 'react-anything-sortable';
import Sequence from './Sequence'

@autobind
class Routing extends React.Component {

  constructor() {
    super();
    this.state = {
      sequences: [],
      _sortableKey: 0
    };
  }
  
  componentDidMount() {
    console.log('Loading Route Sequences from server')
    fetch('http://localhost:6543/route/1/1', {
      credentials: 'include',
      headers: {'X-CSRF-TOKEN': this.props.csrfToken
    }})
    .then(
      response => {
        return response.json()
      }
    )
    .then(
      sequences => {
        this.setState(sequences)
        console.log(sequences)
        this.setState({
          _sortableKey: this.highestSequence(this.state.sequences)
        })
        console.log(this.state._sortableKey)
      }
    )
  };
 
  
  highestSequence(sequences) {
    var values = [];
    sequences.map(a => values.push(a.sequence))
    return Math.max.apply(Math, values)
  }

  handleSort(sortedArray) {
    this.state._sortableKey++;
    console.log(this.state._sortableKey)
    this.setState({
      sequences: sortedArray
    });
    console.log(sortedArray)
  }


  handleAddElement() {
    this.state._sortableKey++;
    this.setState({
      sequences: this.state.sequences.concat({"sequence": this.state._sortableKey, "data": "", "command": ""})
    });
  }
  
  handleRemoveElement(index) {
    const newArr = this.state.sequences.slice();
    newArr.splice(index, 1);
    this.state._sortableKey++;
  
    this.setState({
      sequences: newArr
    });
  }
  
  saveRoute() {
    console.log(this.state.sequences)
  }
  
  
  render() {
    function renderItem(sequence, index) {
      return (
        <Sequence key={index} className="sequence" sortData={sequence}>
          {console.log('Rendering Sequence')}
          {console.log(sequence)}
          {sequence.sequence}
          <span className="delete"
            onMouseDown={this.handleRemoveElement.bind(this, index)}
          >&times;</span>
       </Sequence>
      );
    }
  
    return (
      <div>
        {console.log('Rendering main')}
        <button onClick={::this.handleAddElement}>Add 1 element</button>
        <Sortable className="route" key={this.state._sortableKey} onSort={::this.handleSort} dynamic>
          {this.state.sequences.map(renderItem, this)}
        </Sortable>
        <button onClick={::this.saveRoute}>Save</button>
      </div>
    );
  }
};

export default Routing;
