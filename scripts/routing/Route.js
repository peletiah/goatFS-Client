/*
  Route
*/

import React, { Component } from 'react'
import autobind from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withRouter } from 'react-router-dom'
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

import { getIndex } from './RouteReducer'

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
  overInput,
  routesIndex,
  formName
}) => (
  <div className="route">
    {fields.map((sequenceField, index) => 
          <Sequence 
                key                 = { `${sequenceField}.sequence` } 
                index               = { index }
                alterSequence       = { alterSequence }
                moveSequence        = { moveSequence }
                removeSequence      = { removeSequence }
                sequenceFormValues  = { sequenceFormArray[index] }
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
                routesIndex         = { routesIndex }
                formName	          = { formName }
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
      overInput: false,
    };
  }


  
  componentDidMount() {
    const routeId = this.props.match.params.id
    const { dispatch } = this.props
    dispatch(fetchRoute(routeId))
    this.props.initialize()
  };


  commitRoute (event, routesIndex) {
		console.log("commitRoute",routesIndex)
    const routeId = this.props.match.params.id
    event.preventDefault()
    const { dispatch } = this.props
    dispatch( saveRoute( routeId, routesIndex ))
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

  handleAddSequence(e)
  {
    e.preventDefault()
    const routeId = Number(this.props.match.params.id)
    addSequence(routeId)
  }
 
  render() {
    const {
      changeHandler, 
      blurHandler,
      sequenceFormArray,
      match,
      routes,
			form
    } = this.props

    const routeId = Number(match.params.id)

    // don't render FieldArray as long as sequenceFormArray
    // has not updated
    let routesIndex, routesCount = -1
    let availableExtensions, applicationCatalog;
    if (sequenceFormArray)
    {
      routesIndex = getIndex(routeId, this.props.routes,'id')
      const route = this.props.routes[routesIndex]
      console.log('route',route)
      routesCount = route.sequences.length
      availableExtensions = route.availableExtensions
      applicationCatalog = route.applicationCatalog
    }

    const { overInput } = this.state;
    console.log("props in Route", this.props)

    if (sequenceFormArray && sequenceFormArray.length == routesCount) {
      return (
        <div>
          <button type="button" onClick={ this.handleAddSequence.bind(this) }>Add Sequence</button>

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
              routesIndex         = { routesIndex }
              formName	          = { form }
          />

          <button type="button" onClick={(evt) => this.commitRoute(evt, routesIndex) }>Save</button>
      </div>
      );
    }
    else
      {
        return(<div>nothing</div>)
      }
  }
};

function getValuesByIndex(state) {
  const routeId = Number(state.router.location.pathname.slice(-1))
  const routesIndex=getIndex(routeId,state.routes,'id')
  if ( routesIndex == -1 )
    return state.routes[0]
  else
    return state.routes[routesIndex]
}

const FORM_NAME = 'routeForm'

Route = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true
  }
)(Route)

const mapDispatchToProps = (dispatch) => ({
      blurHandler: bindActionCreators(blur, dispatch),
      changeHandler: bindActionCreators(change, dispatch)
      })

// puts store.routes into props for the component above
const mapStateToProps = (store) => ({
  routes: store.routes
})

const FVselector = formValueSelector(FORM_NAME)

//Setup initial values for redux-form
// intialValues are put in props.initialValues
// they are used to re-initialize the form/component 
// when they change
// http://redux-form.com/7.0.3/examples/initializeFromState/
// http://redux-form.com/7.0.3/docs/api/FormValueSelector.md/
Route = connect(
  state => {
    return {
      sequenceFormArray: FVselector(state, "sequences"),
      initialValues: {
        sequences: getValuesByIndex(state).sequences,
        availableExtensions: getValuesByIndex(state).availableExtensions,
        applicationCatalog: getValuesByIndex(state).applicationCatalog	
      }
    }
  }
)(Route)

Route = withRouter(connect(mapStateToProps, mapDispatchToProps)(Route))

export default Route;
