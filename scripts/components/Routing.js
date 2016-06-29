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
import shortid from 'shortid'

@autobind
class Routing extends React.Component {

  constructor() {
    super();
    this.state = {
      sequences: [],
      lastSequence: 1
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
          lastSequence: this.highestSequence(this.state.sequences)
        })
        console.log('lastSequence: '+this.state.lastSequence)
      }
    )
  };
 
  
  highestSequence(sequences) {
    var values = [];
    sequences.map(a => values.push(a.sequence))
    return Math.max.apply(Math, values)
  }

  handleSort(sortedArray) {
    var newSequences = []
    var i=1
    sortedArray.map(function(item) {item.sequence=i, ++i, newSequences.push(item)})
    this.setState({
      sequences: newSequences
    });
    console.log(sortedArray)
  }


  handleAddElement() {
    console.log(this.state.lastSequence)
    console.log('lastSequence: '+this.state.lastSequence)
    this.setState({
      lastSequence: ++this.state.lastSequence
    })
    console.log('lastSequence: '+this.state.lastSequence)
    this.setState({
      sequences: this.state.sequences.concat({"sequence": this.state.lastSequence++, "data": "", "command": ""})
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
        <Sequence key={sequence.sequence} className="sequence" sortData={sequence}>
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
        <Sortable className="route" key={shortid.generate()} onSort={::this.handleSort}>
          {this.state.sequences.map(renderItem, this)}
        </Sortable>
        <button onClick={::this.saveRoute}>Save</button>
        {/*<div className="ui-sortable route">
          <div className="sequence ui-sortable-item ui-sortable-placeholder visible">
            <span className="sequence-order">4</span>
            <div className="action">
              <select>
                <option>Test 1</option>
                <option selected>Test 2</option>
                <option>Test 3</option>
              </select>
              <input value="asdf" size="40"/>
            </div>
          </div>
        </div>*/}
      </div>
    );
  }
};

export default Routing;
