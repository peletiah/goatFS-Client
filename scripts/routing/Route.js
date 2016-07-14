import React, {PropTypes} from 'react';
import autobind from 'autobind-decorator'
import Sortable, {sortable} from 'react-anything-sortable';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import store from '../store/Store'

/*
Notes:
onChange={ this.props.handleAlterSequence.bind(this, sequence) }:
  the ".bind" at the end of the function binds the event-object to "this" and
  we can use it in handleAlterSequence(sequence, event) - notice that the 
  argument order gets reversed
  ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

*/


const renderField = field => (
  <span>
      <input {...field.input}/>
      {field.touched && field.error && <span>{field.error}</span>}
  </span>
)

const renderSpan = field => (
  <span className="sequence-order">
    {field.input.value} 
  </span>
)

@sortable
class Sequence extends React.Component {

  render() {
    const { sequenceField } = this.props

    return (
      <div 
        className={ this.props.className }
        style={ this.props.style }
        onMouseDown={ this.props.onMouseDown }
        onTouchStart={ this.props.onTouchStart }
      >
        <Field
          name={`${sequenceField}.sequence`}
          type="text"
          component={renderSpan}/>
        <div className="action">
          <Field
            name={`${sequenceField}.command`}
            type="text"
            component={renderField}
            placeholder="command"/>
          <Field
            name={`${sequenceField}.data`}
            type="text"
            component={renderField}
            placeholder="data"/>
        </div>
      </div>
    );
  }
};


export default Sequence;


class renderSequences extends React.Component {
  render() {
    const { fields, handleSort, sortableKey, sequences } = this.props


    function renderItem(sequenceField, index) {

      return (
        <Sequence key={ ['sequence',index].join('_') } className="sequence" sortData={sequences[index]} sequenceField={ sequenceField }>
        </Sequence>

      )
    }  


    return(
      <Sortable className="route" onSort={ handleSort } key={ sortableKey } dynamic>
        {fields.map(renderItem, this)}
      </Sortable>
    )
  }

}

class Route extends React.Component {

  componentDidMount() {
    this.props.initialize()
  }

  render() {
    const { 
      sequences, 
      handleSubmit, 
      handleSort, 
      saveRoute,
      sortableKey
    } = this.props


    return (
      <div>
        <FieldArray name="sequences" 
          component   = { renderSequences }
          handleSort  = { handleSort }
          sortableKey = { sortableKey }
          sequences   = { sequences }
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={ saveRoute }>Save</button>

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

Route = reduxForm({
    form: 'sequenceform',
  }
)(Route)

Route = connect(
  state => ({
    initialValues: {sequences:state.routeState.sequences}
  })
)(Route)


export default Route;
