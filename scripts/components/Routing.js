/*
  Routing
*/

import React from 'react'
import autobind from 'autobind-decorator'
import Sortable from 'react-anything-sortable'
import Sequence from './Sequence'
import shortid from 'shortid'
import Link from 'valuelink'

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
    console.log('Entering handleSort')
    var newSequences = []
    var i=1
    sortedArray.map(function(item) {item.value.sequence=i, ++i, newSequences.push(item.value)})
    this.setState({
      sequences: newSequences
    });
  }


  handleAddElement() {
    this.state._sortableKey++;
    var lastSequence = this.highestSequence(this.state.sequences)
    console.log('lastSequence='+lastSequence)
    this.setState({
      sequences: this.state.sequences.concat({"sequence": ++lastSequence, "data": "", "command": ""})
    });
  }
  
  handleRemoveElement(index) {
    this.state._sortableKey++;
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
    const sequencesLink = Link.state( this, 'sequences' );

    function renderItem(sequenceLink, index) {
      return (
        <Sequence key={ ['sequence',index].join('_') } className="sequence" sortData={sequenceLink} >
          {console.log('Rendering Sequence')}
          {sequenceLink.sequence}
       </Sequence>
      );
    }
  
    return (
      <div>
        {console.log('Rendering main')}
        <button onClick={::this.handleAddElement}>Add sequence</button>
        <Sortable className="route" onSort={::this.handleSort} key={ this.state._sortableKey } dynamic>
          {sequencesLink.map(renderItem, this)}
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
