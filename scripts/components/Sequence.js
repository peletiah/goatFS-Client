import React, {PropTypes} from 'react';
import autobind from 'autobind-decorator'
import { sortable } from 'react-anything-sortable';
import Link from 'valuelink';
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags'
import shortid from 'shortid'


@autobind
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
    const linked = Link.all ( this, 'sequence', 'command', 'data' ),
          dataLink   = this.props.sortData.at( 'data'),
          commandLink = this.props.sortData.at( 'command' ),
          dataUpdate = linked.data.onChange ( x => dataLink.set( x ) );

    return (
      <div {...this.props}>
        <span className="sequence-order">{linked.sequence.value}</span>
        <div className="action">
          <Select valueLink={ linked.command.onChange( x => commandLink.set( x ) )}>
            <option>Option 1</option>
            <option value={ linked.command.value }>Option 2</option>
            <option>Option 3</option>
          </Select>
          <Input valueLink={ dataUpdate } size="35"></Input>
        </div>
      </div>
    );
  }
};

Sequence.propTypes = {
  sortData : PropTypes.instanceOf( Link ).isRequired
}

export default Sequence;