/*
  Routing
*/

import React, { Component } from 'react'
import update from 'react/lib/update';
import autobind from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Field, FieldArray, reduxForm, formValueSelector, change, blur } from 'redux-form';
import Sequence from './Sequence'
import store from '../store/Store'
import Multiselect from 'react-widgets/lib/Multiselect'

const renderSequences = ({ fields, meta: { touched, error }, handleModifySequence, handleMoveSequence, handleRemoveSequence, sequenceFormArray, changeHandler, blurHandler }) => (
  <div className="route">
    {fields.map((sequenceField, index) => 
          <Sequence key={ `${sequenceField}.sequence` } 
                index={ index }
                handleModifySequence  = { handleModifySequence }
                handleMoveSequence    = { handleMoveSequence }
                handleRemoveSequence  = { handleRemoveSequence }
                sequenceFormArray     = { sequenceFormArray[index] }
                changeHandler         = { changeHandler }
                blurHandler         = { blurHandler }
                className="sequence" 
                sequenceField={ sequenceField } />
    )}
  </div>
)


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

  handleModifySequence(index, change, sequence, field) {
    console.log('from motherfucker')
    console.log('index',index)
    console.log('sequence',sequence)
    console.log('change',change)
    console.log('field',field)
    console.log('from motherfucker end')
    store.dispatch({
    type: 'ALTER_SEQUENCE',
    index: index,
    modifiedSequence: sequence,
    change: change,
    field: field
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
    const { sequences, changeHandler, blurHandler, sequenceFormArray } = this.props


    return (
      <div>
        <button type="button" onClick={ this.handleAddSequence }>Add Sequence</button>
        <FieldArray name="sequences"
            component   =  { renderSequences }
            handleModifySequence = { this.handleModifySequence }
            handleMoveSequence = { this.handleMoveSequence }
            changeHandler = { changeHandler }
            blurHandler = { blurHandler }
            handleRemoveSequence = { this.handleRemoveSequence }
            sequenceFormArray = { sequenceFormArray }
        />
        <button type="button" onClick={ this.handleSaveRoute }>Save</button>
        {sequenceFormArray && sequenceFormArray[0] && <div>
          <span>sequenceFormArray: {sequenceFormArray[0].command}</span>
        </div>}

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

Routing = connect(
  state => ({
    initialValues: {sequences:state.route.sequences},
    sequenceFormArray: selector(state, "sequences"),
  })
)(Routing)

const mapDispatchToProps = (dispatch) => ({
    blurHandler: bindActionCreators(blur, dispatch),
    changeHandler: bindActionCreators(change, dispatch)
})

const mapStateToProps = function(store) {
  // maps store.route to this.props
  return store.route
}

export default connect(mapStateToProps, mapDispatchToProps)(Routing);
