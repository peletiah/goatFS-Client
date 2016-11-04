/*
  Routing
*/

import React, { Component } from 'react'
import update from 'react/lib/update';
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import Sequence from './Sequence'
import store from '../store/Store'
import Multiselect from 'react-widgets/lib/Multiselect'
import _ from 'underscore'

const renderSequences = ({ fields, meta: { touched, error }, handleMoveSequence, handleRemoveSequence, commandValue }) => (
  <div className="route">
    {fields.map((sequenceField, index) =>
      <Sequence key={ `${sequenceField}.sequence` } 
                index={ index }
                handleMoveSequence ={ handleMoveSequence }
                handleRemoveSequence = { handleRemoveSequence }
                className="sequence" 
                sequenceField={ sequenceField }
                commandValue = { commandValue }
                />
    )}
  </div>
)


//const validate = (values) => {
//  store.dispatch({
//    type: 'ALTER_SEQUENCE',
//    modifiedSequences: values.sequences
//  })
//}


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
    fetch('http://api.goatfs.org:6543/route/1', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'goatfs.org',
        'X-CSRF-TOKEN': csrfToken
      }
    })
    .then(
      response => response.json()
    )
    .then(
      responseJSON => {
        store.dispatch({
          type: 'FETCH_ROUTES_SUCCESS',
          route: responseJSON
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
    const route = store.getState().route
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://api.goatfs.org:6543/route/1', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify (
        route
      )
    })
    .then(
      response => {
        console.log(response.json())
      }
    )
  };



 
  render() {
    const { sequences, sequenceCommands } = this.props

    console.log(`asdf: ${sequenceCommands}`)
    if (sequences.sequences[0]){
      console.log(`brumsti: ${sequences.sequences[0].command}`)
    }


    return (
      <div>
        <button type="button" onClick={ this.handleAddSequence }>Add Sequence</button>
        {sequenceCommands && <div>
          <span>commandvalue: {sequenceCommands.sequences}</span>
        </div>}
             
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
    form: 'routingForm',
    enableReinitialize: true
  }
)(Routing)

const selector = formValueSelector("routingForm")
const getChild = _.property("command")

Routing = connect(
  state => ({
    initialValues: {sequences:state.route.sequences}
  })
)(Routing)


const mapStateToProps = (store, state) => {
  const sequenceFormArray = selector(state, 'sequences')
  const sequenceCommands = sequenceFormArray && sequenceFormArray.map(
    ({sequence}) => sequence && sequence.command
  )
  // maps store.route to this.props
  return {
    sequences: store.route,
    sequenceCommands: sequenceCommands
  }
  }


export default connect(mapStateToProps)(Routing);
