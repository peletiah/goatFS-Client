/*
  Routing
*/

import React from 'react'
import autobind from 'autobind-decorator'
import Route from './Route'
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
      }
    )
  };
 
  
  incrementSortableKey() {
    store.dispatch({
      type: 'INCREMENT_SORTABLE_KEY'
    })
  };

  highestSequence(sequences) {
    const values = [];
    sequences.map(a => values.push(a.sequence))
    return Math.max.apply(Math, values)
  }

  handleSort(sortedArray) {
    this.incrementSortableKey()
    console.log('sortedArray',sortedArray)
    store.dispatch({
      type: 'SORT_ROUTES',
      sortedSequences: sortedArray
    });
  }


  handleAddElement() {
    this.incrementSortableKey()
    var lastSequence = this.highestSequence(this.state.sequences)
    this.setState({
      sequences: this.state.sequences.concat({"sequence": ++lastSequence, "data": "", "command": ""})
    });
  }

  handleAlterSequence( sequence, event ) {
    console.log(sequence)
    console.log(event)
    const newSequence = {...sequence, data: event.target.value}
    store.dispatch({
      type: 'ALTER_SEQUENCE',
      sequence: newSequence
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
    return (
      <Route 
        sequences={ this.props.sequences } 
        handleSubmit={ this.handleAlterSequence } 
        handleSort={ this.handleSort } 
        saveRoute={ this.saveRoute } 
        sortableKey={ this.props.sortableKey }
      />
    );
  }
};

const mapStateToProps = function(store) {
  return store.routeState
  
}

export default connect(mapStateToProps)(Routing);

