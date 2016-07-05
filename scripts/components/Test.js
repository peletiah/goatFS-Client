/*
  Test
*/

import React from 'react';
import Sortable from 'react-anything-sortable';
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

class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      items: ['four','five','six']
    };
  }

  render() {
    function renderWithSortable(renderItem, index) {
      return (
        <DemoHOCItem className="vertical" sortData="renderItem" key={index} dynamic>
          {console.log('rendering with sortable')}
          {renderItem+' sortable'}
        </DemoHOCItem>
      );
    }

     return (
      <div className="demo-container">
         <Sortable className="vertical-container" direction="vertical">
          {this.state.items.map(renderWithSortable, this)}
        </Sortable>
      </div>
    );
  }
};

export default Test;

