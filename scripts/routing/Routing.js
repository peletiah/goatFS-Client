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

const renderSequences = ({ fields, meta: { touched, error }, handleMoveSequence, handleRemoveSequence }) => (
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


//const validate = (values) => {
//  store.dispatch({
//    type: 'ALTER_SEQUENCE',
//    modifiedSequences: values.sequences
//  })
//}

const doMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
      onBlur={() => input.onBlur()}
          value={input.value || []} // requires value to be an array
              {...rest}/>


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
    const { sequences, blaValue, commandValue } = this.props

    return (
      <div>
        <button type="button" onClick={ this.handleAddSequence }>Add Sequence</button>
        <div>
          <label>blablu</label>
          <Field name="blablu" component="input" type="text"/>
        </div>

        <div>
          <label>blable</label>
          <Field name="blable" component={doMultiselect} data={['bla','blu']}/>
        </div>
        <div>
          <span>commandValue: {commandValue}</span>
        </div>
        <div>
          <span>blaValue: {blaValue}</span>
        </div>

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
    initialValues: {sequences:state.route.sequences},
    commandValue: selector(state, "sequences[0].command.name"),
    blaValue: selector(state, "blable")
  })
)(Routing)


const mapStateToProps = function(store) {
  // maps store.route to this.props
  return store.route
}

export default connect(mapStateToProps)(Routing);
