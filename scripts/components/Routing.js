/*
  Routing
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Log from './Log';
import Sortable from 'react-anything-sortable';
import Sequence from './Sequence'

class Routing extends React.Component {

 constructor() {
   super();
   this.state = {
     routes: [],
   };
   this._sortableKey = 0;
 }

 componentDidMount() {
   console.log('Loading Route Sequences from server')
   fetch('http://localhost:6543/route/1/1', {
     credentials: 'include',
     headers: {'X-CSRF-TOKEN': this.props.csrfToken
     }
   }).then(r => r.json())
     .then(data => this.setState({
       routes: data
     }))
     .catch(e => console.log('Error'))
 };

 handleSort(sortedArray) {
   this._sortableKey++;
   this.setState({
     routes: sortedArray
   });
 }

 handleAddElement() {
   this._sortableKey++;
   this.setState({
     /*routes: this.state.routes.concat(Math.round(Math.random() * 1000))*/
     routes: this.state.routes.concat({"sequence": this._sortableKey, "data": "", "command": ""})
   });
 }

 handleRemoveElement(index) {
   const newArr = this.state.routes.slice();
   newArr.splice(index, 1);
   this._sortableKey++;

   this.setState({
     routes: newArr
   });
 }


  render() {
    function renderItem(sequence, index) {
      return (
        <Sequence key={index} className="sequence" sortData={sequence}>
        {console.log(sequence)}
          {sequence.sequence}
          <span className="delete"
            onMouseDown={this.handleRemoveElement.bind(this, index)}
          >&times;</span>
       </Sequence>
      );
    }

    return (
      <div>
        <button onClick={::this.handleAddElement}>Add 1 element</button>
        <Sortable className="route" key={this._sortableKey} onSort={::this.handleSort}>
          {this.state.routes.map(renderItem, this)}
        </Sortable>
      </div>
    );
  }
};

export default Routing;
