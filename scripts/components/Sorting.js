/*
  Sorting
*/

import React from 'react';
import Sortable from 'react-anything-sortable';
import DemoHOCItem from '../components/DemoHOCItem.js';

export default class Vertical extends React.Component {
  constructor() {
    super();
    this.state = {
      items: ['four','five','six']
    };
  }

 componentDidMount() {
    console.log('Loading Route Sequences from server')
    fetch('http://uberfl.us/sortable.json')
    .then(
      response => {
        return response.json()
      }
    )
    .then(
      items => {
        this.setState(items)
        console.log(items)
      }
    )
  };

  render() {
    function renderWithSortable(renderItem, index) {
      return (
        <DemoHOCItem className="vertical" sortData="renderItem" key={index}>
          {console.log('rendering items')}
          {renderItem+' sortable'}
        </DemoHOCItem>
      );
    }

     function renderWithoutSortable(renderItem, index) {
      return (
        <DemoHOCItem className="vertical ui-sortable-item" key={index}>
          {console.log('rendering without sortable')}
          <div className='vertical ui-sortable-item'>
          {renderItem+' not sortable'}</div>
        </DemoHOCItem>
      );
    }

    return (
      <div className="demo-container">
         <Sortable className="vertical-container" direction="vertical">
          {this.state.items.map(renderWithSortable, this)}
        </Sortable>
        <br/>
       <div className="vertical-container">
          {this.state.items.map(renderWithoutSortable, this)}
        </div>
      </div>
    );
  }
}
