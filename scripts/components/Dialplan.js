/*
  Dialplan
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';
import Sortable from 'react-anything-sortable';
import DemoItem from './DemoItem'
import SortableItem from './SortableItem'

class Dialplan extends React.Component {

 constructor() {
   super();
   this.state = {
     arr: [123,645,243]
   };
   this._sortableKey = 0;
 }

 handleSort(sortedArray) {
   this._sortableKey++;
   this.setState({
     arr: sortedArray
   });
 }

 handleAddElement() {
   this._sortableKey++;
   this.setState({
     arr: this.state.arr.concat(Math.round(Math.random() * 1000))
   });
 }

 handleRemoveElement(index) {
   const newArr = this.state.arr.slice();
   newArr.splice(index, 1);
   this._sortableKey++;

   this.setState({
     arr: newArr
   });
 }

  render() {
    function renderItem(num, index) {
      return (
        <SortableItem key={index} className="dynamic-item" sortData={num}>
         {num}
         <span className="delete"
           onMouseDown={this.handleRemoveElement.bind(this, index)}
           >&times;</span>
       </SortableItem>
      );
    }

    return (
      <div className="demo-container">
        <div className="dynamic-demo">
          <button onClick={::this.handleAddElement}>Add 1 element</button>
          <Sortable key={this._sortableKey} onSort={::this.handleSort}>
            {this.state.arr.map(renderItem, this)}
          </Sortable>
        </div>
      </div>
    );
  }
};

export default Dialplan;
