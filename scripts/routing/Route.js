/*
  Route
*/

import React, { Component } from 'react'
import autobind from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Field, FieldArray, reduxForm, formValueSelector, change, blur } from 'redux-form';
import Sequence from './Sequence'
import store from '../store/Store'
import Multiselect from 'react-widgets/lib/Multiselect'
import {
  fetchRoute,
  addSequence,
  alterSequence,
  moveSequence,
  removeSequence,
  addTarget,
  saveRoute
} from './Actions'

const renderSequences = ({ 
  fields, 
  meta: { touched, error }, 
  alterSequence, 
  moveSequence, 
  removeSequence, 
  sequenceFormArray, 
  availableExtensions, 
  applicationCatalog, 
  changeHandler, 
  addTarget,
  blurHandler,
  hoverOverInput,
  hoverOutOfInput,
  overInput
}) => (
  <div className="route">
    {fields.map((sequenceField, index) => 
          <Sequence 
                key                 = { `${sequenceField}.sequence` } 
                index               = { index }
                alterSequence       = { alterSequence }
                moveSequence        = { moveSequence }
                removeSequence      = { removeSequence }
                sequenceFormArray   = { sequenceFormArray[index] }
                changeHandler       = { changeHandler }
                addTarget           = { addTarget }
                blurHandler         = { blurHandler }
                availableExtensions = { availableExtensions }
                applicationCatalog  = { applicationCatalog } 
                className           = "sequence" 
                sequenceField       = { sequenceField }
                hoverOverInput      = { hoverOverInput }
                hoverOutOfInput     = { hoverOutOfInput }
                overInput           = { overInput }
 
            />
    )}
  </div>
)


@DragDropContext(HTML5Backend)
class Route extends Component {
  
  constructor(props) {
    super(props);
    this.commitRoute = this.commitRoute.bind(this);
    this.hoverOverInput = this.hoverOverInput.bind(this);
    this.hoverOutOfInput = this.hoverOutOfInput.bind(this);
    this.state = {
      overInput: true,
    };
  }


  
  componentDidMount() {
    const routeId = 1
    const { dispatch } = this.props
    dispatch(fetchRoute(routeId))
    this.props.initialize()
  };


  commitRoute (e) {
    e.preventDefault()
    console.log('saving route through dispatch', e)
    const routeId = 1
    const { dispatch } = this.props
    dispatch( saveRoute( routeId ))
  }

  hoverOverInput()
  {
    // mouse is over input-field
    this.setState({ overInput: true })
  }

  hoverOutOfInput()
  {
    // mouse moved out of input-field
    this.setState({ overInput: false })
  }
 
  render() {
    const { 
      availableExtensions, 
      applicationCatalog, 
      changeHandler, 
      blurHandler,
      sequenceFormArray,
    } = this.props

    const { overInput } = this.state;

    if (sequenceFormArray) {
      return (
        <div>
          <button type="button" onClick={ addSequence }>Add Sequence</button>

          <FieldArray 
              name                = "sequences"
              component           = { renderSequences }
              alterSequence       = { alterSequence }
              moveSequence        = { moveSequence }
              changeHandler       = { changeHandler }
              blurHandler         = { blurHandler }
              addTarget           = { addTarget }
              removeSequence      = { removeSequence }
              sequenceFormArray   = { sequenceFormArray }
              availableExtensions = { availableExtensions }
              applicationCatalog  = { applicationCatalog }
              hoverOverInput      = { this.hoverOverInput }
              hoverOutOfInput     = { this.hoverOutOfInput }
              overInput           = { overInput }
          />

          <button type="button" onClick={ this.commitRoute }>Save</button>
      </div>
      );
    }
    else
      {
        return(<div/>)
      }
  }
};


const FORM_NAME = 'routingForm'

Route = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true
  }
)(Route)

const selector = formValueSelector(FORM_NAME)

const mapDispatchToProps = (dispatch) => ({
      blurHandler: bindActionCreators(blur, dispatch),
      changeHandler: bindActionCreators(change, dispatch)
      })

// maps store.routes to this.props
// this gets "this.props" into Route-component
const mapStateToProps = (store) => ({
  routes: store.routes
})


Route = connect(
  state => {
    return {
      sequenceFormArray: selector(state, "sequences"),
      initialValues: {
        sequences: state.route.sequences,
        availableExtensions: state.route.availableExtensions,
        applicationCatalog: state.route.applicationCatalog,
      }
    }
  }
)(Route)

Route = connect(mapStateToProps, mapDispatchToProps)(Route)

export default Route;
