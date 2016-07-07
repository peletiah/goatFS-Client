import React, {PropTypes} from 'react';
import autobind from 'autobind-decorator'
import { sortable } from 'react-anything-sortable';
import {reduxForm} from 'redux-form';


@autobind
@sortable
class Sequence extends React.Component {


  render() {
    const sequence = this.props.sortData

    return (
      <div { ...this.props }>
        <span className="sequence-order">{ sequence.sequence }</span>
        <div className="action">
          <select defaultValue={ sequence.command }>
            <option>Option 1</option>
            <option value={ sequence.command }>{ sequence.command }</option>
            <option>Option 3</option>
          </select>
          <input defaultValue={ sequence.data } onChange={ this.props.handleAlterSequence.bind(this, sequence) } size="35"/>
          {sequence.sequence} { sequence.command } { sequence.data }
        </div>
      </div>
    );
  }
};

export default Sequence;

/*
Notes:
onChange={ this.props.handleAlterSequence.bind(this, sequence) }:
  the ".bind" at the end of the function binds the event-object to "this" and
  we can use it in handleAlterSequence(sequence, event) - notice that the 
  argument order gets reversed
  ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

*/

