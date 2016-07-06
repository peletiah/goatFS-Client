import React, {PropTypes} from 'react';
import autobind from 'autobind-decorator'
import { sortable } from 'react-anything-sortable';
import store from '../store/Store'


@autobind
@sortable
class Sequence extends React.Component {


  render() {
    const action = this.props.sortData

    function updateSequence( event ) {
      console.log( 'change', action.sequence, event.target.value )
      var newSequence = {...action, data: event.target.value}
      console.log('newSequence', newSequence)
      store.dispatch({
        type: 'UPDATE_SEQUENCE',
        sequence: newSequence
      });
    }

    return (
      <div { ...this.props }>
        <span className="sequence-order">{ action.sequence }</span>
        <div className="action">
          <select defaultValue={ action.command }>
            <option>Option 1</option>
            <option value={ action.command }>{ action.command }</option>
            <option>Option 3</option>
          </select>
          <input defaultValue={ action.data } onChange={ updateSequence }size="35"></input>
        </div>
      </div>
    );
  }
};

export default Sequence;
