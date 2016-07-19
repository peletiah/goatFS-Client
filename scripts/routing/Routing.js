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

const renderSequences = ({ fields, moveSequence }) => (
  <div className="route">
    {fields.map((sequenceField, index) =>
      <Sequence key={ `${sequenceField}.sequence` } 
                index={ index }
                moveSequence ={ moveSequence }
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
    this.moveSequence = this.moveSequence.bind(this);
  }


  
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
    ),
    this.props.initialize()
  };


  moveSequence(dragIndex, hoverIndex) {
    const { sequences } = this.props;
    const dragSequence = sequences[dragIndex];
   
    store.dispatch({
      type:'MOVE_SEQUENCE',
      hoverIndex: hoverIndex,
      dragIndex: dragIndex,
      sequences: sequences
    })
  }
  
 
  render() {
    const { sequences } = this.props

    return (
      <div>
        <FieldArray name="sequences"
            component   =  { renderSequences }
            moveSequence = { this.moveSequence }
        />
        <button type="button" onClick={ this.saveRoute }>Save</button>
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

