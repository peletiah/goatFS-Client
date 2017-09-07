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
    console.log('Route componentDidMount props: ',this.props)
    const routeId = this.props.match.params.id
    const { dispatch } = this.props
    dispatch(fetchRoute(routeId))
    this.props.initialize()
  };


  commitRoute (e) {
    e.preventDefault()
    console.log('saving route through dispatch', e)
    console.log('commitRoute: ',this.props)
    const routeId = this.props.match.params.id
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
      sequenceFormArray
    } = this.props

    console.log(this.props)
    console.log('sequenceFormArray',sequenceFormArray)

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

function testbla(state) {
  console.log('testbla',state)
  const routeId = Number(state.router.location.pathname.slice(-1))
  console.log("routeId",routeId, typeof(routeId))
  const routeIndex=getIndex(routeId,state.routes,'id')
  console.log("routeIndex",routeIndex)
  console.log(state.routes[routeIndex])
  if ( routeIndex == -1 )
    return state.routes[0].sequences
  else
    return state.routes[routeIndex].sequences
}

const FORM_NAME = 'routeForm'

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

// puts store.routes into props for the component above
const mapStateToProps = (store) => ({
  routes: store.routes
})


Route = connect(
  state => {
    return {
      sequenceFormArray: selector(state, "sequences"),
      initialValues: {
        sequences: testbla(state),
        availableExtensions: state.routes[1].availableExtensions,
        applicationCatalog: state.routes[1].applicationCatalog,
      }
    }
  }
)(Route)

Route = withRouter(connect(mapStateToProps, mapDispatchToProps)(Route))

export default Route;
