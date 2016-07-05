/*
  Test
*/

import React from 'react';
import Sortable from 'react-anything-sortable';
import { sortable } from 'react-anything-sortable';
import Link from 'valuelink'
import { Input, TextArea, Select, Radio, Checkbox } from 'valuelink/tags'
import shortid from 'shortid'

@sortable
class DemoHOCItem extends React.Component {

  constructor() {
      super();
      this.state = {
        sequence : 0,
        info : '',
        other: ''
      };
    }

 componentWillMount() {
    console.log(this.props.sortData.value)
    this.setState( this.props.sortData.value );
  }


  render() {
    const linked = Link.all( this, 'sequence', 'info', 'other' ),
      infoLink   = this.props.sortData.at( 'info')
  
    const jointLink = Link.value( linked.info.value, x => {
      linked.info.set( x );
      infoLink.set( x);
    });


    return (
      <div {...this.props}>
        <span>{linked.sequence.value}</span>
        <Input valueLink={ jointLink }></Input>
      </div>
    );
  }
}

export default DemoHOCItem;

class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      _sortableKey: 0      
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

  handleSort(sortedArray) {
    console.log('Entering handleSort')
    this.state._sortableKey++;
    var newItems = []
    var i=1
    console.log(sortedArray)
    sortedArray.map(function(item) {item.value.sequence=i, ++i, newItems.push(item.value)})
    console.log(newItems)
    this.setState({
      items: newItems
    });
  }

  render() {

    const itemsLink = Link.state( this, 'items' );


    function renderWithSortable(itemLink, index) {
      return (
        <DemoHOCItem className="vertical" sortData={ itemLink } key={ ['item',index].join('_') }>
          {console.log('Rendering Items')}
          {itemLink.sequence}
        </DemoHOCItem>
      );
    }

     return (
      <div className="demo-container">
         <Sortable className="vertical-container" onSort={::this.handleSort} key={ this.state._sortableKey } dynamic>
          {itemsLink.map(renderWithSortable, this)}
        </Sortable>
      </div>
    );
  }
};

export default Test;

