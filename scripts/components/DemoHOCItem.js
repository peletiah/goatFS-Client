import React from 'react';
import { sortable } from 'react-anything-sortable';

@sortable
class DemoHOCItem extends React.Component {
  render() {
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default DemoHOCItem;

