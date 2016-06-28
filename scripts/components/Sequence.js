import React from 'react';
import { sortable } from 'react-anything-sortable';


@sortable
class Sequence extends React.Component {
  render() {
    return (
      <div {...this.props}>
        <span className="sequence-order">{this.props.sortData.sequence}</span>
        <div className="action">
          <select onChange={this.change} defaultValue={this.props.sortData.command}>
            <option>Option 1</option>
            <option value={this.props.sortData.command}>{this.props.sortData.command}</option>
            <option>Option 3</option>
          </select>
          <input defaultValue={this.props.sortData.data} onChange={this.change}></input>
        </div>
      </div>
    );
  }
};

export default Sequence;
