import React, {PropTypes} from 'react';
import { sortable } from 'react-anything-sortable';
import Link from 'valuelink';
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags'


@sortable
class Sequence extends React.Component {

    constructor() {
      super();
      this.state = {
        sequence : 0,
        command: '',
        data: ''
      };
    }

  componentWillMount() {
    this.setState( this.props.sortData.value );
  }
  
  render() {
    const linked = Link.all ( this, 'sequence', 'command', 'data' );

    function inputChange(event) {
      console.log('asdf')
      console.log(event.target.value)
    }

    const setValue = (x, e) => e.target.value

    return (
      <div {...this.props}>
        {console.log(linked)}
        <span className="sequence-order">{linked.sequence.value}</span>
        <div className="action">
          <select onChange={this.change} valueLink={linked.command}>
            <option>Option 1</option>
            <option value={linked.command.value}>{linked.command.value}</option>
            <option>Option 3</option>
          </select>
          <input value={linked.data.value} onChange={linked.data.action( setValue) } size="35"></input>
        </div>
      </div>
    );
  }
};

Sequence.propTypes = {
  sortData : PropTypes.instanceOf( Link ).isRequired
}

export default Sequence;
