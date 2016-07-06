import React, {PropTypes} from 'react'
import autobind from 'autobind-decorator'
import { Sortable } from 'react-sortable'

@autobind
class ListItem extends React.Component {

  static displayName = 'SortableListItem'

  render() {
    return (
      <div {...this.props} id={'list' + this.props.sortId}>
        <span className="sequence-order">{this.props.item.sequence}</span>
        <div className="action">
          <input defaultValue={this.props.item.command}></input>
        </div>
      </div>
    )
  }
}

export default Sortable(ListItem)
