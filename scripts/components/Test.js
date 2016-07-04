/*
  Test
*/

import React, {PropTypes} from 'react'
import autobind from 'autobind-decorator'
import SortableListItem from './ListItem'
import { Sortable } from 'react-sortable'
import shortid from 'shortid'

@autobind
class Test extends React.Component {
  constructor() {
      super();
      this.state = {
        draggingIndex: null,
          items: [{"sequence": 1, "command": "log", "data": "INFO Calling Extension 200"}, {"sequence": 2, "command": "set", "data": "effective_caller_id_name=John"}, {"sequence": 3, "command": "bridge", "data": "user/200"}]
      };
    }

  updateState(obj) {
    this.setState(obj);
  }


  render () {


    var listItem = this.state.items.map(function(item, i) {
      return (
        <SortableListItem 
          key={i} 
          updateState={this.updateState}
          items={this.state.items}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          item={item}
          className="sequence"
          />
      );
    }, this);

    return(
      <div className="route">{listItem}</div>
    )
  }
};

export default Test

