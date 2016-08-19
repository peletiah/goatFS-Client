/*
  Routing
*/

import React, { Component } from 'react'
import update from 'react/lib/update';
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Field, FieldArray, reduxForm } from 'redux-form';
import Sequence from './Sequence'
import store from '../store/Store'

const renderSequences = ({ fields, handleMoveSequence, handleRemoveSequence }) => (
  <div className="route">
    {fields.map((sequenceField, index) =>
      <Sequence key={ `${sequenceField}.sequence` } 
                index={ index }
                handleMoveSequence ={ handleMoveSequence }
                handleRemoveSequence = { handleRemoveSequence }
                className="sequence" 
                sequenceField={ sequenceField } />
    )}
  </div>
)


const validate = (values) => {
  store.dispatch({
    type: 'ALTER_SEQUENCE',
    modifiedSequences: values.sequences
  })
}

export default validate

@autobind
@DragDropContext(HTML5Backend)
class Routing extends Component {
  
  constructor(props) {
    super(props);
    this.handleMoveSequence = this.handleMoveSequence.bind(this);
    this.handleRemoveSequence = this.handleRemoveSequence.bind(this);
  }


  
  componentDidMount() {
    console.log('Loading Route Sequences from server')
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://localhost:6543/route/1/1', {
      credentials: 'include',
      headers: {'X-CSRF-TOKEN': csrfToken
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
    //this.props.initialize()
  };


  handleAddSequence() {
    store.dispatch({
      type: 'ADD_SEQUENCE'
    })      
  }

  handleMoveSequence(dragIndex, hoverIndex) {
    const { sequences } = this.props;
    const dragSequence = sequences[dragIndex];
   
    store.dispatch({
      type:'MOVE_SEQUENCE',
      hoverIndex: hoverIndex,
      dragIndex: dragIndex,
    })

    store.dispatch({
      type:'RENUMBER_SEQUENCES'
    })
  }
 

  handleRemoveSequence(index) {
    store.dispatch({
      type:'REMOVE_SEQUENCE',
      index: index
    })
    store.dispatch({
      type:'RENUMBER_SEQUENCES'
    })

  }

  handleSaveRoute() {
    const { sequences } = store.getState().routeState
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://localhost:6543/route/1/1', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify (
        sequences
      )
    })
    .then(
      response => {
        console.log(response.json())
      }
    )
  };

 
  render() {
    const { sequences } = this.props

    return (
      <div>
        <button type="button" onClick={ this.handleAddSequence }>Add Sequence</button>
        <FieldArray name="sequences"
            component   =  { renderSequences }
            handleMoveSequence = { this.handleMoveSequence }
            handleRemoveSequence = { this.handleRemoveSequence }
        />
        <button type="button" onClick={ this.handleSaveRoute }>Save</button>
    </div>
    );
  }
};

Routing = reduxForm({
    form: 'sequenceform',
    validate,
    enableReinitialize: true
  }
)(Routing)

Routing = connect(
  state => ({
    initialValues: {sequences:state.routeState.sequences}
  })
)(Routing)


const mapStateToProps = function(store) {
  // maps store.routeState to this.props
  return store.routeState
}

export default connect(mapStateToProps)(Routing);

