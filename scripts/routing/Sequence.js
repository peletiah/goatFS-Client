import React, {PropTypes} from 'react';
import autobind from 'autobind-decorator'
import { sortable } from 'react-anything-sortable';
import {reduxForm} from 'redux-form';


@autobind
class SequenceForm extends React.Component {
  render() {
    const {fields: {sequence, command, data}, handleSubmit} = this.props;
    console.log(this.props)
    return(
      <form className="action" onSubmit={ handleSubmit }>
        <input type="command" size="8" {...command}/>
        <input type="data" size="35" {...data}/>
        <button type="submit">Submit</button>
      </form>
    );
  }
};

SequenceForm = reduxForm({
  form: 'sequenceform',
  fields: ['sequence','command','data']
},
state => ({
//  initialValues: state.routeState.sequences
  initialValues: {sequence: 'sadf', command: 'asdf', data:'asdfasdf'}
}),
{ load: data => ({ type: LOAD, data }) }
) (SequenceForm)

export default SequenceForm

/*
Notes:
onChange={ this.props.handleAlterSequence.bind(this, sequence) }:
  the ".bind" at the end of the function binds the event-object to "this" and
  we can use it in handleAlterSequence(sequence, event) - notice that the 
  argument order gets reversed
  ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

*/

@autobind
@sortable
class Sequence extends React.Component {


  render() {
    const {sortData: {sequence, command, data}, handleAlterSequence} = this.props

    return (
      <div { ...this.props }>
        <span className="sequence-order">{ sequence }</span>
        <SequenceForm onSubmit={ handleAlterSequence.bind(this) } formKey={ sequence.toString() }/>
        <span className="action">{sequence} { command } { data } </span>
      </div>
    );
  }
};


export default Sequence;


