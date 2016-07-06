/*
  Routing
*/

import React from 'react'
import autobind from 'autobind-decorator'
import Sortable from 'react-anything-sortable'
import Sequence from './Sequence'
import store from '../store/Store'
import { connect } from 'react-redux'

@autobind
class Routing extends React.Component {

  
  componentDidMount() {
    console.log('Loading Route Sequences from server')
    fetch('http://localhost:6543/route/1/1', {
      credentials: 'include',
      headers: {'X-CSRF-TOKEN': this.props.csrfToken
    }})
    .then(
      response => response.json()
    )
    .then(
      responseData => {
        store.dispatch({
          type: 'FETCH_ROUTES_SUCCESS',
          sequences: responseData.sequences
        })
        console.log(store.getState())
      }
    )
  };
 
  
  incrementSortableKey() {
    store.dispatch({
      type: 'INCREMENT_SORTABLE_KEY'
    })
  };

  highestSequence(sequences) {
    var values = [];
    sequences.map(a => values.push(a.sequence))
    return Math.max.apply(Math, values)
  }

  handleSort(sortedArray) {
    this.incrementSortableKey()
    var newSequences = []
    var i=1
    sortedArray.map(function(item) {item.sequence=i, ++i, newSequences.push(item)})
    this.setState({
      sequences: newSequences
    });
  }


  handleAddElement() {
    this.incrementSortableKey()
    var lastSequence = this.highestSequence(this.state.sequences)
    console.log('lastSequence='+lastSequence)
    this.setState({
      sequences: this.state.sequences.concat({"sequence": ++lastSequence, "data": "", "command": ""})
    });
  }
  
  handleRemoveElement(index) {
    this.incrementSortableKey()
    const newArr = this.state.sequences.slice();
    newArr.splice(index, 1);
  
    this.setState({
      sequences: newArr
    });
  }
  
  saveRoute() {
    console.log(this.state.sequences)
    fetch('http://localhost:6543/route/1/1', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': this.props.csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(
        this.state
      )
    })
    .then(
      response => {
        return response.json()
      }
    )
  };


  render() {

    function renderItem(sequence, index) {
      return (
        <Sequence key={ ['sequence',index].join('_') } className="sequence" sortData={sequence} >
          {sequence.sequence}
       </Sequence>
      );
    }
  
    return (
      <div>
        {console.log('Rendering main')}
        {console.log('props', this.props)}
        <button onClick={::this.handleAddElement}>Add sequence</button>
        <Sortable className="route" onSort={::this.handleSort} key={ this.props.sortableKey } dynamic>
          {this.props.sequences.map(renderItem, this)}
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

const mapStateToProps = function(store) {
  return store.routeState
  
}

export default connect(mapStateToProps)(Routing);
