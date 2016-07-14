import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import store from '../store/Store'




const renderField = field => (
  <span>
      <input {...field.input}/>
      {field.touched && field.error && <span>{field.error}</span>}
  </span>
)

const renderSpan = field => (
  <span className="sequence-order">
    {field.input.value}
  </span>
)


const sequenceSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
}

const sequenceTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveSequence(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;  
  }
}


@DropTarget(ItemTypes.SEQUENCE, sequenceTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.SEQUENCE, sequenceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Sequence extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    sequenceField: PropTypes.any.isRequired,
    moveSequence: PropTypes.func.isRequired
  };

  render() {
    const { sequenceField, 
            isDragging,
            connectDragSource,
            connectDropTarget            
          } = this.props

    return connectDragSource(connectDropTarget(
      <div className="sequence">
        <Field
          name={`${sequenceField}.sequence`}
          type="text"
          component={renderSpan} />
        <div className="action">
          <Field
            name={`${sequenceField}.command`}
            type="text"
            component={renderField}
            placeholder="command"/>
          <Field
            name={`${sequenceField}.data`}
            type="text"
            component={renderField}
            placeholder="data"/>
        </div>
      </div>
    ));
  }
}

export default Sequence;
